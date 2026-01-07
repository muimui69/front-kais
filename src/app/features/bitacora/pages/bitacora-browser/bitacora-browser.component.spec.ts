import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitacoraBrowserComponent } from './bitacora-browser.component';

describe('BitacoraBrowserComponent', () => {
  let component: BitacoraBrowserComponent;
  let fixture: ComponentFixture<BitacoraBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BitacoraBrowserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BitacoraBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
