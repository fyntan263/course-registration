import { Component, OnInit } from '@angular/core';
import { Course, StudentInfo, Range, CoreCoursePlanSubmission } from '../../models/models';
import { DataService } from '../../services/data.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { PrerequisiteTooltipPipe } from '../pipes/prerequisite-tooltip.pipe';
import { CourseEligibilityService } from '../course-eligibility.service';
import { JsonUtils } from '../../utils/json-utils';

@Component({
  selector: 'app-review-courses',
  standalone: true,
  imports: [NgbModule, CommonModule, PrerequisiteTooltipPipe],
  providers: [CourseEligibilityService],
  templateUrl: './review-courses.component.html'
})
export class ReviewCoursesComponent implements OnInit {
  currentStudent: StudentInfo = {} as StudentInfo;
  availableCourses: Course[] = [];
  selectedCourses: Course[] = [];
  isSelectingCourses: boolean = true;
  isReviewingCourses: boolean = false;
  totalCredits: number = 0;
  creditRange: Range = {
    max: 24,
    min: 9
  };
  isCourseCompleted: boolean = false;
  isPrerequisiteMet: boolean = false;

  constructor(
    private courseEligibilityService: CourseEligibilityService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadStudentInfo();
  }

  loadCourses(): void {
    this.dataService.getCourses().subscribe({
      next: data => {
        this.availableCourses = data;
        console.log('COURSES: ', data);
      },
      error: err => console.log('ERROR: ', err),
      complete: () => console.log('DONE')
    });
  }

  loadStudentInfo(): void {
    this.dataService.getStudent().subscribe({
      next:data =>{this.currentStudent = data as StudentInfo; console.log("STUDENTS INFO: ", data)},
      error: err => console.log("ERROR: ", err),
      complete:() => {console.log("DONE")}
    }
    )
  }

  parseCredits(credits: string): number {
    return Number(credits.split('-')[3]);
  }

  isCourseSelected(course: Course): boolean {
    return this.selectedCourses.some(selectedCourse => selectedCourse === course);
  }

  isCourseAlreadyCompleted(course: Course): boolean {
    if (this.currentStudent) {
      return  this.courseEligibilityService.isComplete(this.currentStudent.completedCourses, course.code);
    }
    return false;
  }

  checkPrerequisiteMet(course: Course): boolean {
    if (this.currentStudent && this.currentStudent.completedCourses.length) {
      return  this.courseEligibilityService.isPrerequisiteMet(this.currentStudent.completedCourses, course.preRequisites);
    }
    return false;
  }

  
  dropCourse(course: Course): void {
    this.selectedCourses = this.selectedCourses.filter(selectedCourse => selectedCourse !== course);
    this.totalCredits -= this.parseCredits(course.credits);
  }

  addCourse(course: Course): void {
    this.selectedCourses.push(course);
    this.totalCredits += this.parseCredits(course.credits);
  }

  sendDataToServer(): void {
    if (this.currentStudent) {
      const coreCoursePlanSubmission = {
        rollNo: this.currentStudent.rollNo,
        riskStatus: false,
        totalCredits: this.totalCredits,
        coreCoursePlan: this.selectedCourses
      };
      JsonUtils.downloadJson(coreCoursePlanSubmission)
    }    

  }

  toggleView(): void {
    this.isSelectingCourses = !this.isSelectingCourses;
    this.isReviewingCourses = !this.isReviewingCourses;
  }
}