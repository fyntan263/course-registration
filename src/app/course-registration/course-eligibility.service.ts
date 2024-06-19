import { Injectable } from '@angular/core';
import { Prerequisite, PrerequisiteWaiver, PrerequisiteWaiverStatus } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CourseEligibilityService {

  // Check if a course is complete
  isComplete(completedCourses: string[], courseCode: string): boolean {
    return completedCourses.includes(courseCode);
  }

  // Check if a prerequisite waiver is applied
  isWaiverApplied(waivers: PrerequisiteWaiver[], courseCode: string): boolean {
    return this.getPrerequisiteWaiverStatus(waivers, courseCode)? true : false
  }
  // isWaiverApplied(waivers: string[], courseCode: string): boolean {
  //   return  waivers.includes(courseCode)
  // }
  getPrerequisiteWaiverStatus(waivers: PrerequisiteWaiver[], courseCode: string):PrerequisiteWaiverStatus | undefined{
    let waiver =(waivers.find(waiver => waiver.code ==courseCode))
    if (waiver)  return waiver.status ;
    else return PrerequisiteWaiverStatus.NOT_APPLIED
  }

  
// Check if prerequisites are met
isPrerequisiteMet(input: string[], clause: Prerequisite): boolean {
  // Process NOT clauses
  for (let not of clause.notClause) {
    if (input.includes(not)) return false;
  }

  // Process OR clauses
  let orClause = false;
  for (let and of clause.orClause) {
    let andClause = true;
    for (let course of and.code) {
      if (!input.includes(course)) {
        andClause = false;
        break;
      }
    }
    if (andClause) {
      orClause = true;
      break;
    }
  }
  return orClause;
}

  // Check if corequisites are met
  isCorequisiteMet(isPrerequisiteMet: boolean, input: string[], clause: Prerequisite): boolean {
    return isPrerequisiteMet || this.isPrerequisiteMet(input, clause);
  }

}