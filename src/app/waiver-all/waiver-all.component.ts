import { Component, Input } from '@angular/core';
import * as types from '../models/models';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-waiver-all',
  standalone: true,
  imports: [NgClass],
  templateUrl: './waiver-all.component.html',
  styleUrl: './waiver-all.component.css'
})
export class WaiverAllComponent {
  programs: string[] = ['CSE', 'EE', 'ME', 'CE', 'DSE', 'MAE', 'PHE', 'CHE', 'BSE', 'HSE', 'ESSENCE'];
  

  @Input() selectedCourses !: types.Course[];
  @Input() student !: types.StudentInfo | undefined;

  
}
