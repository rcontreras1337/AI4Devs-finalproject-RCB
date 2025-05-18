import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCardProductComponent } from './modal-card-product.component';

describe('ModalCardProductComponent', () => {
  let component: ModalCardProductComponent;
  let fixture: ComponentFixture<ModalCardProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCardProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCardProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
