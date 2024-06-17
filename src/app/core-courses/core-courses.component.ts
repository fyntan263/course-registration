import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgbAccordionModule, NgbTooltipModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Course, StudentInfo } from '../models/models';
import { DataService } from '../services/data.service';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { CourseDetailComponent } from '../course-detail/course-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../pipes/filter.pipe';
import { CourseRegistrationUtils } from '../utils/course-registration-utils';
import { OperatorFunction, Observable, debounceTime, distinctUntilChanged, filter, merge, map, Subject, of, switchMap, startWith } from 'rxjs';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-core-courses',
  standalone: true,
  imports:[],
  providers: [DataService],
  template: `<div>
    	<p>
				All information associated to this user profile will be permanently deleted.
				<span class="text-danger">This operation can not be undone.</span>
			</p>
  </div>`,
})
export class ConfirmModal{

}

@Component({
  selector: 'app-core-courses',
  standalone: true,
  imports: [NgbAccordionModule, FormsModule, FilterPipe, CommonModule, NgbTooltipModule, NgbCollapseModule, CourseDetailComponent, HttpClientModule],
  providers: [DataService],
  templateUrl: './core-courses.component.html',
  styleUrl: './core-courses.component.css'
})
export class CoreCoursesComponent {
  private coreCourses:Course[] = [];
  reasonInput: string='';
  private searchQuery = new Subject<string>();
  filteredCourses$!: Observable<Course[]>;
  currentStudent:StudentInfo = {} as StudentInfo

  collapsedStates: { [key: string]: boolean } = {};
  collapsedStatesApply: { [key: string]: boolean } = {};
  
  constructor(private dataService: DataService){}

  ngOnInit(): void {
        this.getCourses();        
        this.getStudent()
        this.filteredCourses$ = this.searchQuery.pipe(
          startWith(''),
          debounceTime(200),
          distinctUntilChanged(),
          this.search
    );
  }

  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery.next(inputElement.value);
  }

  search: OperatorFunction<string, Course[]> = (text$: Observable<string>) =>
    text$.pipe(
      map(term =>
        term.trim() === ''
          ? this.coreCourses
          : this.coreCourses.filter(course =>
              course.code.toLowerCase().includes(term.toLowerCase()) ||
              course.name.toLowerCase().includes(term.toLowerCase())
            )
      )
    );

 getCourses(){  // subscribe for data from the service
    this.dataService.getCourses().subscribe({
    next: data => {this.coreCourses = data.filter(course => course.isCore);},
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

  isComplete(courseCode:string):boolean{    
    return  CourseRegistrationUtils.isComplete(this.currentStudent.completedCourses, courseCode)
  }
 
  toggleCollapse(courseCode: string): void {
    this.collapsedStates[courseCode] = !this.collapsedStates[courseCode];
  }


  public toggleCollapseApply(courseCode: string) {
    this.collapsedStatesApply[courseCode] = !this.collapsedStatesApply[courseCode];
  }
  closeInput(courseCode: string) {
    // Handle the logic to close or remove the input field
  }

}
