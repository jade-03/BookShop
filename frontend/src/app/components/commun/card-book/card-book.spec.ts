import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBook } from './card-book';

describe('CardBook', () => {
  let component: CardBook;
  let fixture: ComponentFixture<CardBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardBook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardBook);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
