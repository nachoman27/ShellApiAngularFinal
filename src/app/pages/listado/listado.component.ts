import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Producto } from 'src/app/models/producto.models';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  productos: Producto[] = [];
  newProducto: Producto = { id: 0, nombre: '', image: '', price: 0 };
  name = new FormControl('');

  private nextId = 100; // Control interno para asignar IDs únicos localmente

  constructor(
    private productosService: ProductosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAll('');
    this.name.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(data => {
      this.getAll(data);
    });
  }

  // Obtener todos los productos
  getAll(texto: string | null): void {
    this.productosService.getAll(texto).subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        // Ajustar el ID inicial basado en el producto con mayor ID (si hay datos)
        if (this.productos.length > 0) {
          const maxId = Math.max(...this.productos.map(p => p.id));
          this.nextId = maxId + 1;
        }
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      }
    });
  }

  onSubmit(form: NgForm): void { // Agregar un nuevo producto
    const nuevoProducto: Producto = {
      ...this.newProducto,
      id: this.nextId++ // Asignar un ID único local
    };

    this.productos.push(nuevoProducto); // Agregar directamente a la lista local
    form.resetForm(); // Reiniciar el formulario
    this.newProducto = { id: 0, nombre: '', image: '', price: 0 }; // Resetear el objeto
    this.cdr.detectChanges(); // Actualizar la vista
  }

  deleteProducto(id: number): void {
    this.productos = this.productos.filter(producto => producto.id !== id); // Filtrar la lista local
    this.cdr.detectChanges(); // Actualizar la vista
  }

  updateProducto(producto: Producto): void {
    const productoActualizado = { ...producto }; // Hacer una copia del producto original

    const nuevoNombre = prompt('Editar nombre del producto:', productoActualizado.nombre);
    const nuevaImagen = prompt('Editar URL de la imagen:', productoActualizado.image);
    const nuevoPrecio = prompt('Editar precio del producto:', productoActualizado.price.toString());

    if (nuevoNombre !== null && nuevaImagen !== null && nuevoPrecio !== null) {
      productoActualizado.nombre = nuevoNombre;
      productoActualizado.image = nuevaImagen;
      productoActualizado.price = parseFloat(nuevoPrecio);

      // Actualizar directamente en la lista local
      const index = this.productos.findIndex(p => p.id === productoActualizado.id);
      if (index !== -1) {
        this.productos[index] = productoActualizado;
        this.cdr.detectChanges(); // Actualizar la vista
      }
    }
  }
}
