import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { ProdutoService } from '../services/produto.service';
import { Produto } from '../../../core/models/produto.model';
import { PaginationMeta } from '../../../core/models/pagination.model';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-produto-list',
  imports: [RouterLink, NgbPagination, LoadingSpinnerComponent, CurrencyPipe],
  templateUrl: './produto-list.html',
  styleUrl: './produto-list.css',
})
export class ProdutoListComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private modalService = inject(NgbModal);
  authService = inject(AuthService);

  produtos: Produto[] = [];
  meta: PaginationMeta = { total: 0, page: 1, limit: 10, totalPages: 0 };
  loading = false;

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(page = 1): void {
    this.loading = true;
    this.produtoService.getAll(page, this.meta.limit).subscribe({
      next: (res) => {
        this.produtos = res.data;
        this.meta = res.meta;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onPageChange(page: number): void {
    this.loadProdutos(page);
  }

  getImageUrl(path: string): string {
    return this.produtoService.getImageUrl(path);
  }

  onDelete(produto: Produto): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Excluir Produto';
    modalRef.componentInstance.message = `Deseja excluir o produto "${produto.descricao}"?`;

    modalRef.closed.subscribe(() => {
      this.produtoService.delete(produto.id).subscribe(() => {
        this.loadProdutos(this.meta.page);
      });
    });
  }
}
