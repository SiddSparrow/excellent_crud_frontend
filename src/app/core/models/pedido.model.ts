import { Cliente } from './cliente.model';
import { Produto } from './produto.model';

export interface PedidoItem {
  id: string;
  produtoId: string;
  produto: Produto;
  quantidade: number;
  precoUnit: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  clienteId: string;
  cliente: Cliente;
  itens: PedidoItem[];
  total: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePedidoItemRequest {
  produtoId: string;
  quantidade: number;
}

export interface CreatePedidoRequest {
  clienteId: string;
  itens: CreatePedidoItemRequest[];
}
