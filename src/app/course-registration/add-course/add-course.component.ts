import { Component, OnInit } from '@angular/core';
import { CoreCoursePlanSubmission, Course, Range, StudentInfo } from '../../models/models';
import { CourseEligibilityService } from '../course-eligibility.service';
import { DataService } from '../../services/data.service';
import { JsonUtils } from '../../utils/json-utils';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrerequisiteTooltipPipe } from '../pipes/prerequisite-tooltip.pipe';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AddCourseService } from './add-course.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [NgbModule,PrerequisiteTooltipPipe,CommonModule,FormsModule],
  templateUrl: './add-course.component.html'
})
export class AddCourseComponent implements OnInit {
  student : StudentInfo | undefined;
  courses : Course[] = []; 
  course$ : Observable<Course[]> = this.dataService.getCourses();
  refreshcourses : any;
  creditRange : Range = {
    "max" : 24,
    "min" : 9
  };
  datatoserver !: CoreCoursePlanSubmission ;
  page = 1
  pagesize = 9;

  constructor(private prereqService:CourseEligibilityService,
              private dataService: DataService,
              public addCourseService: AddCourseService
             ){
  }
  
  ngOnInit(): void {
    this.getCourses();
    this.getStudent();
    this.Refreshcourse();    
  }

  getCourses(){  // subscribe for data from the service
    this.dataService.getCourses().subscribe({
    next: data => {this.courses = data; console.log("COURSES: ",data)},
    error: err => console.log("ERROR: ", err),
    complete:() => {console.log("DONE")}
    })
  }

  getStudent(){ // subscribe for data from the service
    this.dataService.getStudent().subscribe({
      next:data =>{this.student = data? data as StudentInfo: undefined; console.log("STUDENTS INFO: ", data)},
      error: err => console.log("ERROR: ", err),
      complete:() => {console.log("DONE")}
    }
    )
  }

  Refreshcourse(){
    this.course$.subscribe(() =>{
    this.refreshcourses = this.courses.map((course, i) => ({ id: i + 1, ...course })).slice((this.page-1)*this.pagesize,(this.page-1)*this.pagesize+this.pagesize);
    })
  }
  
  ispastcoursesel(course:Course):boolean{
    if(this.student) return this.student.completedCourses.includes(course.code);
    return false;
  }


  isprereqmet(course:Course):boolean{
    if(this.student){
      for(let waiver of this.student.preRequisiteWaivers){
        if(waiver.code === course.code) return true;
      }
    }
    if(this.student){
      return this.prereqService.isPrerequisiteMet(this.student.completedCourses,course.preRequisites)
    }
    return false;
  }

  senddatatoserver(){
    if(this.student){
      this.datatoserver  = 
      {
        "rollNo" : this.student.rollNo,
        "riskStatus" : false,
        "totalCredits" : this.addCourseService.totalcredits,
        "coreCoursePlan" : this.addCourseService.yourcourses
      }
      
    JsonUtils.downloadJson(this.datatoserver)
    } 
  }
}
