export interface ProdutoImagem {
  id: string;
  filename: string;
  path: string;
  mimetype: string;
  createdAt?: string;
}

export interface Produto {
  id: string;
  descricao: string;
  valorVenda: number;
  estoque: number;
  imagens: ProdutoImagem[];
  createdAt?: string;
  updatedAt?: string;
}

export type CreateProdutoRequest = Pick<Produto, 'descricao' | 'valorVenda' | 'estoque'>;
export type UpdateProdutoRequest = Partial<CreateProdutoRequest>;
