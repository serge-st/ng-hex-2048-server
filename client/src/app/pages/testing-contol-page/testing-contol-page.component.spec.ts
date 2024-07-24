import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingContolPageComponent } from './testing-contol-page.component';

describe('TestingContolPageComponent', () => {
  let component: TestingContolPageComponent;
  let fixture: ComponentFixture<TestingContolPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingContolPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestingContolPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
