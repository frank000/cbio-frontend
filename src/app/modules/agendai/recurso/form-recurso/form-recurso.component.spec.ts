import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRecursoComponent } from './form-recurso.component';

describe('FormRecursoComponent', () => {
  let component: FormRecursoComponent;
  let fixture: ComponentFixture<FormRecursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRecursoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRecursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
