import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './services/data.service';
import { HttpClientModule } from '@angular/common/http';
import { Course, StudentInfo } from './models/models';
import { waitForAsync } from '@angular/core/testing';
import { WaiverAllComponent } from './waiver-all/waiver-all.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, WaiverAllComponent],// import HttpClientModule
  providers: [DataService],   //Add service in your component providers list
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title="COURSE REGISTRATION"
  courses:Course[] = []
  currentStudent: StudentInfo = {} as StudentInfo
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
      next:data =>{this.currentStudent = data as StudentInfo; console.log("STUDENTS INFO: ", data)},
      error: err => console.log("ERROR: ", err),
      complete:() => {console.log("DONE")}
    }
    )
  }

}
