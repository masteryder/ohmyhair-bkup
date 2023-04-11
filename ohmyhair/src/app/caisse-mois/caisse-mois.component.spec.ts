import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaisseMoisComponent } from './caisse-mois.component';

describe('CaisseMoisComponent', () => {
  let component: CaisseMoisComponent;
  let fixture: ComponentFixture<CaisseMoisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaisseMoisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaisseMoisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
