import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    canActivate: [noAuthGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'produtos', pathMatch: 'full' },
      {
        path: 'clientes',
        loadChildren: () =>
          import('./features/clientes/clientes.routes').then(
            (m) => m.CLIENTES_ROUTES
          ),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'produtos',
        loadChildren: () =>
          import('./features/produtos/produtos.routes').then(
            (m) => m.PRODUTOS_ROUTES
          ),
      },
      {
        path: 'pedidos',
        loadChildren: () =>
          import('./features/pedidos/pedidos.routes').then(
            (m) => m.PEDIDOS_ROUTES
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'produtos' },
];
