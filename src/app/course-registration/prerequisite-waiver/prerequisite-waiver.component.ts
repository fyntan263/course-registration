import { Component } from '@angular/core';
import { Course, StudentInfo } from '../../models/models';
import { Observable, OperatorFunction, Subject, combineLatest, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { DataService } from '../../services/data.service';
import { CourseEligibilityService } from '../course-eligibility.service';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbCollapseModule, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CourseDetailComponent } from '../course-detail/course-detail.component';
import { PrerequisiteTooltipPipe } from '../pipes/prerequisite-tooltip.pipe';
import { JsonUtils } from '../../utils/json-utils';

@Component({
  selector: 'app-prerequisite-waiver',
  standalone: true,
  imports: [CourseDetailComponent,FormsModule, CommonModule,NgbModule, HttpClientModule, PrerequisiteTooltipPipe],
  providers: [DataService],
  templateUrl: './prerequisite-waiver.component.html'
})
export class PrerequisiteWaiverComponent {
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
  pageSize = 8;
  collectionSize = 0;

  constructor(private dataService: DataService, private courseEligibilityService: CourseEligibilityService) { }

  ngOnInit(): void {
    this.getCourses();
    this.getStudent();
    this.filteredCourses$ = combineLatest([
      this.searchQuery.pipe(startWith(''), debounceTime(100), distinctUntilChanged()),
      this.dataService.getCourses()
    ]).pipe(
      map(([term, courses]) => {
        this.coreCourses = courses.filter(course => course.isCore);
        this.collectionSize = this.coreCourses.length;
        return this.filterCourses(term);
      }),
      map(filteredCourses => this.paginateCourses(filteredCourses))
    );
  }

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
          course.name.toLowerCase().includes(term.toLowerCase())
        );
  }

  paginateCourses(courses: Course[]): Course[] {
    this.collectionSize = courses.length;
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return courses.slice(start, end);
  }

  getCourses() {
    this.dataService.getCourses().subscribe({
      next: data => { this.coreCourses = data.filter(course => course.isCore); },
    });
  }

  getStudent() {
    this.dataService.getStudent().subscribe({
      next: data => { this.currentStudent = data as StudentInfo; console.log("STUDENTS INFO: ", data); },
      error: err => console.log("ERROR: ", err),
      complete: () => { console.log("DONE"); }
    });
  }

  toggleCollapse(courseCode: string): void {
    this.collapsedStates[courseCode] = !this.collapsedStates[courseCode];
  }

  toggleCollapseApply(courseCode: string) {
    this.collapsedStatesApply[courseCode] = !this.collapsedStatesApply[courseCode];
  }

  closeInput(courseCode: string) {
    this.currentStudent.rollNo;
    this.currentStudent.preRequisiteWaivers.push(courseCode);

    let request = {
      rollNo: this.currentStudent.rollNo,
      courseCode: courseCode,
      reason: this.reasonInput,
      preReqWaiverRequest: true
    }
    JsonUtils.downloadJson(request);
    this.collapsedStatesApply[courseCode] = false;
  }

  isCourseAlreadyCompleted(course: Course): boolean {
    if (this.currentStudent) {
      return this.courseEligibilityService.isComplete(this.currentStudent.completedCourses, course.code);
    }
    return false;
  }

  isPrerequisiteMet(course: Course): boolean {
    if (this.currentStudent && this.currentStudent.completedCourses.length) {
      return this.courseEligibilityService.isPrerequisiteMet(this.currentStudent.completedCourses, course.preRequisites);
    }
    return false;
  }

  isPrerequisiteWaiverApplied(course: Course) {
    if (this.currentStudent) {
      return this.courseEligibilityService.isWaiverApplied(this.currentStudent.preRequisiteWaivers, course.code);
    }
    return false;
  }

  onPageChange(page: number) {
    this.page = page;
    this.filteredCourses$ = combineLatest([
      this.searchQuery.pipe(startWith(this.currentSearchQuery), debounceTime(100), distinctUntilChanged()),
      this.dataService.getCourses()
    ]).pipe(
      map(([term, courses]) => {
        this.coreCourses = courses.filter(course => course.isCore);
        return this.filterCourses(term);
      }),
      map(filteredCourses => this.paginateCourses(filteredCourses))
    );
  }
}