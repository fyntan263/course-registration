import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { NgbHighlight, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../../app.component';
import { StudentInfo } from '../../models/models';
import { DataService } from '../../services/data.service';
import { JsonUtils } from '../../utils/json-utils';


@Component({
  selector: 'app-credit-form',
  standalone: true,
  imports: [AppComponent, RouterOutlet, CommonModule, NgbNavModule, DecimalPipe, AsyncPipe, ReactiveFormsModule, NgbHighlight],
  providers: [DataService],
  templateUrl: './credit-form.component.html',
  styleUrls: ['./credit-form.component.css']
})
export class CreditFormComponent {
  active = 1;

  currentStudent: StudentInfo = {} as StudentInfo;  
  basket = ['PME', 'SME', 'OE', 'HSE', 'PROJECT']
  item: any;

  isBool = false;
  selectedTab: string = ' ';
  
  minCredits: number[] = [];
  maxCredits: number[] = [];
 valid = false;
 req = 20;
 formErrors: string[] = [];  // To store error messages


  constructor(private dataService: DataService) {
    
  }
  ngOnInit() {
    this.getStudent();
  }

  getStudent(){ // subscribe for data from the service
    this.dataService.getStudent().subscribe({
      next:data =>{
        this.currentStudent = data as StudentInfo; 
        data.electiveCredits.forEach(elective => {
          this.minCredits.push(elective.minCredits);
          this.maxCredits.push(elective.maxCredits);
        });
        console.log("STUDENTS INFO: ", data)},
      error: err => console.log("ERROR: ", err),
      complete:() => {console.log("DONE")}
    }
    )
  }

  addMinCredit(minCredit: number, index: number) {
    this.minCredits[index] = minCredit;
    
  }

  get totalMinCredits() {
    return this.minCredits.reduce((a, b) => a + b, 0);
  }
  addMaxCredit(maxCredit: number, index: number) {
    this.maxCredits[index] = maxCredit;
    // this.onclicking(this.students);
  }
  onsubmit(ev?: SubmitEvent) {
    if (this.isBool && this.valid) {
      const data = {
        rollNo: this.currentStudent.rollNo,
        electiveCredits: this.basket.map((basket, index) => ({
          basket,
          minCredits: this.minCredits[index],
          maxCredits: this.maxCredits[index]
        }))
      }
     
      JsonUtils.downloadJson(data);
      console.log('Form Submitted');
      return;
    } else {
      console.log('Form is invalid or total credits not satisfied');
    }
  }

  onclicking(): void {
    this.valid = false;
    this.formErrors = [];  // Clear previous errors

    console.log(this.minCredits);
    
    for (let i = 0; i < this.basket.length; i++) {
      if (this.minCredits[i] === null && this.maxCredits[i] === null) {
        console.log('Please enter values for all Min and Max credits.');
        this.formErrors.push(`Please enter values for all Min and Max credits.`);
      }
      else if (this.minCredits[i] > this.maxCredits[i]) {
        console.log(`Min credit cannot be greater than Max credit for ${this.basket[i]}.`);
        this.formErrors.push(`Min credit cannot be greater than Max credit for ${this.basket[i]}.`);
      }
      else if (this.minCredits[i] > 6 && this.maxCredits[i] > 6) {
        console.log(`Credits for ${this.basket[i]} cannot exceed 6.`);
        this.formErrors.push(`Credits for ${this.basket[i]} cannot exceed 6.`);
      }

      if (this.minCredits[i] < this.maxCredits[i] && this.minCredits[i]!==null && this.maxCredits[i] <= 6 && this.maxCredits[i]!==null && this.minCredits[i] <= 6) {
        this.valid = true;
      }

      if (this.formErrors.length > 0) {
        this.valid = false;
      } else {
        this.valid = true;
      }
    }
    if (this.valid) {
        const total = this.currentStudent.totalCredits + this.totalMinCredits;
        if (total >= this.req) {
          this.isBool = true;
        } else {
          this.isBool = false;
          this.formErrors.push(`Total credits must be at least ${this.req}.`);
          console.log('You need to select more credits');
        }
    } else {
      this.isBool = false;
    }
    this.onsubmit();
  }
 
}
