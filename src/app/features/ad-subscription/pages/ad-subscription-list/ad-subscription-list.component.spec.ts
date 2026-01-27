import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdSubscriptionListComponent } from './ad-subscription-list.component';

describe('AdSubscriptionListComponent', () => {
  let component: AdSubscriptionListComponent;
  let fixture: ComponentFixture<AdSubscriptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdSubscriptionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdSubscriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
