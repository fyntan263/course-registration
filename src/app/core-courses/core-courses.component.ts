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
  private modalService = inject(NgbModal);
 searchQuery: string = '';
currentStudent:StudentInfo = {} as StudentInfo
  collapsedStates: { [key: string]: boolean } = {};
  collapsedStatesApply: { [key: string]: boolean } = {};
  active!:NgbAccordionModule
 
  coreCourses:Course[] = []
  reasonInput: string = '';

	open(name: string) {
		this.modalService.open(ConfirmModal);
	}

  isCnfModalVisible: boolean = false; // Controls the visibility of the modal
  
  confirmationCallback: (() => void) | undefined;
  
  constructor(private dataService: DataService){}

  ngOnInit(): void {
        this.getCourses(); 
    this.getStudent()
  }
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

  // Method to handle the Apply button click
toggleOrConfirmApply(courseCode: string) {

  console.log('reasonInput:', this.reasonInput);
  if (!(this.reasonInput.trim().length===0)) {
    console.log('reason field is not empty');
    this.isCnfModalVisible = true;
    this.open('confirmModal');

  } else {
    this.toggleCollapseApply(courseCode);
  }
}

// Method to apply for the course after confirmation
applyCourse(courseCode: string, reason: string) {
  console.log(`Applying for ${courseCode} with reason: ${reason}`);
  // Change the button text to "Applied"
  // This might involve setting a property and binding it in the template
}

confirmApplication() {
  if (this.confirmationCallback) {
    this.confirmationCallback();
  }
  this.isCnfModalVisible = false; // Hide the modal
}

// Method to toggle the collapse state
toggleCollapseApply(courseCode: string) {
  this.collapsedStatesApply[courseCode] = !this.collapsedStatesApply[courseCode];
}
}
