import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnSalvaVoltaComponent } from './btn-salva-volta.component';

describe('BtnSalvaVoltaComponent', () => {
  let component: BtnSalvaVoltaComponent;
  let fixture: ComponentFixture<BtnSalvaVoltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnSalvaVoltaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnSalvaVoltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
