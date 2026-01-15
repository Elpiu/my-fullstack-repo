import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskdPage } from './taskd-page';

describe('TaskdPage', () => {
  let component: TaskdPage;
  let fixture: ComponentFixture<TaskdPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskdPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskdPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
