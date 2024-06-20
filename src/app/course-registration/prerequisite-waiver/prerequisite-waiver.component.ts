import { Component } from '@angular/core';
import { Course, StudentInfo } from '../../models/models';
import { Observable, OperatorFunction, Subject, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { DataService } from '../../services/data.service';
import { CourseEligibilityService } from '../course-eligibility.service';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CourseDetailComponent } from '../course-detail/course-detail.component';
import { PrerequisiteTooltipPipe } from '../pipes/prerequisite-tooltip.pipe';
import { JsonUtils } from '../../utils/json-utils';

@Component({
  selector: 'app-prerequisite-waiver',
  standalone: true,
  imports: [CourseDetailComponent, NgbAccordionModule, FormsModule, CommonModule, NgbTooltipModule, NgbCollapseModule, HttpClientModule, PrerequisiteTooltipPipe],
  providers: [DataService],
  templateUrl: './prerequisite-waiver.component.html'
})
export class PrerequisiteWaiverComponent {
  private coreCourses:Course[] = [];
  reasonInput: string='';
  private searchQuery = new Subject<string>();
  filteredCourses$!: Observable<Course[]>;
  currentStudent:StudentInfo = {} as StudentInfo

  preReqWaiverRequest: boolean = false;
  collapsedStates: { [key: string]: boolean } = {};
  collapsedStatesApply: { [key: string]: boolean } = {};
  constructor(private dataService: DataService, private courseEligibilityService: CourseEligibilityService){}

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
  
  toggleCollapse(courseCode: string): void {
    this.collapsedStates[courseCode] = !this.collapsedStates[courseCode];
  }


  public toggleCollapseApply(courseCode: string) {
    this.collapsedStatesApply[courseCode] = !this.collapsedStatesApply[courseCode];
  }
  closeInput(courseCode: string) {

    this.currentStudent.rollNo;
    this.currentStudent.preRequisiteWaivers.push(courseCode);

    let request = {
      rollNo: this.currentStudent.rollNo,
      courseCode: courseCode,
      reason: this.reasonInput,
      preReqWaiverRequest: true
    }
    JsonUtils.downloadJson(request);

    this.collapsedStatesApply[courseCode] = false;

    
    // Handle the logic to close or remove the input field
  }


   isCourseAlreadyCompleted(course: Course): boolean {
    if (this.currentStudent) {
      return  this.courseEligibilityService.isComplete(this.currentStudent.completedCourses, course.code);
    }
    return false;
  }

  isPrerequisiteMet(course: Course): boolean {
    if (this.currentStudent && this.currentStudent.completedCourses.length) {
      return  this.courseEligibilityService.isPrerequisiteMet(this.currentStudent.completedCourses, course.preRequisites);
    }
    return false;
  }

  isPrerequisiteWaiverApplied(course:Course){
    
      if (this.currentStudent ) {
        return  this.courseEligibilityService.isWaiverApplied(this.currentStudent.preRequisiteWaivers, course.code);
      }
      return false;
    }


    // Pagination 
    
}
