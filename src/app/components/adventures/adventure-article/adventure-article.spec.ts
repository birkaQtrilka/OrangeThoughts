import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdventureArticle } from './adventure-article';

describe('AdventureArticle', () => {
  let component: AdventureArticle;
  let fixture: ComponentFixture<AdventureArticle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdventureArticle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdventureArticle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
