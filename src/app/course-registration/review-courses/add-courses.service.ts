import { Injectable } from '@angular/core';
import { Course } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class AddCoursesService {
  yourcourses:Course[] = [];
  constructor() { }

  addCourse(c : Course){
    this.yourcourses.push(c);
  }
}
