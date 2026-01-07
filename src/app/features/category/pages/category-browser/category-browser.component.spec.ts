import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryBrowserComponent } from './category-browser.component';

describe('CategoryBrowserComponent', () => {
  let component: CategoryBrowserComponent;
  let fixture: ComponentFixture<CategoryBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryBrowserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
