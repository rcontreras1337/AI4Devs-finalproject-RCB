import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '@core/models/product.model';
import { Product as ProductRaw } from '@core/models/productRaw.model';
import { transformProductData } from '@core/utils/dataMapToProduct';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  private http = inject(HttpClient);
  private apiScrapperUrl: string = environment.apiScrapper;

  /**
   * Construir la URL con el query param para la API
   * @param url
   * @returns String URL
   */
  private buildApiUrl(url: string): string {
    const urlParts = url.split('/p');
    return `${urlParts[0]}/p?__pickRuntime=queryData`;
  }
  /**
   * Obtiene la data del scraper de la pagina de Nike
   * @param url
   * @returns Observable<Product>
   */
  getProductData(url: string): Observable<Product> {
    const urlArmada: string = this.buildApiUrl(url);
    const apiUrl = `${this.apiScrapperUrl}/scrape-product?url=${encodeURIComponent(urlArmada)}`;
    return this.http.get<any>(`${apiUrl}?url=${url}`)
      .pipe(
        map((response: ProductRaw) => transformProductData(response, url)),// Aplicar la función de mapeo
        //tap((response) => console.log(response))
      );
  }
}
