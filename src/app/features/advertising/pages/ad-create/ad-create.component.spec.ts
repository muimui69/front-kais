import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdCreateComponent } from './ad-create.component';

describe('AdCreateComponent', () => {
  let component: AdCreateComponent;
  let fixture: ComponentFixture<AdCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
