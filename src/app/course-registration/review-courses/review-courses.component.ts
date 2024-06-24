import { Component, Injectable, OnInit } from '@angular/core';
import { Course, StudentInfo, Range, CoreCoursePlanSubmission } from '../../models/models';
import { DataService } from '../../services/data.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { PrerequisiteTooltipPipe } from '../pipes/prerequisite-tooltip.pipe';
import { CourseEligibilityService } from '../course-eligibility.service';
import { JsonUtils } from '../../utils/json-utils';
import { AddCoursesService } from './add-courses.service';

@Component({
  selector: 'app-review-courses',
  standalone: true,
  imports: [NgbModule, CommonModule, PrerequisiteTooltipPipe],
  providers: [CourseEligibilityService],
  templateUrl: './review-courses.component.html'
})

//TODO: pagination
//TODO: next to elective range
//TODO: input to parent in nav
//TODO: total credits to bottom and review next to elective range
//TODO: next button to elective range page
//TODO: make the heading sticky
//TODO: slot clash detection
//TODO:
export class ReviewCoursesComponent implements OnInit {
  student : StudentInfo | undefined;
  courses : Course[] = []; 
  yourcourses : Course[] = [];
  yourcoursescode : string[] = [];
  refreshcourses : any;
  isselyourcourses : boolean = true
  isselreviewcourses : boolean = false
  totalcredits = 0;
  creditRange : Range = {
    "max" : 24,
    "min" : 9
  };
  iscompl : boolean = false
  ispremet : boolean = false;
  iscomet : boolean = false;
  datatoserver !: CoreCoursePlanSubmission ;
  page = 1
  pagesize = 8;

  constructor(private prereqService:CourseEligibilityService,
              private dataService: DataService,
              public addcourse: AddCoursesService
             ){
    // console.log(this.student)
    // this.Refreshcourse();
  }
  
  ngOnInit(): void {
    this.getCourses();
    this.getStudent();
    if(this.student)
      this.yourcoursescode = this.student.completedCourses;
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
      // console.log(this.courses);
          
      this.refreshcourses = this.courses.map((course, i) => ({ id: i + 1, ...course })).slice((this.page-1)*this.pagesize,(this.page-1)*this.pagesize+this.pagesize);
    }

  credit(credit:string):number{
    return Number(credit.split('-')[3])
  }
  
  isyourcoursesel(s:Course):boolean{
    return this.yourcourses.some((term)=>term==s)
  }

  ispastcoursesel(s:Course):boolean{
    this.iscompl = false
    if(this.student){
      this.iscompl = this.student.completedCourses.some((term)=>term==s.code)
    }
    return this.iscompl
  }

  dropcourse(c:Course):void{
    this.yourcourses = this.yourcourses.filter(item => item!=c);
    this.yourcoursescode = this.yourcoursescode.filter(item => item!=c.code);
    this.totalcredits -= Number(c.credits.split('-')[3]);
    if(this.student){
      this.student.completedCourses = this.student?.completedCourses.filter(term => term!=c.code);
    }
    for( let cour of this.yourcourses){
      if(this.iscoreqmet(cour)) return;
      this.dropcourse(cour);
    }
  }

  isprereqmet(c:Course):boolean{
    if(this.student?.preRequisiteWaivers.includes(c.code)) return true;
    if(this.student){
      this.ispremet = this.prereqService.isPrerequisiteMet(this.student.completedCourses,c.preRequisites);
      return this.ispremet;
    }
    return false;
  }

  iscoreqmet(c:Course):boolean{
    this.iscomet = this.prereqService.isPrerequisiteMet(this.yourcoursescode,c.coRequisites);
    return this.iscomet;
  }

  senddatatoserver(){
    if(this.student){
      this.datatoserver  = 
      {
        "rollNo" : this.student.rollNo,
        "riskStatus" : false,
        "totalCredits" : this.totalcredits,
        "coreCoursePlan" : this.yourcourses
      }
      
    JsonUtils.downloadJson(this.datatoserver)
    } 
  }
}