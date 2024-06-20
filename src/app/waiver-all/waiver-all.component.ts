import { Component, Input, ViewChild} from '@angular/core';
import * as types from '../models/models';
import { NgClass, DecimalPipe } from '@angular/common';
import { DataService } from '../services/data.service'
import { CourseEligibilityService } from '../services/course-eligibility.service';
import { NgbCollapseModule, NgbTooltipModule, NgbTypeahead, NgbTypeaheadModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, NgModel } from '@angular/forms';
import { Observable, Subject, merge, OperatorFunction, from } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';
import { JsonUtils } from '../utils/json-utils';
import { TestingTableComponent } from '../testing-table/testing-table.component';



@Component({
  selector: 'app-waiver-all',
  standalone: true,
  imports: [NgClass, NgbTooltipModule, NgbTypeaheadModule, FormsModule, NgbCollapseModule, TestingTableComponent, NgbPaginationModule, DecimalPipe],
  templateUrl: './waiver-all.component.html',
  styleUrl: './waiver-all.component.css',
  providers: [DataService, CourseEligibilityService],   //Add service in your component providers list
})
export class WaiverAllComponent {
  // programs: Map<string, string> = {} as Map<string, string>;
  collapsedStatesApply: { [key: string]: boolean } = {};

  selectedCourses : types.Course[] = [];
  student !: types.StudentInfo;
  displayedCourses : types.Course[] = [];
  availableCourses : types.Course[] = [];


  searchCourse: string = "";

  
  isCourseCompleted: boolean = false;
  isPrerequisiteMet: boolean = false;

  isCollapsed: boolean = true;

  reasonForWaiver: string = '';

  constructor(
    private courseEligibilityService: CourseEligibilityService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getCourses();
    this.refreshCourses();
    this.getStudent();
    // this.getDepartments();
    
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

  /* getDepartments(){ // subscribe for data
    this.dataService.getDepartments().subscribe({
      next: data => {this.programs = data as Map<string, string>; console.log("DEPARTMENT: ", data)},
      error: err => console.log("ERROR: ", err),
      complete:() => {
          console.log("DONE");
      },
    })

  } */


  public toggleCollapseApply(courseCode: string) {
    this.collapsedStatesApply[courseCode] = !this.collapsedStatesApply[courseCode];
  }

  
  searchForCourse(): void{
    this.selectedCourses = this.availableCourses.filter((v) => {
      if(v.name.toLowerCase().includes(this.searchCourse.toLowerCase())
      || v.code.toLowerCase().includes(this.searchCourse.toLowerCase()))
          return true;
      return false;
    });
  }

  

  // @ViewChild('instance', { static: true })
  // instance!: NgbTypeahead;

	// focus$ = new Subject<string>();
	// click$ = new Subject<string>();

	// search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
	// 	const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
	// 	const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
	// 	const inputFocus$ = this.focus$;
    
  //   this.stringIfy();


	// 	return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
	// 		map((term) =>
	// 			(term === '' ? this.selectedCodes : this.selectedCodes.filter((v) => {
  //         if(v.includes(this.searchCourse)){
  //           return true;
  //         }
  //         return false;
  //       })).slice(0, 10),
	// 		),
	// 	);
	// };

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
    this.student.preRequisiteWaivers.push(course.code);
    this.collapsedStatesApply[course.code] = !this.collapsedStatesApply[course.code]

    let request = {
      rollNo: this.student?.rollNo,
      courseCode: course.code,
      reason: this.reasonForWaiver,
      preReqWaiverRequest: true
    }


    JsonUtils.downloadJson(request);
  }

  isAppliedForWaiver(course: types.Course): boolean{
    if(this.student.preRequisiteWaivers.includes(course.code)){
      return true;
    }
    return false;
  }

  page = 1;
  pageSize = 5;

  refreshCourses(){
    this.displayedCourses = this.availableCourses.map((course, i) => ({ id: i + 1, ...course })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
  }

}
