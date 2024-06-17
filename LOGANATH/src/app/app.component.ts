import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './services/data.service';
import { HttpClientModule } from '@angular/common/http';
import { Course, StudentInfo } from './models/models';
import { PrerequisiteService } from './services/prerequisite.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],// import HttpClientModule
  providers: [DataService,PrerequisiteService],   //Add service in your component providers list
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title="COURSE REGISTRATION"
  courses:Course[] = []
  student: StudentInfo | undefined
  constructor(private dataService: DataService){}

  ngOnInit(): void {
        this.getCourses() // Call the service to use it 
        this.getStudent() // 
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
}
