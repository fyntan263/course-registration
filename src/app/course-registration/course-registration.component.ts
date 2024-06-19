import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PrerequisiteWaiverComponent } from './prerequisite-waiver/prerequisite-waiver.component';
import { CreditFormComponent } from './credit-form/credit-form.component';
import { WaiverAllComponent } from '../waiver-all/waiver-all.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { AddCourseService } from './add-course/add-course.service';

@Component({
  selector: 'app-course-registration',
  standalone: true,
  imports: [NgbNavModule, PrerequisiteWaiverComponent, CommonModule, AddCourseComponent, CreditFormComponent, WaiverAllComponent],
  templateUrl: './course-registration.component.html'
})
export class CourseRegistrationComponent {
  active =1
  constructor(public courseStage : AddCourseService){}

}

