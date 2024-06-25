import { Component, Input } from '@angular/core';
import {  Observable} from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentCourse } from '../../models/student-course.model';
import { CoursesTableComponent } from '../courses-table/courses-table.component';

@Component({
  selector: 'app-core-courses',
  standalone: true,
  imports: [NgbModule, FormsModule, CommonModule, CoursesTableComponent],
  templateUrl: './core-courses.component.html',
})
export class CoreCoursesComponent {
  @Input({ required: true }) coreCourses$!: Observable<StudentCourse[]>;

  ngOnInit(): void {}

}
