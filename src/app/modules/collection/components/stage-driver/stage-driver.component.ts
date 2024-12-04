import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { CollectionService } from '../../services/collection.service';
import { Motorista } from '../../models/driver-collection.model';
import { AlertTruckPlate } from '../../models/alert-field-truck-plate.model';
import { DriverAdvancedSearch } from 'src/app/modules/shared/models/driver.model';

@Component({
  selector: 'app-stage-driver',
  templateUrl: './stage-driver.component.html',
  styleUrls: ['./stage-driver.component.scss']
})
export class StageDriverComponent implements OnChanges {

  loading: boolean = false;
  companyId: string;
  driversName: string[] = [];
  infoDrivers: any[] = [];
  typesVehiclesName: string[] = [];
  typesVehicles: any[] = [];
  vehicleLicensePlateName: string[] = [];
  vehicleLicensePlate: any[] = [];
  truckLicensePlateName: string[] = [];
  truckLicensePlate: any[] = [];
  truckLicensePlateName02: string[] = [];
  truckLicensePlate02: any[] = [];
  truckLicensePlateName03: string[] = [];
  truckLicensePlate03: any[] = [];
  @Input() readonly: boolean = false;
  @Input() driver: Motorista = <Motorista>{};
  @Output() driverEmitter = new EventEmitter<Motorista>();
  @Input() alertRequired: boolean = false;
  @Input() totalFieldTruck: number = 1;
  @Output() totalFieldTruckEmitter: EventEmitter<number> = new EventEmitter<number>();
  @Input() alertTruckPlate: AlertTruckPlate = <AlertTruckPlate>{};
  @Output() alertTruckPlateEmmiter: EventEmitter<AlertTruckPlate> = new EventEmitter<AlertTruckPlate>();
  loadingDriver: boolean = false;
  loadingPV: boolean = false;
  loadingPC1: boolean = false;
  loadingPC2: boolean = false;
  loadingPC3: boolean = false;

  /** Construtor da classe `StageDriverComponent`.
   * @param storageService Service responsável para buscar e inserir dados no Storage.
   * @param collectionService Service responsável para chamada de APIs de Coleta.
  */
  constructor(
    private readonly storageService: StorageService,
    private readonly collectionService: CollectionService
  ) {
    this.companyId = this.storageService.getCompanyId()!;
    this.searchTypeVehicle("");
  }

  /** Responsável pela detecção de alterações de valores no componente.
   * @param changes Diretiva que contém as modificações do componente.
  */
  ngOnChanges(changes: SimpleChanges): void {
    this.driverEmitter.emit(this.driver)
  }

  /** Recebe as informações do motorista selecionado em `gm-driver` e atribui suas informações ao objeto de coleta.
   * @param driverSelected Informações do motorista selecionado.
  */
  driverSelected(driverSelected: DriverAdvancedSearch | null) {
    if (driverSelected === null) {
      this.driver.motorista = '';
      this.driver.cpf = '';
      this.driver.rg = '';
      this.driver.cnh_vencida = false;
    } else {
      this.driver.motorista = driverSelected.nome;
      this.driver.cpf = driverSelected.cpf;
      this.driver.rg = driverSelected.rg;
      this.driver.cnh_vencida = driverSelected.cnh_vencida;
    }
    this.driverEmitter.emit(this.driver)
  }

  /** Monta um objeto do tipo `Driver` para ser utilizado no grupo modular `gm-driver`.
   * @return Retorna um objeto do tipo `Driver`.
  */
  setDriver(): DriverAdvancedSearch {
    const infoDriver: DriverAdvancedSearch = {
      nome: this.driver.motorista,
      rg: this.driver.rg,
      cpf: this.driver.cpf,
      cnh_vencida: this.driver.cnh_vencida
    }

    return infoDriver;
  }

  /** Busca na API tipos de veículos.*/
  searchTypeVehicle(event: any) {
    this.loading = true;
    this.collectionService.getTypeVehicle(this.companyId, event).subscribe({
      next: response => {
        this.typesVehiclesName = response.dados.map((vehicles: any) => vehicles.nome);
        this.typesVehicles = response.dados;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
      }
    });
  }

  /** Atribui ao objeto de coleta o tipo de veículo selecionado.
   * @param index Indice do tipo de veículo selecionado.
  */
  selectTypeVehicle(index: number | null) {
    if (index !== null) {
      let item: any = this.typesVehicles.at(index);
      this.driver.tipoVeiculo = item.nome
      this.driver.numVeiculo = item.numero;
    } else {
      this.driver.tipoVeiculo = '';
      this.driver.numVeiculo = '';
    }
  }

  /** Busca na API placas de veículos referente ao que foi digitado.
   * @param search Campo de busca.
  */
  searchVehicleLicensePlate(search: any) {
    this.loadingPV = true;
    this.collectionService.getVehicleLicensePlate(this.companyId, search).subscribe({
      next: response => {
        this.vehicleLicensePlateName = response.dados.map((vehicles: any) => vehicles.placaCavMec);
        this.vehicleLicensePlate = response.dados;
        this.loadingPV = false;
      },
      error: err => {
        this.loadingPV = false;
      }
    });
  }

  /** Atribui ao objeto de coleta a placa de veículo selecionado.
   * @param index Indice da placa selecionada.
  */
  selectVehicleLicensePlate(index: number | null) {
    if (index !== null) {
      let item: any = this.vehicleLicensePlate.at(index);
      this.driver.placaVeiculo = item.placaCavMec;
      this.driver.tipoVeiculo = item.dctpVeiculo;
      this.driver.numVeiculo = item.cdtpVeiculo;

      if (this.driver.placaVeiculo === this.driver.placaCarreta02 ||
        this.driver.placaVeiculo === this.driver.placaCarreta03 ||
        this.driver.placaVeiculo === this.driver.placaCarreta
      ) {
        this.alertTruckPlate.alertVehicle = true;
      } else {
        this.alertTruckPlate.alertVehicle = false;
      }

    } else {
      this.alertTruckPlate.alertVehicle = false;
      this.driver.placaVeiculo = '';
      this.driver.tipoVeiculo = '';
      this.driver.numVeiculo = '';
    }

    this.removeAlert();
  }

