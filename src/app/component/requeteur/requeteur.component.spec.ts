import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequeteurComponent } from './requeteur.component';

describe('RequeteurComponent', () => {
  let component: RequeteurComponent;
  let fixture: ComponentFixture<RequeteurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequeteurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequeteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
