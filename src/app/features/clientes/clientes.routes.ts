import { Routes } from '@angular/router';
import { ClienteListComponent } from './cliente-list/cliente-list';
import { ClienteFormComponent } from './cliente-form/cliente-form';

export const CLIENTES_ROUTES: Routes = [
  { path: '', component: ClienteListComponent },
  { path: 'novo', component: ClienteFormComponent },
  { path: ':id/editar', component: ClienteFormComponent },
];
