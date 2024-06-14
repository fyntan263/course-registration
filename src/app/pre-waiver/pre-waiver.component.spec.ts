import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreWaiverComponent } from './pre-waiver.component';

describe('PreWaiverComponent', () => {
  let component: PreWaiverComponent;
  let fixture: ComponentFixture<PreWaiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreWaiverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreWaiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
