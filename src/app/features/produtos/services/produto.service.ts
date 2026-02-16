import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Produto,
  ProdutoImagem,
  CreateProdutoRequest,
  UpdateProdutoRequest,
} from '../../../core/models/produto.model';
import { PaginatedResponse } from '../../../core/models/pagination.model';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/produtos`;

  getAll(page = 1, limit = 10): Observable<PaginatedResponse<Produto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse<Produto>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateProdutoRequest): Observable<Produto> {
    return this.http.post<Produto>(this.baseUrl, data);
  }

  update(id: string, data: UpdateProdutoRequest): Observable<Produto> {
    return this.http.patch<Produto>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadImages(produtoId: string, files: File[]): Observable<ProdutoImagem[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('imagens', file));
    return this.http.post<ProdutoImagem[]>(
      `${this.baseUrl}/${produtoId}/imagens`,
      formData
    );
  }

  deleteImage(produtoId: string, imagemId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${produtoId}/imagens/${imagemId}`
    );
  }

  getImageUrl(path: string): string {
    return `${environment.apiUrl.replace('/api/v1', '')}/${path}`;
  }
}
