import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAuthors } from './list-authors';

describe('ListAuthors', () => {
  let component: ListAuthors;
  let fixture: ComponentFixture<ListAuthors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAuthors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAuthors);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
