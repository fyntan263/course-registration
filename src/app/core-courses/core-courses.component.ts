import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbAccordionModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Course, StudentInfo } from '../models/models';
import { DataService } from '../services/data.service';
import { FilterPipe } from '../pipes/filter.pipe';
import { FormsModule } from '@angular/forms';
import { CourseRegistrationUtils } from '../utils/course-registration-utils';

@Component({
  selector: 'app-core-courses',
  standalone: true,
  imports: [NgbAccordionModule, CommonModule, NgbTooltipModule, FilterPipe, FormsModule],
  templateUrl: './core-courses.component.html',
  styleUrl: './core-courses.component.css'
})
export class CoreCoursesComponent {
  searchQuery: string = '';
  currentStudent:StudentInfo = {} as StudentInfo
  coreCourses:Course[] = []
  active!:NgbAccordionModule
  constructor(private dataService: DataService){}

  ngOnInit(): void {
        this.getCourses()
        this.getStudent()
  }

  getCourses(){  // subscribe for data from the service
    this.dataService.getCourses().subscribe({
    next: data => {this.coreCourses = data.filter(course => course.isCore);},
    })
  }

  getStudent(){ // subscribe for data from the service
    this.dataService.getStudent().subscribe({
      next:data =>{this.currentStudent = data as StudentInfo; console.log("STUDENTS INFO: ", data)},
      error: err => console.log("ERROR: ", err),
      complete:() => {console.log("DONE")}
    }
    )
  }

  isComplete(courseCode:string):boolean{    
    return  CourseRegistrationUtils.isComplete(this.currentStudent.completedCourses, courseCode)
  }

 
  

}
