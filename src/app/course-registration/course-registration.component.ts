import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ReviewCoursesComponent } from './review-courses/review-courses.component';
import { PrerequisiteWaiverComponent } from './prerequisite-waiver/prerequisite-waiver.component';

@Component({
  selector: 'app-course-registration',
  standalone: true,
  imports: [NgbNavModule, PrerequisiteWaiverComponent, CommonModule, ReviewCoursesComponent],
  templateUrl: './course-registration.component.html'
})
export class CourseRegistrationComponent {
  active =1

}
