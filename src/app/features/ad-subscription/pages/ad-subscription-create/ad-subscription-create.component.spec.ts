import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdSubscriptionCreateComponent } from './ad-subscription-create.component';

describe('AdSubscriptionCreateComponent', () => {
  let component: AdSubscriptionCreateComponent;
  let fixture: ComponentFixture<AdSubscriptionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdSubscriptionCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdSubscriptionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
