import { Component, Input } from '@angular/core';
import * as types from '../models/models';
import { NgClass } from '@angular/common';
import { DataService } from '../services/data.service'
import { CourseEligibilityService } from '../services/course-eligibility.service';
import { NgbAccordionModule, NgbTooltipModule, NgbTypeahead, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, NgModel } from '@angular/forms';
import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
import { ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-waiver-all',
  standalone: true,
  imports: [NgClass, NgbTooltipModule, NgbTypeaheadModule, FormsModule, NgbAccordionModule],
  templateUrl: './waiver-all.component.html',
  styleUrl: './waiver-all.component.css',
  providers: [DataService, CourseEligibilityService],   //Add service in your component providers list
})
export class WaiverAllComponent {
  programs: string[] = ['CS', 'EE', 'ME', 'CE', 'DS', 'MA', 'PH', 'CH', 'BSE', 'HSE', 'ESSENCE'];
  

  @Input() selectedCourses !: types.Course[];
  @Input() student !: types.StudentInfo | undefined;

  selectedCodes: string[] = [];
  searchCourse: string = "";

  availableCourses: types.Course[] = [];
  isSelectingCourses: boolean = true;
  isReviewingCourses: boolean = false;
  totalCredits: number = 0;
  creditRange: types.Range = {
    max: 24,
    min: 9
  };
  isCourseCompleted: boolean = false;
  isPrerequisiteMet: boolean = false;

  reasonForWaiver: string = '';
  applyCourseWaiver: types.ApplyWaiverRequest = {} as types.ApplyWaiverRequest;

  constructor(
    private courseEligibilityService: CourseEligibilityService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadStudentInfo();
  }

  stringIfy(): void{
    for(let course of this.selectedCourses){
      this.selectedCodes.push(course.name);
    }
  }

  @ViewChild('instance', { static: true })
  instance!: NgbTypeahead;

	focus$ = new Subject<string>();
	click$ = new Subject<string>();

	search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
		const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
		const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
		const inputFocus$ = this.focus$;
    
    this.stringIfy();


		return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
			map((term) =>
				(term === '' ? this.selectedCodes : this.selectedCodes.filter((v) => {
          if(v.includes(this.searchCourse)){
            return true;
          }
          return false;
        })).slice(0, 10),
			),
		);
	};


  loadCourses(): void {
    this.dataService.getCourses().subscribe({
      next: data => {
        this.availableCourses = data;
        console.log('COURSES: ', data);
      },
      error: err => console.log('ERROR: ', err),
      complete: () => console.log('DONE')
    });
  }

  loadStudentInfo(): void {
    this.dataService.getStudent().subscribe({
      next:data =>{this.student = data as types.StudentInfo; console.log("STUDENTS INFO: ", data)},
      error: err => console.log("ERROR: ", err),
      complete:() => {console.log("DONE")}
    }
    )
  }

  isCourseSelected(course: types.Course): boolean {
    return this.selectedCourses.some(selectedCourse => selectedCourse === course);
  }

  isCourseAlreadyCompleted(course: types.Course): boolean {
    if (this.student) {
      return  this.courseEligibilityService.isComplete(this.student.completedCourses, course.code);
    }
    return false;
  }

  checkPrerequisiteMet(course: types.Course): boolean {
    if (this.student && this.student.completedCourses.length) {
      return  this.courseEligibilityService.isPrerequisiteMet(this.student.completedCourses, course.preRequisites);
    }
    return false;
  }

  applyForWaiver(course: types.Course): void{
    this.applyCourseWaiver.studentDetails = this.student?.rollNo;
    this.applyCourseWaiver.preReqWaiverRequest = true;
    this.applyCourseWaiver.reason = this.reasonForWaiver;
    this.applyCourseWaiver.courseDetails = course.code;

    this.downloadRequestObject();
  }

  convertToJsonFile(): Blob{
    // this.outFunction();
    const sessionObject : types.ApplyWaiverRequest = this.applyCourseWaiver;
    const jsonString = JSON.stringify(sessionObject);
    const blob = new Blob([jsonString], { type: 'application/json' });
    return blob;
  }

  downloadRequestObject(){
    const blob = this.convertToJsonFile();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'network_calls.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

}
