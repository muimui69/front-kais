import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdManagerComponent } from './ad-manager.component';

describe('AdManagerComponent', () => {
  let component: AdManagerComponent;
  let fixture: ComponentFixture<AdManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
