import { Component,OnInit} from '@angular/core';
import { PrerequisiteService } from '../services/prerequisite.service';
import { NgClass } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../services/data.service';
import { Course, Range, StudentInfo, senddata } from '../models/models';
import { PrereqPipe } from '../pipes/prereq.pipe';

@Component({
  selector: 'app-your-core',
  standalone: true,
  imports: [NgClass,NgbModule,PrereqPipe],
  templateUrl: './your-core.component.html',
  styleUrl: './your-core.component.css'
})
export class YourCoreComponent implements OnInit {
  student : StudentInfo | undefined;
  courses : Course[] = []; 
  yourcourses : Course[] = [];
  isselyourcourses : boolean = true
  isselreviewcourses : boolean = false
  totalcredits = 0;
  creditRange : Range = {
    "max" : 24,
    "min" : 9
  };
  iscompl : boolean = false
  ispremet : boolean = false;
  datatoserver !: senddata ;

  constructor(private prereqService:PrerequisiteService,
              private dataService: DataService,
             ){
    // console.log(this.student)
  }

  ngOnInit(): void {
    this.getCourses();
    this.getStudent();
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
    this.totalcredits -= Number(c.credits.split('-')[3]);
  }

  isprereqmet(c:Course):boolean{
    if(this.student){
      this.ispremet = this.prereqService.isprereqmet(this.student.completedCourses,c.preRequisites);
      return this.ispremet;
    }
    return false;
  }

  senddatatoserver(){
    if(this.student){
      this.datatoserver  = 
      {
        "RollNo" : this.student.rollNo,
        "Risk/Not at Risk" : false,
        "Total credits" : this.totalcredits,
        "Core Course Plan" : this.yourcourses 
      }
    } 
    const blob = new Blob([JSON.stringify(this.datatoserver)],{type:'application/json'})
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'output.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
