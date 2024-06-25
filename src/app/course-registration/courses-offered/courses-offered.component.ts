import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { CoursesTableComponent } from '../courses-table/courses-table.component';
import { StudentCourse } from '../../models/student-course.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-courses-offered',
  standalone: true,
  imports: [CoursesTableComponent],
  templateUrl: './courses-offered.component.html'
})
export class CoursesOfferedComponent {
  @Input({ required: true }) courses$!: Observable<StudentCourse[]>;

  ngOnInit(): void {}
}
