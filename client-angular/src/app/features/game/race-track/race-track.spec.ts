import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceTrack } from './race-track';

describe('RaceTrack', () => {
  let component: RaceTrack;
  let fixture: ComponentFixture<RaceTrack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceTrack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaceTrack);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
