import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PrerequisiteWaiverComponent } from './prerequisite-waiver/prerequisite-waiver.component';
import { WaiverAllComponent } from '../waiver-all/waiver-all.component';


@Component({
  selector: 'app-course-registration',
  standalone: true,
  imports: [NgbNavModule, PrerequisiteWaiverComponent, CommonModule,  WaiverAllComponent],
  templateUrl: './course-registration.component.html'
})
export class CourseRegistrationComponent {
  active =1

}

