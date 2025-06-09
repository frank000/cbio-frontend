import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelationComponent } from './cancelation.component';

describe('CancelationComponent', () => {
  let component: CancelationComponent;
  let fixture: ComponentFixture<CancelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
