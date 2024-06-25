import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, tap } from 'rxjs';
import { Course, PreWaiverApplyStatus, PrerequisiteWaiverRequest, StudentInfo } from '../models/models';
import { CourseEligibilityService } from '../course-registration/course-eligibility.service';
import { StudentCourse } from '../models/student-course.model';
import { JsonUtils } from '../utils/json-utils';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataUrl = 'assets/data.json'; // Path to the JSON file

  private enhancedCoursesSubject = new BehaviorSubject<StudentCourse[]>([]);
  enhancedCourses$ = this.enhancedCoursesSubject.asObservable();

  private currentStudentSubject = new BehaviorSubject<StudentInfo | null>(null);
  currentStudent$ = this.currentStudentSubject.asObservable();

  constructor(
    private http: HttpClient,
    private courseEligibilityService: CourseEligibilityService
  ) {}

  // Method to fetch and precompute necessary data
  // fetchEnhancedCourses(): void {
  //   combineLatest([this.getCourses(), this.getStudent()])
  //     .pipe(
  //       map(([courses, student]) => {
  //         return courses.map((course) => ({
  //           ...course,
  //           isComplete: this.courseEligibilityService.isComplete(
  //             student.completedCourses,
  //             course.code
  //           ),
  //           isPrerequisiteMet: this.courseEligibilityService.isPrerequisiteMet(
  //             student.completedCourses,
  //             course.preRequisites
  //           ),
  //           preReqWaiverStatus:
  //             this.courseEligibilityService.getCourseRegistrationStatus(
  //               student.preRequisiteWaivers,
  //               course.code
  //             ) ?? PreWaiverApplyStatus.NOT_APPLIED,
  //         }));
  //       })
  //     )
  //     .subscribe((enhancedCourses) =>
  //       this.enhancedCoursesSubject.next(enhancedCourses)
  //     );
  // }

  // Method to fetch and precompute necessary data once
  fetchInitialData(): void {
    combineLatest([this.getCourses(), this.getStudent()]).pipe(
      tap(([courses, student]) => {
        this.currentStudentSubject.next(student);
      }),
      map(([courses, student]) => {
        return courses.map(course => ({
          ...course,
          isComplete: this.courseEligibilityService.isComplete(student.completedCourses, course.code),
          isPrerequisiteMet: this.courseEligibilityService.isPrerequisiteMet(student.completedCourses, course.preRequisites),
          preReqWaiverStatus: this.courseEligibilityService.getCourseRegistrationStatus(student.preRequisiteWaivers, course.code) ?? PreWaiverApplyStatus.NOT_APPLIED
        }));
      })
    ).subscribe(enhancedCourses => this.enhancedCoursesSubject.next(enhancedCourses));
  }

  // Method to apply for a waiver and update the status in the BehaviorSubject
  applyWaiver(course: StudentCourse, request:PrerequisiteWaiverRequest): void {
    const student = this.currentStudentSubject.value;
    if (!student) {
      return; // If the student data is not loaded yet, do nothing
    }

    const currentCourses = this.enhancedCoursesSubject.value.map(course =>
      course.code === course.code
        ? { ...course, preReqWaiverStatus: course.preReqWaiverStatus}
        : course
    );
    this.enhancedCoursesSubject.next(currentCourses);
    JsonUtils.downloadJson(request, "prerequisite-waiver-apply.json");
  }

  private getCourses(): Observable<Course[]> {
    return this.http.get<{ courses: Course[] }>(this.dataUrl).pipe(
      map(data => data.courses)
    );
  }

  private getStudent(): Observable<StudentInfo> {
    return this.http.get<{ studentInfo: StudentInfo }>(this.dataUrl).pipe(
      map(data => data.studentInfo)
    );
  }
}
