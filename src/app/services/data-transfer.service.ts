import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CourseRegistrationStatus } from '../models/models';

type CourseMap=  { [key: string]: CourseRegistrationStatus }
@Injectable({
  providedIn: 'root'
})
export class DataTransferService {
  private _courseStatusMap = new BehaviorSubject<CourseMap>({} as CourseMap);

  data$ = this._courseStatusMap.asObservable();

  constructor() { }

  add(courseCode: string, status: CourseRegistrationStatus) {
    // Get the current value of the BehaviorSubject
    const currentCourseMap = this._courseStatusMap.getValue();
    
    // Update the course map with the new course and status
    currentCourseMap[courseCode] = status;
    
    // Notify all subscribers about the new state
    this._courseStatusMap.next(currentCourseMap);
  }

  getStatus(courseCode: string){
    return
  }
}