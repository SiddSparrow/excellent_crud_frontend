import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { CnpjService } from '../../../core/services/cnpj.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-cliente-form',
  imports: [ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
})
export class ClienteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private cnpjService = inject(CnpjService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    cnpj: ['', [Validators.required]],
    razaoSocial: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  isEdit = false;
  clienteId = '';
  loading = false;
  saving = false;
  lookingUp = false;
  error = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.clienteId = id;
      this.loading = true;
      this.clienteService.getById(id).subscribe({
        next: (cliente) => {
          this.form.patchValue(cliente);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = 'Erro ao carregar cliente.';
        },
      });
    }
  }

  lookupCnpj(): void {
    const cnpj = this.form.controls.cnpj.value;
    if (!cnpj || cnpj.replace(/\D/g, '').length < 14) return;

    this.lookingUp = true;
    this.cnpjService.lookup(cnpj).subscribe({
      next: (data) => {
        this.form.patchValue({
          razaoSocial: data.razaoSocial,
          email: data.email || this.form.controls.email.value,
        });
        this.lookingUp = false;
      },
      error: (err) => {
        this.lookingUp = false;
        this.error = err.error?.message || 'CNPJ não encontrado.';
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';
    const data = this.form.getRawValue();

    const request$ = this.isEdit
      ? this.clienteService.update(this.clienteId, data)
      : this.clienteService.create(data);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        this.saving = false;
        this.error = err.error?.message || 'Erro ao salvar cliente.';
      },
    });
  }
}
