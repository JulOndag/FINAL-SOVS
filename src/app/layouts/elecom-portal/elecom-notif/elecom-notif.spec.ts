import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElecomNotif } from './elecom-notif';

describe('ElecomNotif', () => {
  let component: ElecomNotif;
  let fixture: ComponentFixture<ElecomNotif>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElecomNotif]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElecomNotif);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
