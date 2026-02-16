import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { PedidoService } from '../services/pedido.service';
import { ClienteService } from '../../clientes/services/cliente.service';
import { ProdutoService } from '../../produtos/services/produto.service';
import { Cliente } from '../../../core/models/cliente.model';
import { Produto } from '../../../core/models/produto.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-pedido-form',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, LoadingSpinnerComponent],
  templateUrl: './pedido-form.html',
  styleUrl: './pedido-form.css',
})
export class PedidoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private pedidoService = inject(PedidoService);
  private clienteService = inject(ClienteService);
  private produtoService = inject(ProdutoService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    clienteId: ['', [Validators.required]],
    itens: this.fb.array([]),
  });

  clientes: Cliente[] = [];
  produtos: Produto[] = [];
  loading = false;
  saving = false;
  error = '';

  get itens(): FormArray {
    return this.form.get('itens') as FormArray;
  }

  ngOnInit(): void {
    this.loading = true;
    // Load clients and products in parallel
    this.clienteService.getAll(1, 1000).subscribe({
      next: (res) => {
        this.clientes = res.data;
        this.checkLoading();
      },
      error: () => this.checkLoading(),
    });

    this.produtoService.getAll(1, 1000).subscribe({
      next: (res) => {
        this.produtos = res.data;
        this.checkLoading();
      },
      error: () => this.checkLoading(),
    });

    this.addItem();
  }

  private loadCount = 0;
  private checkLoading(): void {
    this.loadCount++;
    if (this.loadCount >= 2) {
      this.loading = false;
    }
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      produtoId: ['', [Validators.required]],
      quantidade: [1, [Validators.required, Validators.min(1)]],
    });
    this.itens.push(itemGroup);
  }

  removeItem(index: number): void {
    this.itens.removeAt(index);
  }

  getProductPrice(produtoId: string): number {
    const produto = this.produtos.find((p) => p.id === produtoId);
    return produto?.valorVenda || 0;
  }

  getItemSubtotal(index: number): number {
    const item = this.itens.at(index);
    const produtoId = item.get('produtoId')?.value;
    const quantidade = item.get('quantidade')?.value || 0;
    return this.getProductPrice(produtoId) * quantidade;
  }

  getTotal(): number {
    let total = 0;
    for (let i = 0; i < this.itens.length; i++) {
      total += this.getItemSubtotal(i);
    }
    return total;
  }

  onSubmit(): void {
    if (this.form.invalid || this.itens.length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';

    const data = {
      clienteId: this.form.controls.clienteId.value,
      itens: this.itens.controls.map((item) => ({
        produtoId: item.get('produtoId')!.value,
        quantidade: Number(item.get('quantidade')!.value),
      })),
    };

    this.pedidoService.create(data).subscribe({
      next: () => {
        this.router.navigate(['/pedidos']);
      },
      error: (err) => {
        this.saving = false;
        this.error = err.error?.message || 'Erro ao criar pedido.';
      },
    });
  }
}
