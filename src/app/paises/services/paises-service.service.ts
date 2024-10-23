import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Pais, PaisSmall } from '../interfaces/paises.interface';
import { combineLatest, Observable, of } from 'rxjs';
import { AssertNotNull } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class PaisesServiceService {

  private base: string = 'https://restcountries.com/v3.1';
  private _regiones: string[]=['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];


  get regiones(): string[]{
    return [...this._regiones];
  }
  
  constructor( private http: HttpClient) { }

  getPaisesPorRegion( region: string ): Observable<PaisSmall[]>{
    const url: string = `${this.base}/region/${region}?fields=cca3,name`;
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisPorCodigo(codigo:string): Observable<Pais[] | []>{
    
    if(!codigo){
      return of([]);
    }

    const url:string = `${this.base}/alpha/${codigo}`;
    return this.http.get<Pais[]>(url);

  }

  getPaisPorCodigoSmall(codigo:string): Observable<PaisSmall>{
  
    const url:string = `${this.base}/alpha/${codigo}?fields=cca3,name`;
    return this.http.get<PaisSmall>(url);

  }

  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[]>{
    if(!borders){
      return of ([]);
    }

    const peticiones: Observable<PaisSmall>[]=[];

    borders.forEach(codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest( peticiones );
  }
}
