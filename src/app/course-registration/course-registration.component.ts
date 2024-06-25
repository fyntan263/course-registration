import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCoursesComponent } from './core-courses/core-courses.component';
import { CoursesOfferedComponent } from './courses-offered/courses-offered.component';
import { Observable, filter, map, of, startWith } from 'rxjs';
import { Course, StudentInfo } from '../models/models';
import { DataService } from '../services/data.service';
import { StudentCourse } from '../models/student-course.model';

@Component({
  selector: 'app-course-registration',
  standalone: true,
  imports: [NgbNavModule, CoreCoursesComponent, CommonModule,  CoursesOfferedComponent],
  templateUrl: './course-registration.component.html'
})
export class CourseRegistrationComponent {
  
  active = 1;
  courses$!: Observable<StudentCourse[]>;
  coreCourses$!: Observable<StudentCourse[]>;
  studentInfo$!: Observable<StudentInfo>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    // Fetch the initial data
    this.dataService.fetchInitialData();
    
    this.courses$ = this.dataService.enhancedCourses$.pipe(
      startWith([]),  // Ensure it starts with an empty array,
      filter(courses => courses != null)
    );

    this.coreCourses$ = this.courses$.pipe(
      map(courses => courses.filter(course => course.isCore))
    );
  }

}

