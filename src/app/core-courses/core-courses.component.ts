import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbAccordionModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Course } from '../models/models';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-core-courses',
  standalone: true,
  imports: [NgbAccordionModule, CommonModule, NgbTooltipModule],
  templateUrl: './core-courses.component.html',
  styleUrl: './core-courses.component.css'
})
export class CoreCoursesComponent {
  coreCourses:Course[] = []
  constructor(private dataService: DataService){}

  ngOnInit(): void {
        this.getCourses()
  }

  getCourses(){  // subscribe for data from the service
    this.dataService.getCourses().subscribe({
    next: data => {this.coreCourses = data.filter(course => course.isCore);},
    error: err => console.log("ERROR: ", err),
    complete:() => {console.log("DONE")}
    })
  }

}
