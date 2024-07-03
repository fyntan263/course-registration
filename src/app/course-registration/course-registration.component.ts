import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, filter, map, of, startWith, switchMap, tap } from 'rxjs';
import { Course, StudentInfo } from '../models/models';
import { DataService } from '../services/data.service';
import { StudentCourse } from '../models/student-course.model';
import { CoursesTableComponent } from './courses-table/courses-table.component';

@Component({
  selector: 'app-course-registration',
  standalone: true,
  imports: [NgbNavModule, CommonModule, CoursesTableComponent],
  templateUrl: './course-registration.component.html'
})
export class CourseRegistrationComponent {
  isCoreCourses$ = new BehaviorSubject<boolean>(false);
  allCourses$!: Observable<StudentCourse[]>;
  coreCourses$!: Observable<StudentCourse[]>;
  
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.fetchInitialData();
    
    this.allCourses$ = this.dataService.enhancedCourses$.pipe(
      startWith([]),
      map(courses => courses.filter(course => !!course))
    );

    this.coreCourses$ = this.allCourses$.pipe(
      map(courses => courses.filter(course => course.isCore))
    );
  }
  toggleCourses() {
    this.isCoreCourses$.next(!this.isCoreCourses$.value);
  }
}

