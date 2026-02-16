export interface Cliente {
  id: string;
  razaoSocial: string;
  cnpj: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CnpjLookupResponse {
  cnpj: string;
  razaoSocial: string;
  email: string;
}

export type CreateClienteRequest = Pick<Cliente, 'razaoSocial' | 'cnpj' | 'email'>;
export type UpdateClienteRequest = Partial<CreateClienteRequest>;
