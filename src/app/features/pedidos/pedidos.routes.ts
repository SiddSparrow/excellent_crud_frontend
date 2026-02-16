import { Routes } from '@angular/router';
import { PedidoListComponent } from './pedido-list/pedido-list';
import { PedidoFormComponent } from './pedido-form/pedido-form';

export const PEDIDOS_ROUTES: Routes = [
  { path: '', component: PedidoListComponent },
  { path: 'novo', component: PedidoFormComponent },
];
