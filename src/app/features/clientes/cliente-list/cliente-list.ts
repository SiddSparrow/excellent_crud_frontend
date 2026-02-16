import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';
import { PaginationMeta } from '../../../core/models/pagination.model';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-cliente-list',
  imports: [RouterLink, NgbPagination, LoadingSpinnerComponent],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css',
})
export class ClienteListComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private modalService = inject(NgbModal);

  clientes: Cliente[] = [];
  meta: PaginationMeta = { total: 0, page: 1, limit: 10, totalPages: 0 };
  loading = false;

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(page = 1): void {
    this.loading = true;
    this.clienteService.getAll(page, this.meta.limit).subscribe({
      next: (res) => {
        this.clientes = res.data;
        this.meta = res.meta;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onPageChange(page: number): void {
    this.loadClientes(page);
  }

  onDelete(cliente: Cliente): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Excluir Cliente';
    modalRef.componentInstance.message = `Deseja excluir o cliente "${cliente.razaoSocial}"?`;

    modalRef.closed.subscribe(() => {
      this.clienteService.delete(cliente.id).subscribe(() => {
        this.loadClientes(this.meta.page);
      });
    });
  }
}
