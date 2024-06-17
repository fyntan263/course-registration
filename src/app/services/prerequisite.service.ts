import { Injectable } from '@angular/core';
import * as types from '../models/models'

@Injectable({
  providedIn: 'root'
})
export class PrerequisiteService {

  // constructor() { }

  orclause:boolean = false;
  andclause:boolean = true;
  constructor() {

   }
  //INPUT PARAMETERS:
  //input: List of all completed courses by student
  //clause: The prerequisite property of the particular course
  isprereqmet(input:string[],clause:types.Prerequisite):boolean{
    for(let not of clause.notClause){
      if(input.includes(not)) return false;
    }
    this.orclause = false;
    for(let and of clause.orClause){
      this.andclause = true
      for(let course of and.code){
        if(!input.includes(course)) {
          this.andclause = false;
          break;
        }
      }
      if(this.andclause) {
        this.orclause = true;
        break;
      }
    }
    return this.orclause;
  }

  //INPUT PARAMETERS:
  //prereq: the prereq condition of the course
  //input: List of all courses selected by the student
  //clause: The corequisite property of the particular course
  iscoreqmet(prereq:boolean,input:string[],clause:types.Prerequisite){
    return prereq || this.isprereqmet(input,clause);
  }
}
