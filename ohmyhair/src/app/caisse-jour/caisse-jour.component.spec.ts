import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaisseJourComponent } from './caisse-jour.component';

describe('CaisseJourComponent', () => {
  let component: CaisseJourComponent;
  let fixture: ComponentFixture<CaisseJourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaisseJourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaisseJourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
