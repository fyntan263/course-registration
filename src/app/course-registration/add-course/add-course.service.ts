import { Injectable } from '@angular/core';
import { Course } from '../../models/models';
import { CourseEligibilityService } from '../../services/course-eligibility.service';

@Injectable({
  providedIn: 'root'
})
export class AddCourseService {
  yourcourses : Course[]= [];
  yourcoursescode : string[] = [];
  totalcredits = 0;
  coreCourse=true;
  electiveRange = false;
  constructor(private prereqService:CourseEligibilityService) { }

  addCourse(course:Course){ //add course to your courses list and update total credits
    this.yourcourses.push(course);
    this.yourcoursescode.push(course.code);
    this.totalcredits += this.credit(course.credits);
  }
  
  deleteCourse(completed : string[]|undefined,course:Course):void { //delete course from your courses list and update total credits
    this.yourcourses =this.yourcourses.filter(c => c.code != course.code)
    this.yourcoursescode =this.yourcoursescode.filter(c => c != course.code)
    this.totalcredits -= this.credit(course.credits);
    for(let cour of this.yourcourses){
      if(!this.isCoreqMet(completed,cour)){ 
        this.deleteCourse(completed,cour) 
      }
    }        
  }

  credit(credits:string):number{ //return the credit value of the course in number format
    return Number(credits.split('-')[3]);
  }
  isCoreqMet(completed : string[]|undefined,course:Course):boolean { //if the course's coRequisites are met or not
    if(completed){
      return this.prereqService.isPrerequisiteMet(completed.concat(this.yourcoursescode),course.coRequisites);
    }
    return false;
  }

  isYourCourse(course:Course):boolean{ //if the course is in your courses list
    return this.yourcoursescode.includes(course.code);
  }

  isSlotClash(course:Course):boolean{ //if the course's slot clashes with your courses slots
    if(course.slot=='') return false;
    for(let time of course.slot.split('+')){
      for(let cour of this.yourcourses){
        if(cour.slot.split('+').includes(time) && cour.code!= course.code){
          // console.log(this.yourcourses);
          return true;
        }
      }
    }
    // console.log(this.yourcourses);
    
    return false;
  }
}
