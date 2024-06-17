import { Component, Input } from '@angular/core';
import { Course } from '../../models/models';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [],
  templateUrl: './course-detail.component.html'
})
export class CourseDetailComponent {
  @Input() courseDetail!:Course
}
