import { Component, Input, NgModule } from '@angular/core';
import { Observable, Subject, combineLatest, startWith, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { PreWaiverApplyStatus } from '../../models/models';
import { StudentCourse } from '../../models/student-course.model';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-courses-table',
  standalone: true,
  imports: [NgbModule, FormsModule, CommonModule],
  templateUrl: './courses-table.component.html',
})
export class CoursesTableComponent {
  @Input({required:true}) courseList$!:Observable<StudentCourse[]>;
  PreWaiverStatus = PreWaiverApplyStatus;
  reasonInput:string  =''

  private searchQuery = new Subject<string>();
  private currentSearchQuery = '';

  filteredCourses$!: Observable<StudentCourse[]>;

  page = 1;
  pageSize = 5;
  collectionSize = 0;

  collapsedStates: { [key: string]: boolean } = {};
  collapsedStatesApply: { [key: string]: boolean } = {};

  constructor(private dataService: DataService){

  }

  ngOnInit(): void {
    this.filteredCourses$ = combineLatest([
      this.searchQuery.pipe(startWith(''), debounceTime(300), distinctUntilChanged()),
      this.courseList$
    ]).pipe(
      map(([term, courses]) => {
        this.collectionSize = courses.length;
        return this.filterCourses(term, courses);
      }),
      map(filteredCourses => this.paginateCourses(filteredCourses))
    );
  }

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.currentSearchQuery = inputElement.value;
    this.searchQuery.next(inputElement.value);
  }

  filterCourses(term: string, courses: StudentCourse[]): StudentCourse[] {
    return term.trim() === ''
      ? courses
      : courses.filter(course =>
          course.code.toLowerCase().includes(term.toLowerCase()) ||
          course.name.toLowerCase().includes(term.toLowerCase()) ||
          course.instructor.join(', ').toLowerCase().includes(term.toLowerCase())
        );
  }

  toggleCollapse(courseCode: string): void {
    this.collapsedStates[courseCode] = !this.collapsedStates[courseCode];
  }

  toggleCollapseApply(courseCode: string): void {
    this.collapsedStatesApply[courseCode] = !this.collapsedStatesApply[courseCode];
  }

  applyWaiverRequest(course: StudentCourse): void {
    const request = {
      rollNo: '', // This would be provided as part of the student context
      courseCode: course.code,
      reason: this.reasonInput,
      preReqWaiverRequest: true
    };
    course.preReqWaiverStatus= PreWaiverApplyStatus.APPLIED
    this.dataService.applyWaiver(course, request);
    this.reasonInput = ''; // Clear input reason
    this.collapsedStatesApply[course.code] = false;
  }

  paginateCourses(courses: StudentCourse[]): StudentCourse[] {
    this.collectionSize = courses.length;
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return courses.slice(start, end);
  }


  onPageChange(page: number): void {
    this.page = page;
    this.filteredCourses$ = combineLatest([
      this.searchQuery.pipe(startWith(this.currentSearchQuery), debounceTime(300), distinctUntilChanged()),
      this.courseList$
    ]).pipe(
      map(([term, courses]) => {
        return this.filterCourses(term, courses);
      }),
      map(filteredCourses => this.paginateCourses(filteredCourses))
    );
  }

  setPageSize(pageSize: number): void {
    this.pageSize = pageSize;
    this.onPageChange(this.page);
  }
}
