import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Pedido, CreatePedidoRequest } from '../../../core/models/pedido.model';
import { PaginatedResponse } from '../../../core/models/pagination.model';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/pedidos`;

  getAll(page = 1, limit = 10): Observable<PaginatedResponse<Pedido>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse<Pedido>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.baseUrl}/${id}`);
  }

  create(data: CreatePedidoRequest): Observable<Pedido> {
    return this.http.post<Pedido>(this.baseUrl, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
