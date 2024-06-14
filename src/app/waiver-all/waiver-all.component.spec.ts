import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiverAllComponent } from './waiver-all.component';

describe('WaiverAllComponent', () => {
  let component: WaiverAllComponent;
  let fixture: ComponentFixture<WaiverAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaiverAllComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WaiverAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
