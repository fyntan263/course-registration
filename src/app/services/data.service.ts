import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Course, StudentInfo } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = 'assets/data.json'; // Path to the JSON file

  constructor(private http: HttpClient) { }

  // Method to get a list of courses
  getCourses(): Observable<Course[]> {
    return this.http.get<{ courses: Course[] }>(this.dataUrl).pipe(
      map(data => data.courses)
    );
  }

  // Method to get the information of a specific student
  getStudent(): Observable<StudentInfo> {
    return this.http.get<{ studentInfo: StudentInfo }>(this.dataUrl).pipe(
      map(data => data.studentInfo)
    );
  }

  getDepartments(): Observable<Map<string, string>> {
    return this.http.get<{departments: Map<string, string>}>(this.dataUrl).pipe(map(data => data.departments));
  }
}
