import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.models';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'https://my-json-server.typicode.com/nachoman27/productosapi/productos';

  constructor(private http: HttpClient) {}

  // Método GET para obtener todos los productos
  getAll(texto: string | null): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}?nombre_like=${texto}`);
  }

  // Método POST para agregar un nuevo producto
  addProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  // Método PUT para actualizar un producto existente
  updateProducto(producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${producto.id}`, producto);
  }

  // Método DELETE para eliminar un producto por ID
  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
