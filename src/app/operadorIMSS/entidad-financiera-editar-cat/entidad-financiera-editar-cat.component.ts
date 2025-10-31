import { Component, OnInit, Input , AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/common/base.component';
import { Model } from "src/app/model";
import { CondicionOfertaCrud, Delegacion, PlazoCrud } from "src/app/common/domain";
import { CatalogoService, DataService, ModalService } from 'src/app/common/services';
import { DatePipe } from '@angular/common';

import { IfStmt } from '@angular/compiler';
import { BeneficioCrud } from 'src/app/common/domain/beneficio.crud';
import { CatMaximoService } from 'src/app/common/services/cat.maximo.service';

@Component({
  selector: 'app-entidad-financiera-editar-cat',
  templateUrl: './entidad-financiera-editar-cat.component.html',
  styleUrls: [],
  providers: [DatePipe]
})
export class EntidadFinancieraEditarCatComponent extends BaseComponent implements OnInit, AfterViewInit {

  public model: Model;
  @Input()
  public registrarForm: any;
  public regexCat: string;
  public regexDecimal: string;
  public catalogoPlazos: PlazoCrud[];
  public mapPlazos: any;
  public CATMaximoActual : string; 

  public plazosValidos: boolean = true;
  items: Delegacion[];


  constructor(
    protected data: DataService,
    private modalService: ModalService,
    private datePipe: DatePipe,
    protected catalogoService: CatalogoService,
    private catMaximoService : CatMaximoService
  ) {
    super(data);
    this.model = this.data.model;
    this.regexCat = "[0-9]+(\.[0-9][0-9]?)?";

  }
  public trackById = (_: number, x: { id: number }) => x.id;


  ngOnInit() {
    this.catalogoService.consultarDelegaciones().subscribe((response: Delegacion[]) => {
      console.log("Delegaciones: ", response);
      this.items = response;
    });
    this.catalogoPlazos = [
      { id: 1, descripcion: "6 meses" },
      { id: 3, descripcion: "12 meses" },
      { id: 4, descripcion: "18 meses" },
      { id: 5, descripcion: "24 meses" },
      { id: 6, descripcion: "30 meses" },
      { id: 7, descripcion: "36 meses" },
      { id: 8, descripcion: "42 meses" },
      { id: 9, descripcion: "48 meses" },
      { id: 10, descripcion: "54 meses" },
      { id: 11, descripcion: "60 meses" }];

    this.mapPlazos = this.catalogoPlazos.reduce(function (map, obj) {
      map[obj.id] = obj.descripcion;
      return map;
    }, {});

    if (this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection == null) {
      this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection = new Array();
      this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection.push(new CondicionOfertaCrud());
      this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection[0].mclcPlazo = new PlazoCrud();
    
    this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection[0].mclcPlazo.id = null;
}

    this.catMaximoService.catActual().subscribe((response : any)=>{
      console.log('Response:', response.catAnterior);
      this.CATMaximoActual = response.catAnterior;
  } );

  }

  agregar(index?: number) {
    console.log("agregar index:" + index);
    let nuevaCondicion: CondicionOfertaCrud = {
      fecRegistroAlta: null,
      bajaRegistro: null,
      mclcPlazo: { id: null },
      mclcBeneficioCollection: []
    };
    nuevaCondicion.mclcBeneficioCollection.push(
      {
        id: null, desBeneficio: null
      }
    );
    nuevaCondicion.mclcBeneficioCollection.push(
      {
        id: null, desBeneficio: null
      }
    );
    nuevaCondicion.mclcBeneficioCollection.push(
      {
        id: null, desBeneficio: null
      }
    );
    nuevaCondicion.bajaRegistro = null;
    if (typeof index === 'number' && index > -1 && index < this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection.length) {
      this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection.splice(index + 1, 0, nuevaCondicion);
    } else {
      this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection.push(nuevaCondicion);
    }
  }

  eliminar(index) {
    console.log("eliminar index 1:" + index);
    //if (index != 0) {
    //if (index !== -1) {
    console.log("eliminar index 2:" + index);
    if (this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection[index].fecRegistroAlta === null) {
      this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection.splice(index, 1);
      console.log("eliminar index 3:" + index);
    } else {
      console.log("eliminar index 4:" + index);
      this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection[index].bajaRegistro = this.datePipe.transform(new Date(), 'dd/MM/yyyy ') + '00:00:00';
    }
    //}
    //}
    console.log("eliminar index 5:" + index);
    this.validarPlazos()
  }

  listenerPlazo(index: number) {
    let id = this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection[index].mclcPlazo.id;
    this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection[index].mclcPlazo.descripcion = this.mapPlazos[id];
    this.validarPlazos()
  }

  validarPlazos() {
    let plazos = this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection;
    console.log("validarPlazos:" + plazos);
    this.plazosValidos = true;
    this.model.flatPlazosModEF = true;
    let plazosSet = new Set();
    plazos.forEach(element => {

      console.log("validarPlazos element:", element);
      if (element.mclcPlazo.id != undefined) {


        if (this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection.length > 1) {
          if (element.bajaRegistro === undefined
            || element.bajaRegistro === null) {

            if (plazosSet.has(parseInt(element.mclcPlazo.id.toString()))) {
              this.plazosValidos = false;
              if (this.model.enabledModificarEntidad) {
                this.model.flatPlazosModEF = false;
              }
            } else {
              plazosSet.add(parseInt(element.mclcPlazo.id.toString()));
            }

          }
        }
      }
    });
  }


  closeModal(tituloModal) {
    this.modalService.close(tituloModal);
  }

  openModal(tituloModal) {
    this.modalService.open(tituloModal);
  }

  // ====== BEGIN: No-optional-chaining helpers for Angular 8 / TS 3.4 ======
  public selectedPlazos: Set<number> = new Set<number>();
  private _adding: boolean = false;

  private _getCollection(): any[] {
    try {
      return (this.model && this.model.registrarEntidadFinanciera && this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection)
        ? this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection
        : [];
    } catch (e) {
      console.log('[[_getCollection]] error:', e);
      return [];
    }
  }

  private _isActive(row: any): boolean {
    return row && (row.bajaRegistro === undefined || row.bajaRegistro === null);
  }

  private _getPlazoId(row: any): number | null {
    if (row && row.mclcPlazo && row.mclcPlazo.id !== undefined && row.mclcPlazo.id !== null) {
      const n = Number(row.mclcPlazo.id);
      return isNaN(n) ? null : n;
    }
    return null;
  }

  private _activeRows(): any[] {
    const col = this._getCollection();
    return col.filter(r => this._isActive(r));
  }

  public recomputeSelectedPlazos(): void {
    const set = new Set<number>();
    const active = this._activeRows();
    for (let i = 0; i < active.length; i++) {
      const id = this._getPlazoId(active[i]);
      if (id !== null) set.add(id);
    }
    this.selectedPlazos = set;
    console.log('[recomputeSelectedPlazos] seleccionados:', Array.from(this.selectedPlazos));
  }

  public getPlazosDisponibles(i: number): any[] {
    const col = this._getCollection();
    const row = (i >= 0 && i < col.length) ? col[i] : null;
    const currentId = this._getPlazoId(row);
    const cat = this.catalogoPlazos || [];
    const result = cat.filter(p => (currentId !== null && p.id === currentId) || !this.selectedPlazos.has(p.id));
    console.log('[getPlazosDisponibles] fila', i, 'currentId=', currentId, '=> opciones=', result.map(r => r.id));
    return result;
  }

  public canAddMore(): boolean {
    const catLen = (this.catalogoPlazos && this.catalogoPlazos.length) ? this.catalogoPlazos.length : 0;
    const maxByNegocio = 10;
    const logicalMax = Math.min(maxByNegocio, catLen);
    const libres = catLen - this.selectedPlazos.size;
    const active = this._activeRows().length;
    const can = active < logicalMax && libres > 0;
    console.log('[canAddMore] {logicalMax:', logicalMax, ', libres:', libres, ', active:', active, '} =>', can);
    return can;
  }

  public agregarWrap(): void {
    if (!this.canAddMore()) { return; }

    if (this._adding) {
      console.log('[agregarWrap] Ignorado por _adding=true');
      return;
    }
    if (!this.canAddMore()) {
      console.log('[agregarWrap] No hay plazos libres: operacion bloqueada');
      return;
    }
    this._adding = true;
    try {
      this.agregar();
    } catch (e) {
      console.log('[agregarWrap] Error en agregar():', e);
    }
    this.recomputeSelectedPlazos();
    const self = this;
    setTimeout(function() { self._adding = false; }, 300);
  }

  public eliminarWrap(i: number): void {

    // Guard: si solo hay 1 fila activa, NO borrar; limpiar selección del plazo
    try {
      const anyThis: any = this;
      const coll: any[] = (anyThis && anyThis.model && anyThis.model.registrarEntidadFinanciera && anyThis.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection)
        ? anyThis.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection
        : [];
      const activos = coll.filter((o:any) => o && o.bajaRegistro == null);
      if (activos.length <= 1) {
        if (coll[i] != null) {
          if (!coll[i].mclcPlazo) {
            coll[i].mclcPlazo = { id: null };
          } else {
            coll[i].mclcPlazo.id = null;
          }
          // Intentar refrescar listeners de cambio, si existen
          try {
            if ((this as any) && (this as any).listenerPlazoWrap && typeof (this as any).listenerPlazoWrap === 'function') {
              (this as any).listenerPlazoWrap(i);
            } else if ((this as any) && (this as any).recomputeSelected && typeof (this as any).recomputeSelected === 'function') {
              (this as any).recomputeSelected();
            }
          } catch (_e) {}
        }
        return;
      }
    } catch (_e) {
      // en caso de error en conteo, continuar con la eliminación original
    }

    try {
      this.eliminar(i);
    } catch (e) {
      console.log('[eliminarWrap] Error en eliminar(i):', e);
    }
    this.recomputeSelectedPlazos();
  }

  public listenerPlazoWrap(i: number): void {
    try {
      this.listenerPlazo(i);
    } catch (e) {
      console.log('[listenerPlazoWrap] Error en listenerPlazo(i):', e);
    }
    this.recomputeSelectedPlazos();

    // Validacion defensiva de duplicados
    var seleccionados: number[] = [];
    var active = this._activeRows();
    for (let k = 0; k < active.length; k++) {
      const id = this._getPlazoId(active[k]);
      if (id !== null) seleccionados.push(id);
    }
    var size = (new Set(seleccionados)).size;
    this.plazosValidos = (size === seleccionados.length);
    console.log('[listenerPlazoWrap] plazosValidos=', this.plazosValidos, 'seleccionados=', seleccionados);
  }

  ngAfterViewInit(): void {
    try {
      this.recomputeSelectedPlazos();
      console.log('[ngAfterViewInit] Inicializado con', this.selectedPlazos.size, 'plazos seleccionados');
    } catch (e) {
      console.log('[ngAfterViewInit] error:', e);
    }
  }
  // ====== END: helpers ======

  private normalizePlazoNulls(): void {
    try {
      const anyThis: any = this;
      const coll: any[] = (anyThis && anyThis.model && anyThis.model.registrarEntidadFinanciera && anyThis.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection)
        ? anyThis.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection
        : [];
      for (let k = 0; k < coll.length; k++) {
        const row = coll[k];
        if (!row) { continue; }
        if (!row.mclcPlazo) {
          row.mclcPlazo = { id: null };
        } else if (row.mclcPlazo.id === undefined || row.mclcPlazo.id === '' || row.mclcPlazo.id === 0) {
          row.mclcPlazo.id = null;
        }
      }
    } catch (_e) { /* noop */ }
  }

  public trackByPlazoId(index: number, item: any): any {
    return item && item.id !== undefined ? item.id : index;
  }

  public comparePlazoIds(a: any, b: any): boolean {
    if (a == null && b == null) { return true; }
    if (a == null || b == null) { return false; }
    return Number(a) === Number(b);
  }
}
