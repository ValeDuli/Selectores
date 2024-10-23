import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesServiceService } from '../../services/paises-service.service';
import { PaisSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html',
  styles: [
  ]
})
export class SelectorPagesComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  })

  regiones: string[]=[];
  paises: PaisSmall[]=[];
  //fronteras: string[]=[];
  fronteras: PaisSmall[]=[];

  cargando:boolean=false;

  constructor( private fb:FormBuilder,
               private paisesService:PaisesServiceService) { }

  ngOnInit(): void {
    this.regiones=this.paisesService.regiones;
    
     
    //Cuando Cambia la region
    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap((_)=>{
        this.miFormulario.get('pais')?.reset('');
        this.cargando=true;
      }),
      switchMap( region => this.paisesService.getPaisesPorRegion(region) )
    )
    .subscribe(paises=>{
      this.paises=paises;
      this.cargando=false;
    });

    //Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap(()=>{
        this.fronteras=[];
        this.miFormulario.get('frontera')?.reset('');
        this.cargando=true;
      }),
      switchMap(codigo=>this.paisesService.getPaisPorCodigo(codigo)),
      switchMap(pais=>this.paisesService.getPaisesPorCodigos(pais[0]?.borders!))
    )
        .subscribe(paises=>{
          console.log(paises)
          this.fronteras=paises;
          this.cargando=false;
         //this.fronteras=pais?.borders || [];
    });
  }

  guardar(){
    console.log(this.miFormulario.value)
  }

}
