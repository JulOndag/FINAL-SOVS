import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Elecom } from '../../../components/pages/elecom-pages/elecom/elecom';

describe('ElecomDashboard', () => {
  let component: Elecom;
  let fixture: ComponentFixture<Elecom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Elecom],
    }).compileComponents();

    fixture = TestBed.createComponent(Elecom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
