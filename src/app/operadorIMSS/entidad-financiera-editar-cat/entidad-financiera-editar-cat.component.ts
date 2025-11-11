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
      //  console.log("Delegaciones: ", response);
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

    try { this.recomputeSelectedPlazos(); } catch (_e) {}
    try { (this as any).validarPlazos && (this as any).validarPlazos(); } catch (_e) {}
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
      //  console.log('Response:', response.catAnterior);
      this.CATMaximoActual = response.catAnterior;
  } );

  }

  agregar(index?: number) {
    //  console.log("agregar index:" + index);
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
    //  console.log("eliminar index 1:" + index);
    //if (index != 0) {
    //if (index !== -1) {
    //  console.log("eliminar index 2:" + index);
    if (this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection[index].fecRegistroAlta === null) {
      this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection.splice(index, 1);
      //  console.log("eliminar index 3:" + index);
    } else {
      //  console.log("eliminar index 4:" + index);
      this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection[index].bajaRegistro = this.datePipe.transform(new Date(), 'dd/MM/yyyy ') + '00:00:00';
    }
    //}
    //}
    //  console.log("eliminar index 5:" + index);
    this.validarPlazos()
  }

  listenerPlazo(index: number) {
    let id = this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection[index].mclcPlazo.id;
    this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection[index].mclcPlazo.descripcion = this.mapPlazos[id];
    this.validarPlazos()
  }

  validarPlazos() {
    let plazos = this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection;
    //  console.log("validarPlazos:" + plazos);
    this.plazosValidos = true;
    this.model.flatPlazosModEF = true;
    let plazosSet = new Set();
    plazos.forEach(element => {

      //  console.log("validarPlazos element:", element);
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

/** Catálogo de plazos [{id, descripcion}]. Toma el arreglo oficial si existe; si no, lo arma desde mapPlazos */
private getCatalogoPlazos(): any[] {
  const anyThis: any = this;

  // Si tu componente ya trae un arreglo, úsalo (ajusta el nombre si aplica)
  if (anyThis.catalogoPlazos && anyThis.catalogoPlazos.length) { return anyThis.catalogoPlazos; }
  if (anyThis.listaPlazos && anyThis.listaPlazos.length) { return anyThis.listaPlazos; }

  // Construir desde mapPlazos (que ya usas en HTML)
  const mp = anyThis.mapPlazos || {};
  const out: any[] = [];
  for (var k in mp) {
    if (Object.prototype.hasOwnProperty.call(mp, k)) {
      var idNum = ('' + k).match(/^\d+$/) ? parseInt(k, 10) : k;
      out.push({ id: idNum, descripcion: mp[k] });
    }
  }
  out.sort(function(a, b) {
    var an = (typeof a.id === 'number') ? a.id : Number.MAX_SAFE_INTEGER;
    var bn = (typeof b.id === 'number') ? b.id : Number.MAX_SAFE_INTEGER;
    return an - bn;
  });
  return out;
}

  private _getCollection(): any[] {
    try {
      return (this.model && this.model.registrarEntidadFinanciera && this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection)
        ? this.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection
        : [];
    } catch (e) {
      //  console.log('[[_getCollection]] error:', e);
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

  /** Filas activas: bajaRegistro == null */
private getActivas(): any[] {
  const anyThis: any = this;
  const coll: any[] = (anyThis && anyThis.model && anyThis.model.registrarEntidadFinanciera
    && anyThis.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection)
      ? anyThis.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection
      : [];
  const out: any[] = [];
  for (let i = 0; i < coll.length; i++) {
    const r = coll[i];
    if (r && r.bajaRegistro == null) out.push(r);
  }
  return out;
}

/** Recalcula el set de plazos usados SOLO con filas activas */
private recomputeSelectedPlazos(): void {
  (this as any)._selectedPlazos = {};
  const activas = this.getActivas();
  for (let i = 0; i < activas.length; i++) {
    const r = activas[i];
    if (r && r.mclcPlazo && r.mclcPlazo.id != null) {
      (this as any)._selectedPlazos[r.mclcPlazo.id] = true;
    }
  }
}


  /** Plazos disponibles para la fila i: incluye su propio plazo y excluye los usados por otras activas */
public getPlazosDisponibles(i: number): any[] {
  const all = this.getCatalogoPlazos();
  const sel = (this as any)._selectedPlazos || {};

  // plazo actual de la fila i
  let currentId: any = null;
  const anyThis: any = this;
  const coll: any[] = (anyThis && anyThis.model && anyThis.model.registrarEntidadFinanciera
    && anyThis.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection)
      ? anyThis.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection
      : [];
  if (i > -1 && i < coll.length && coll[i] && coll[i].mclcPlazo) {
    currentId = coll[i].mclcPlazo.id;
  }

  const out: any[] = [];
  for (let k = 0; k < all.length; k++) {
    const p = all[k];
    if (!sel[p.id] || p.id === currentId) {
      out.push(p);
    }
  }
  return out;
}

  /** Plazos libres para una NUEVA fila (excluye los usados por activas) */
private getPlazosDisponiblesParaNueva(): any[] {
  const all = this.getCatalogoPlazos();
  const sel = (this as any)._selectedPlazos || {};
  const out: any[] = [];
  for (let k = 0; k < all.length; k++) {
    const p = all[k];
    if (!sel[p.id]) out.push(p);
  }
  return out;
}

/** Se puede agregar si hay < 10 activas y existe al menos 1 plazo libre */
public canAddMore(): boolean {
  const activos = this.getActivas().length;
  if (activos >= 10) { return false; }
  return this.getPlazosDisponiblesParaNueva().length > 0;
}

/** Agregar nueva fila solo si se puede (y deja la colección consistente) */
public agregarWrap(): void {
  if (!this.canAddMore()) { return; }

  const anyThis: any = this;
  const coll: any[] = (anyThis && anyThis.model && anyThis.model.registrarEntidadFinanciera
    && anyThis.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection)
      ? anyThis.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection
      : [];

  coll.push({
    id: null,
    bajaRegistro: null,
    mclcPlazo: { id: null },
    porCat: null,        // CAT Máximo EF
    porTasaAnual: null   // otro campo de EF si lo usas
  });

  try { this.recomputeSelectedPlazos(); } catch (_e) {}
  try { (this as any).validarPlazos && (this as any).validarPlazos(); } catch (_e) {}
}


  public eliminarWrap(i: number): void {
  const anyThis: any = this;
  const coll: any[] = (anyThis && anyThis.model && anyThis.model.registrarEntidadFinanciera
    && anyThis.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection)
      ? anyThis.model.registrarEntidadFinanciera.mclcCondicionOfertaCollection
      : [];

  // contar activas y localizar última
  let activos = 0, ultimoIdx = -1;
  for (let k = 0; k < coll.length; k++) {
    if (coll[k] && coll[k].bajaRegistro == null) { activos++; ultimoIdx = k; }
  }

  // 1 sola activa -> NO borrar la fila ni tocar el plazo: limpiar SOLO CAT EF
  if (activos <= 1) {
    const idx = (ultimoIdx !== -1) ? ultimoIdx : i;
    const row = coll[idx];
    if (row) {
      row.porCat = null;        // EF
      row.porTasaAnual = null;  // EF (si aplica)
      // mantener IMSS y plazo
      try { this.recomputeSelectedPlazos(); } catch (_e) {}
      try { (this as any).validarPlazos && (this as any).validarPlazos(); } catch (_e) {}
    }
    return;
  }

  // 2+ activas -> soft/hard delete
  const row = coll[i];
  if (row && row.id) {
    // SOFT DELETE: marcar baja; que el back procese la baja
    row.bajaRegistro = new Date().toISOString();
  } else {
    // HARD DELETE: solo si es nueva (sin id)
    if (i > -1 && i < coll.length) { coll.splice(i, 1); }
  }

  try { this.recomputeSelectedPlazos(); } catch (_e) {}
  try { (this as any).validarPlazos && (this as any).validarPlazos(); } catch (_e) {}
}

  public listenerPlazoWrap(i: number): void {
  try {
    if (typeof (this as any).listenerPlazo === 'function') {
      (this as any).listenerPlazo(i);
    }
  } catch (_e) {}
  try { this.recomputeSelectedPlazos(); } catch (_e) {}
  try { (this as any).validarPlazos && (this as any).validarPlazos(); } catch (_e) {}
}


  ngAfterViewInit(): void {
    try {
      this.recomputeSelectedPlazos();
      //  console.log('[ngAfterViewInit] Inicializado con', this.selectedPlazos.size, 'plazos seleccionados');
    } catch (e) {
      //  console.log('[ngAfterViewInit] error:', e);
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
