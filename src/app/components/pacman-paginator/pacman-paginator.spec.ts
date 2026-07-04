import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacmanPaginator } from './pacman-paginator';

describe('PacmanPaginator', () => {
  let component: PacmanPaginator;
  let fixture: ComponentFixture<PacmanPaginator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacmanPaginator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacmanPaginator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