  /** Busca na API placas de carreta de acordo com os parâmetros passados.
   * @param search Campo de busca.
   * @param field Númeração do campo no qual está realizando a busca.
  */
  searchTruckLicensePlate(search: any, field: 1 | 2 | 3) {
    if (field == 1) {
      this.loadingPC1 = true;
    } else if (field == 2) {
      this.loadingPC2 = true;
    } else if (field == 3) {
      this.loadingPC3 = true;
    }
    this.collectionService.getVehicleLicensePlate(this.companyId, search).subscribe({
      next: response => {
        switch (field) {
          case 1:
            this.truckLicensePlateName = response.dados.map((trucks: any) => trucks.placaCavMec);
            this.truckLicensePlate = response.dados;
            this.loadingPC1 = false;
            break;
          case 2:
            this.truckLicensePlateName02 = response.dados.map((trucks: any) => trucks.placaCavMec);
            this.truckLicensePlate02 = response.dados;
            this.loadingPC2 = false;
            break;
          case 3:
            this.truckLicensePlateName03 = response.dados.map((trucks: any) => trucks.placaCavMec);
            this.truckLicensePlate03 = response.dados;
            this.loadingPC3 = false;
            break;
        }
      },
      error: err => {
        if (field == 1) {
          this.loadingPC1 = false;
        } else if (field == 2) {
          this.loadingPC2 = false;
        } else if (field == 3) {
          this.loadingPC3 = false;
        }
      }
    });
  }

  /** Remove os indicativos de alerta nos campos de placa. */
  removeAlert() {
    if (
      this.driver.placaVeiculo !== this.driver.placaCarreta02 &&
      this.driver.placaVeiculo !== this.driver.placaCarreta03 &&
      this.driver.placaVeiculo !== this.driver.placaCarreta
    ) this.alertTruckPlate.alertVehicle = false;

    if (
      this.driver.placaCarreta !== this.driver.placaCarreta02 &&
      this.driver.placaCarreta !== this.driver.placaCarreta03 &&
      this.driver.placaCarreta !== this.driver.placaVeiculo
    ) this.alertTruckPlate.alert1 = false;

    if (
      this.driver.placaCarreta02 !== this.driver.placaCarreta &&
      this.driver.placaCarreta02 !== this.driver.placaCarreta03 &&
      this.driver.placaCarreta02 !== this.driver.placaVeiculo
    ) this.alertTruckPlate.alert2 = false;

    if (
      this.driver.placaCarreta03 !== this.driver.placaCarreta &&
      this.driver.placaCarreta03 !== this.driver.placaCarreta02 &&
      this.driver.placaCarreta03 !== this.driver.placaVeiculo
    ) this.alertTruckPlate.alert3 = false;
  }

  /** Atribui ao objeto de coleta a placa selecionada de acordo com os parâmetros passados.
   * @param index Indice da placa selecionada.
   * @param field Númeração do campo no qual foi realizada a seleção.
  */
  selectTruckLicensePlate(index: number | null, field: 1 | 2 | 3) {
    if (index !== null) {
      switch (field) {
        case 1:
          let item: any = this.truckLicensePlate.at(index);
          if (item.placaCavMec === this.driver.placaCarreta02 ||
            item.placaCavMec === this.driver.placaCarreta03 ||
            item.placaCavMec === this.driver.placaVeiculo
          ) {
            this.alertTruckPlate.alert1 = true;
          } else {
            this.alertTruckPlate.alert1 = false;
          }
          this.driver.placaCarreta = item.placaCavMec
          break;
        case 2:
          let item2: any = this.truckLicensePlate02.at(index);
          if (item2.placaCavMec === this.driver.placaCarreta ||
            item2.placaCavMec === this.driver.placaCarreta03 ||
            item2.placaCavMec === this.driver.placaVeiculo
          ) {
            this.alertTruckPlate.alert2 = true;
          } else {
            this.alertTruckPlate.alert2 = false;
          }
          this.driver.placaCarreta02 = item2.placaCavMec;
          break;
        case 3:
          let item3: any = this.truckLicensePlate03.at(index);
          if (item3.placaCavMec === this.driver.placaCarreta ||
            item3.placaCavMec === this.driver.placaCarreta02 ||
            item3.placaCavMec === this.driver.placaVeiculo
          ) {
            this.alertTruckPlate.alert3 = true;
          } else {
            this.alertTruckPlate.alert3 = false;
          }
          this.driver.placaCarreta03 = item3.placaCavMec;
          break;
      }
    } else {
      switch (field) {
        case 1:
          this.alertTruckPlate.alert1 = false;
          this.driver.placaCarreta = '';
          break;
        case 2:
          this.alertTruckPlate.alert2 = false;
          this.driver.placaCarreta02 = '';
          break;
        case 3:
          this.alertTruckPlate.alert3 = false;
          this.driver.placaCarreta03 = '';
          break;
      }
    }

    this.removeAlert();
    this.alertTruckPlateEmmiter.emit(this.alertTruckPlate);
  }

  /** Adiciona um novo campo de Placa da carreta. */
  newFieldPlateTruck() {
    if (this.totalFieldTruck == 3) return;

    this.totalFieldTruck++;
    this.totalFieldTruckEmitter.emit(this.totalFieldTruck)
  }
}
