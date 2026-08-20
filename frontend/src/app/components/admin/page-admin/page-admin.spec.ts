import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAdmin } from './page-admin';

describe('PageAdmin', () => {
  let component: PageAdmin;
  let fixture: ComponentFixture<PageAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
