import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixcommonComponent } from './fixcommon.component';

describe('FixcommonComponent', () => {
  let component: FixcommonComponent;
  let fixture: ComponentFixture<FixcommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixcommonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixcommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
