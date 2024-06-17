import { Component, Input } from '@angular/core';
import * as types from '../models/models';
import { NgClass } from '@angular/common';
import { DataService } from '../services/data.service'
import { PrerequisiteService } from '../services/prerequisite.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-waiver-all',
  standalone: true,
  imports: [NgClass, NgbTooltipModule],
  templateUrl: './waiver-all.component.html',
  styleUrl: './waiver-all.component.css',
  providers: [DataService,PrerequisiteService],   //Add service in your component providers list
})
export class WaiverAllComponent {
  programs: string[] = ['CS', 'EE', 'ME', 'CE', 'DS', 'MA', 'PH', 'CH', 'BSE', 'HSE', 'ESSENCE'];
  

  @Input() selectedCourses !: types.Course[];
  @Input() student !: types.StudentInfo | undefined;


  getPrerequisite(){
    
  }

  isCompleted(course: types.Course): boolean{
    if(this.student?.completedCourses.includes(course.code)){
      return true;
    }
    return false;
  }
}
