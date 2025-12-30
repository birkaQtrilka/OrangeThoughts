import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeparationLine } from './separation-line';

describe('SeparationLine', () => {
  let component: SeparationLine;
  let fixture: ComponentFixture<SeparationLine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeparationLine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeparationLine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
