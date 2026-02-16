import { Routes } from '@angular/router';
import { ProdutoListComponent } from './produto-list/produto-list';
import { ProdutoFormComponent } from './produto-form/produto-form';
import { roleGuard } from '../../core/guards/role.guard';

export const PRODUTOS_ROUTES: Routes = [
  { path: '', component: ProdutoListComponent },
  {
    path: 'novo',
    component: ProdutoFormComponent,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: ':id/editar',
    component: ProdutoFormComponent,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
  },
];
