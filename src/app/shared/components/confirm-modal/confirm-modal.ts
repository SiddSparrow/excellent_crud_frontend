import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">{{ title }}</h5>
      <button type="button" class="btn-close" (click)="modal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <p>{{ message }}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="modal.dismiss()">Cancelar</button>
      <button type="button" class="btn btn-danger" (click)="modal.close(true)">Confirmar</button>
    </div>
  `,
})
export class ConfirmModalComponent {
  modal = inject(NgbActiveModal);

  @Input() title = 'Confirmar';
  @Input() message = 'Tem certeza que deseja realizar esta ação?';
}
