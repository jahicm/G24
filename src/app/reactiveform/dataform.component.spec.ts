import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiabetesFormComponent } from './diabetesform.component';

describe('ReactiveformComponent', () => {
  let component: DiabetesFormComponent;
  let fixture: ComponentFixture<DiabetesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiabetesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiabetesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
