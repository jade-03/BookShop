import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBooks } from './list-books';

describe('ListBooks', () => {
  let component: ListBooks;
  let fixture: ComponentFixture<ListBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBooks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBooks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
