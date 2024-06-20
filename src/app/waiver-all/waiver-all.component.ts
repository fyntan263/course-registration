import { Component, Input, ViewChild} from '@angular/core';
import * as types from '../models/models';
import { NgClass, DecimalPipe, AsyncPipe } from '@angular/common';
import { DataService } from '../services/data.service'
import { CourseEligibilityService } from '../course-registration/course-eligibility.service';
import { NgbCollapseModule, NgbTooltipModule, NgbTypeahead, NgbTypeaheadModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, NgModel } from '@angular/forms';
import { Observable, Subject, merge, OperatorFunction, startWith, from, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { JsonUtils } from '../utils/json-utils';
import { TestingTableComponent } from '../testing-table/testing-table.component';


@Component({
  selector: 'app-waiver-all',
  standalone: true,
  imports: [NgClass, NgbTooltipModule, NgbTypeaheadModule, FormsModule, NgbCollapseModule, TestingTableComponent, NgbPaginationModule, DecimalPipe, AsyncPipe],
  templateUrl: './waiver-all.component.html',
  styleUrl: './waiver-all.component.css',
  providers: [DataService, CourseEligibilityService],   //Add service in your component providers list
})
export class WaiverAllComponent {
  // programs: Map<string, string> = {} as Map<string, string>;
  collapsedStatesApply: { [key: string]: boolean } = {};
  PreWaiverStatus = types.CourseRegistrationStatus

  selectedCourses : types.Course[] = [];
  student !: types.StudentInfo;
  displayedCourses : types.Course[] = [];
  availableCourses : types.Course[] = [];

  page = 1;
  pageSize = 5;
  collectionSize = 0;
  courseStatusMap: { [key: string]: types.CourseRegistrationStatus } = {};

  searchCourse: string = "";

  
  isCourseCompleted: boolean = false;
  // isPrerequisiteMet: boolean = false;

  isCollapsed: boolean = true;

  reasonForWaiver: string = '';

  constructor(
    private courseEligibilityService: CourseEligibilityService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getCourses();
    // this.refreshCourses();
    this.getStudent();
    // this.getDepartments();
    this.filteredCourses$ = combineLatest([
      this.searchQuery.pipe(startWith(''), debounceTime(300), distinctUntilChanged()),
      this.dataService.getCourses()
    ]).pipe(
      map(([term, courses]) => {
        this.coreCourses = courses.filter(course => course.isCore);
        this.collectionSize = this.coreCourses.length;
        // this.computeCourseStatuses();
        return this.filterCourses(term);
      }),
      map(filteredCourses => this.paginateCourses(filteredCourses))
    );
    
  }

  getCourses(){  // subscribe for data from the service
    this.dataService.getCourses().subscribe({
    next: data => {
      this.selectedCourses = data;
      // this.displayedCourses = data; 
      this.availableCourses = data;
      console.log("COURSES: ",data)
    },
    error: err => console.log("ERROR: ", err),
    complete:() => {console.log("DONE")}
    })
  }

  getStudent(){ // subscribe for data from the service
    this.dataService.getStudent().subscribe({
      next:data =>{this.student = data as types.StudentInfo; console.log("STUDENTS INFO: ", data)},
      error: err => console.log("ERROR: ", err),
      complete:() => {console.log("DONE")}
    }
    )
  }

  isPrerequisiteMet(course: types.Course): boolean {
    if (this.currentStudent && this.currentStudent.completedCourses.length) {
      return this.courseEligibilityService.isPrerequisiteMet(this.currentStudent.completedCourses, course.preRequisites);
    }
    return false;
  }

  toggleCollapse(courseCode: string): void {
    this.collapsedStates[courseCode] = !this.collapsedStates[courseCode];
  }


  public toggleCollapseApply(courseCode: string) {
    this.collapsedStatesApply[courseCode] = !this.collapsedStatesApply[courseCode];
  }

  
  

  isCourseSelected(course: types.Course): boolean {
    return this.selectedCourses.some(selectedCourse => selectedCourse === course);
  }

  isCourseAlreadyCompleted(course: types.Course): boolean {
    if (this.student) {
      return  this.courseEligibilityService.isComplete(this.student.completedCourses, course.code);
    }
    return false;
  }

  checkPrerequisiteMet(course: types.Course): boolean {
    if (this.student && this.student.completedCourses.length) {
      return  this.courseEligibilityService.isPrerequisiteMet(this.student.completedCourses, course.preRequisites);
    }
    return false;
  }

  applyForWaiver(course: types.Course): void{
    this.student.rollNo;
    this.student.preRequisiteWaivers.push({} as types.PrerequisiteWaiver);
    this.collapsedStatesApply[course.code] = !this.collapsedStatesApply[course.code]

    let request = {
      rollNo: this.student?.rollNo,
      courseCode: course.code,
      reason: this.reasonForWaiver,
      preReqWaiverRequest: true
    }


    JsonUtils.downloadJson(request);
  }

  // isAppliedForWaiver(course: types.Course): boolean{
  //   if(this.student.preRequisiteWaivers.includes(course.code)){
  //     return true;
  //   }
  //   return false;
  // }

  
  paginateCourses(courses: types.Course[]): types.Course[] {
    this.collectionSize = courses.length;
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return courses.slice(start, end);
  }

  onPageChange(page: number) {
    this.page = page;
    this.filteredCourses$ = combineLatest([
      this.searchQuery.pipe(startWith(this.currentSearchQuery), debounceTime(400), distinctUntilChanged()),
      this.dataService.getCourses()
    ]).pipe(
      map(([term, courses]) => {
        this.coreCourses = courses.filter(course => course.isCore);
        // this.computeCourseStatuses();
        return this.filterCourses(term);
      }),
      map(filteredCourses => this.paginateCourses(filteredCourses))
    );
  }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize;
    console.log('page size set to: ' , pageSize);
    this.onPageChange(1);
    
  }

  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.currentSearchQuery = inputElement.value
    this.searchQuery.next(inputElement.value);
  }

  filterCourses(term: string): types.Course[] {
    return term.trim() === ''
      ? this.coreCourses
      : this.coreCourses.filter(course =>
          course.code.toLowerCase().includes(term.toLowerCase()) ||
          course.name.toLowerCase().includes(term.toLowerCase()) ||
          course.instructor.join(", ").toLowerCase().includes(term.toLowerCase())
        );
  }

  

  
  //precomputing prerequisitewaiver statuses
  computeCourseStatuses(): void {
    if (this.currentStudent && this.coreCourses.length) {
      this.coreCourses.forEach(course => {
        this.courseStatusMap[course.code] = this.courseEligibilityService
          .getCourseRegistrationStatus(this.currentStudent.preRequisiteWaivers, course.code)??this.PreWaiverStatus.NOT_APPLIED;
      });
    }
  }

  private coreCourses: types.Course[] = [];
  reasonInput: string = '';
  private searchQuery = new Subject<string>();
  private currentSearchQuery = ''
  filteredCourses$!: Observable<types.Course[]>;
  currentStudent: types.StudentInfo = {} as types.StudentInfo;
  preReqWaiverRequest: boolean = false;
  collapsedStates: { [key: string]: boolean } = {};



  refreshCourses(){
    this.displayedCourses = this.availableCourses.map((course, i) => ({ id: i + 1, ...course })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
  }

}

