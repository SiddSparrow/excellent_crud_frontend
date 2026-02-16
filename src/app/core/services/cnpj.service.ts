import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CnpjLookupResponse } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class CnpjService {
  private http = inject(HttpClient);

  lookup(cnpj: string): Observable<CnpjLookupResponse> {
    const cleaned = cnpj.replace(/\D/g, '');
    return this.http.get<CnpjLookupResponse>(
      `${environment.apiUrl}/cnpj/${cleaned}`
    );
  }
}
