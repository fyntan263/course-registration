import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourCoreComponent } from './your-core.component';

describe('YourCoreComponent', () => {
  let component: YourCoreComponent;
  let fixture: ComponentFixture<YourCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourCoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YourCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
