import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMessage } from './card-message';

describe('CardMessage', () => {
  let component: CardMessage;
  let fixture: ComponentFixture<CardMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMessage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardMessage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
