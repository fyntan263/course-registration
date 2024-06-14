import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreCoursesComponent } from './core-courses.component';

describe('CoreCoursesComponent', () => {
  let component: CoreCoursesComponent;
  let fixture: ComponentFixture<CoreCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreCoursesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoreCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
