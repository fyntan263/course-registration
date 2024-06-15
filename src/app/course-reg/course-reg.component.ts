import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCoursesComponent } from '../core-courses/core-courses.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-reg',
  standalone: true,
  imports: [NgbNavModule, CoreCoursesComponent, CommonModule],
  templateUrl: './course-reg.component.html',
  styleUrl: './course-reg.component.css'
})
export class CourseRegComponent {
  active = 1;
}
