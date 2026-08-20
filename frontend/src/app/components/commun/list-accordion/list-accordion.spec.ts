import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAccordion } from './list-accordion';

describe('ListAccordion', () => {
  let component: ListAccordion;
  let fixture: ComponentFixture<ListAccordion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAccordion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAccordion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
