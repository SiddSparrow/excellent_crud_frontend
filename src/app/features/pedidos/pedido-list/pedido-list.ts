import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { PedidoService } from '../services/pedido.service';
import { Pedido } from '../../../core/models/pedido.model';
import { PaginationMeta } from '../../../core/models/pagination.model';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-pedido-list',
  imports: [
    RouterLink,
    NgbPagination,
    CurrencyPipe,
    DatePipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './pedido-list.html',
  styleUrl: './pedido-list.css',
})
export class PedidoListComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private modalService = inject(NgbModal);
  authService = inject(AuthService);

  pedidos: Pedido[] = [];
  meta: PaginationMeta = { total: 0, page: 1, limit: 10, totalPages: 0 };
  loading = false;

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(page = 1): void {
    this.loading = true;
    this.pedidoService.getAll(page, this.meta.limit).subscribe({
      next: (res) => {
        this.pedidos = res.data;
        this.meta = res.meta;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onPageChange(page: number): void {
    this.loadPedidos(page);
  }

  onDelete(pedido: Pedido): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Excluir Pedido';
    modalRef.componentInstance.message = `Deseja excluir o pedido #${pedido.id.substring(0, 8)}...?`;

    modalRef.closed.subscribe(() => {
      this.pedidoService.delete(pedido.id).subscribe(() => {
        this.loadPedidos(this.meta.page);
      });
    });
  }
}
