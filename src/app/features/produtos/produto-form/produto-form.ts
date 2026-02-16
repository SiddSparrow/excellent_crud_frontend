import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProdutoService } from '../services/produto.service';
import { ProdutoImagem } from '../../../core/models/produto.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-produto-form',
  imports: [ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.css',
})
export class ProdutoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private produtoService = inject(ProdutoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    descricao: ['', [Validators.required, Validators.maxLength(500)]],
    valorVenda: [0, [Validators.required, Validators.min(0)]],
    estoque: [0, [Validators.required, Validators.min(0)]],
  });

  isEdit = false;
  produtoId = '';
  loading = false;
  saving = false;
  uploading = false;
  error = '';

  existingImages: ProdutoImagem[] = [];
  selectedFiles: File[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.produtoId = id;
      this.loading = true;
      this.produtoService.getById(id).subscribe({
        next: (produto) => {
          this.form.patchValue({
            descricao: produto.descricao,
            valorVenda: produto.valorVenda,
            estoque: produto.estoque,
          });
          this.existingImages = produto.imagens || [];
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = 'Erro ao carregar produto.';
        },
      });
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  getImageUrl(path: string): string {
    return this.produtoService.getImageUrl(path);
  }

  removeExistingImage(imagem: ProdutoImagem): void {
    this.produtoService
      .deleteImage(this.produtoId, imagem.id)
      .subscribe(() => {
        this.existingImages = this.existingImages.filter(
          (i) => i.id !== imagem.id
        );
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

    if (this.isEdit) {
      this.produtoService.update(this.produtoId, data).subscribe({
        next: () => {
          if (this.selectedFiles.length > 0) {
            this.uploadAndNavigate(this.produtoId);
          } else {
            this.router.navigate(['/produtos']);
          }
        },
        error: (err) => {
          this.saving = false;
          this.error = err.error?.message || 'Erro ao atualizar produto.';
        },
      });
    } else {
      this.produtoService.create(data).subscribe({
        next: (produto) => {
          if (this.selectedFiles.length > 0) {
            this.uploadAndNavigate(produto.id);
          } else {
            this.router.navigate(['/produtos']);
          }
        },
        error: (err) => {
          this.saving = false;
          this.error = err.error?.message || 'Erro ao criar produto.';
        },
      });
    }
  }

  private uploadAndNavigate(produtoId: string): void {
    this.uploading = true;
    this.produtoService
      .uploadImages(produtoId, this.selectedFiles)
      .subscribe({
        next: () => {
          this.router.navigate(['/produtos']);
        },
        error: (err) => {
          this.uploading = false;
          this.saving = false;
          this.error = err.error?.message || 'Erro ao enviar imagens.';
        },
      });
  }
}