/*

export class PrerequisiteWaiverComponent {
  PreWaiverStatus = PrerequisiteWaiverStatus
  private coreCourses: Course[] = [];
  reasonInput: string = '';
  private searchQuery = new Subject<string>();
  private currentSearchQuery = ''
  filteredCourses$!: Observable<Course[]>;
  currentStudent: StudentInfo = {} as StudentInfo;
  preReqWaiverRequest: boolean = false;
  collapsedStates: { [key: string]: boolean } = {};
  collapsedStatesApply: { [key: string]: boolean } = {};

  page = 1;
  pageSize = 5;
  collectionSize = 0;
  courseStatusMap: { [key: string]: PrerequisiteWaiverStatus } = {};
  constructor(private dataService: DataService, private courseEligibilityService: CourseEligibilityService) { }

  ngOnInit(): void {
    this.getCourses();
    this.getStudent();
    this.filteredCourses$ = combineLatest([
      this.searchQuery.pipe(startWith(''), debounceTime(300), distinctUntilChanged()),
      this.dataService.getCourses()
    ]).pipe(
      map(([term, courses]) => {
        this.coreCourses = courses.filter(course => course.isCore);
        this.collectionSize = this.coreCourses.length;
        this.computeCourseStatuses();
        return this.filterCourses(term);
      }),
      map(filteredCourses => this.paginateCourses(filteredCourses))
    );
  }

  //table search filtering 
  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.currentSearchQuery = inputElement.value
    this.searchQuery.next(inputElement.value);
  }

  filterCourses(term: string): Course[] {
    return term.trim() === ''
      ? this.coreCourses
      : this.coreCourses.filter(course =>
          course.code.toLowerCase().includes(term.toLowerCase()) ||
          course.name.toLowerCase().includes(term.toLowerCase()) ||
          course.instructor.join(", ").toLowerCase().includes(term.toLowerCase())
        );
  }

  

  
  //precomputing prerequisitewaiver statuses
  computeCourseStatuses(): void {
    if (this.currentStudent && this.coreCourses.length) {
      this.coreCourses.forEach(course => {
        this.courseStatusMap[course.code] = this.courseEligibilityService
          .getPrerequisiteWaiverStatus(this.currentStudent.preRequisiteWaivers, course.code)??this.PreWaiverStatus.NOT_APPLIED;
      });
    }
  }


  //pagination
  paginateCourses(courses: Course[]): Course[] {
    this.collectionSize = courses.length;
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return courses.slice(start, end);
  }

  onPageChange(page: number) {
    this.page = page;
    this.filteredCourses$ = combineLatest([
      this.searchQuery.pipe(startWith(this.currentSearchQuery), debounceTime(400), distinctUntilChanged()),
      this.dataService.getCourses()
    ]).pipe(
      map(([term, courses]) => {
        this.coreCourses = courses.filter(course => course.isCore);
        this.computeCourseStatuses();
        return this.filterCourses(term);
      }),
      map(filteredCourses => this.paginateCourses(filteredCourses))
    );
  }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize;
    console.log('page size set to: ' , pageSize);
    this.onPageChange(1);
    
  }
}
*/ 