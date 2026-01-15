import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickNoteBar } from './quick-note-bar';

describe('QuickNoteBar', () => {
  let component: QuickNoteBar;
  let fixture: ComponentFixture<QuickNoteBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickNoteBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickNoteBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
