import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { SideNavItem } from '../../models/side-nav-item.model';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { AuthenticationService } from 'src/app/modules/authentication/services/authentication.service';
import { ModalChangeSubsidiaryComponent } from '../modais/modal-change-subsidiary/modal-change-subsidiary.component';
import { ModalChangePasswordComponent } from '../modais/modal-change-password/modal-change-password.component';
import { ModalChangePhotoUserComponent } from '../modais/modal-change-photo-user/modal-change-photo-user.component';
import { ConfiguracoesPermissoes } from '../../consts/permissions.const';


@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {
  isDropDownOpen: boolean = false;

  sideNav: SideNavItem[] = [
    {
      name: 'paginaInicial',
      icon: '../../../../../assets/icons/side-nav/home.svg',
      link: 'home',
    },
    {
      name: 'acessoSeguranca',
      icon: '../../../../../assets/icons/side-nav/access-security.svg',
      link: '',
      hidden: true
    },
    {
      name: 'parametros',
      icon: '../../../../../assets/icons/side-nav/parameters.svg',
      link: '',
      hidden: true
    },
    {
      name: 'active',
      icon: '../../../../../assets/icons/side-nav/home.svg',
      link: '',
      hidden: true
    },
    {
      name: 'cadastros',
      icon: '../../../../../assets/icons/side-nav/register.svg',
      link: '',
      hidden: true
    },
    {
      name: 'coletas',
      icon: '../../../../../assets/icons/side-nav/collect.svg',
      link: 'collection/list',
      // showSubItems: false,
      // subItems: [
      //   {
      //     name: 'baixas',
      //     icon: '',
      //     link: '',
      //     // showSubItems: false,
      //     // subItems: [
      //     //   {
      //     //     name: 'Teste',
      //     //     icon: '',
      //     //     link: '',
      //     //   }
      //     // ]
      //   },
      //   {
      //     name: 'coletaAutomatica',
      //     icon: '',
      //     link: ''
      //   },
      //   {
      //     name: 'coletas',
      //     icon: '',
      //     link: 'collection/list'
      //   }
      // ]
    },
    {
      name: 'combustivel',
      icon: '../../../../../assets/icons/side-nav/fuel.svg',
      link: '',
      hidden: true
    },
    {
      name: 'comercial',
      icon: '../../../../../assets/icons/side-nav/home.svg',
      link: '',
      hidden: true
    },
    {
      name: 'conferenciaDeNotasFiscais',
      icon: '../../../../../assets/icons/side-nav/conference.svg',
      link: 'conference/list',
      // showSubItems: false,
      // subItems: [
      //   {
      //     name: 'conferenciaDeNotasFiscais',
      //     icon: '',
      //     link: 'conference/list',
      //   },
      //   {
      //     name: 'volumesEmDesacordo',
      //     icon: '',
      //     link: 'conference/volumes-disagreement',
      //   }
      // ]
    },
    // {
    //   name: 'contasPagar',
    //   icon: '../../../../../assets/icons/side-nav/accounts-pay.svg',
    //   link: 'accounts-payable/list',
    //   iconClass: 'mb-1'
    // },
    {
      name: 'contasReceber',
      icon: '../../../../../assets/icons/side-nav/accounts-receivable.svg',
      link: '',
      iconClass: 'mb-1',
      showSubItems: false,
      subItems: [
        {
          name: 'contasReceber',
          icon: '',
          link: 'accounts-receivable/list',
        },
        {
        name: 'documentosPendentes',
        icon: '',
        link: 'accounts-receivable/pending-documents',
        }
      ]
    },
    {
      name: 'crm',
      icon: '../../../../../assets/icons/side-nav/home.svg',
      link: '',
      hidden: true
    },
    {
      name: 'cte',
      icon: '../../../../../assets/icons/side-nav/home.svg',
      link: '',
      hidden: true
    },
    {
      name: 'edi',
      icon: '../../../../../assets/icons/side-nav/home.svg',
      link: '',
      hidden: true
    },
    {
      name: 'entregas',
      icon: '../../../../../assets/icons/side-nav/home.svg',
      link: '',
      hidden: true
    },
    {
      name: 'faturamento',
      icon: '../../../../../assets/icons/side-nav/billings.svg',
      link: '',
      hidden: true
    },
    {
      name: 'fiscal',
      icon: '../../../../../assets/icons/side-nav/home.svg',
      link: '',
      hidden: true
    },
    {
      name: 'fluxoDeCaixa',
      icon: '../../../../../assets/icons/side-nav/cash-flow.svg',
      link: '',
      hidden: true
    },
    {
      name: 'gestao',
      icon: '../../../../../assets/icons/side-nav/management.svg',
      link: '',
      hidden: true
    },
    {
      name: 'manutencao',
      icon: '../../../../../assets/icons/side-nav/maintenance.svg',
      link: '',
      hidden: true
    },
    {
      name: 'mdfe',
      icon: '../../../../../assets/icons/side-nav/home.svg',
      link: '',
      hidden: true
    },
    {
      name: 'nfe',
      icon: '../../../../../assets/icons/side-nav/home.svg',
      link: '',
      hidden: true
    },
    {
      name: 'ocorrencias',
      icon: '../../../../../assets/icons/side-nav/occurrences.svg',
      link: '',
      hidden: true
    },
    {
      name: 'parceiros',
      icon: '../../../../../assets/icons/side-nav/partners.svg',
      link: '',
      hidden: true
    },
    {
      name: 'pneus',
      icon: '../../../../../assets/icons/side-nav/tires.svg',
      link: '',
      hidden: true
    },
    {
      name: 'portaria',
      icon: '../../../../../assets/icons/side-nav/home.svg',
      link: '',
      hidden: true
    },
    {
      name: 'portuario',
      icon: '../../../../../assets/icons/side-nav/home.svg',
      link: '',
      hidden: true
    },
    {
      name: 'recebimento',
      icon: '../../../../../assets/icons/side-nav/receipt.svg',
      link: '',
      hidden: true
    },
    {
      name: 'trafego',
      icon: '../../../../../assets/icons/side-nav/traffic.svg',
      link: '',
      hidden: true
    },
    {
      name: 'viagem',
      icon: '../../../../../assets/icons/side-nav/travel.svg',
      link: '',
      hidden: true
    }
  ];

  lastUrl: string = '';
  settingsSideNav: SideNavItem[] = [
    {
      name: 'voltar',
      link: '',
    },
    {
      name: 'permissoes',
      link: 'settings/permissions/actions',
      showSubItems: false,
      subItems: [
        {
          name: 'grupos',
          link: 'settings/permissions/groups',
        },
        // {
        //   name: 'usuarios',
        //   link: 'settings/permissions/users'
        // }
      ]
    },
    {
      name: 'camposPersonalizados',
      link: 'settings/custom-fields/actions',
      showSubItems: false,
      subItems: [
        {
          name: 'cadastro',
          link: 'settings/custom-fields/list',
        },
        {
          name: 'novaExibicao',
          link: 'settings/exhibitions/list',
        },
      ]
    }
  ]

  stateSideBar: boolean = false;
  stateSideBarSaved: boolean = false;

  nameUser: string | null = null;
  nameCompany: string | null = null;

  screens: SideNavItem[] = [];
  screensName: string[] = [];
  currentScreen: string = '';
  activeSettings: boolean = false;
  @ViewChild('btnSettings') btnSettings: ElementRef = <ElementRef>{};
  permissions: string [];
  authSettings = ConfiguracoesPermissoes;

  constructor(private translate: TranslateService,
    private router: Router,
    private storage: StorageService,
    private authService: AuthenticationService,
    private modalService: NgbModal
  ) {
    this.translate.use('pt-br');
    this.permissions = storage.getPermissionsUser();
    this.nameUser = storage.getNameUser();
    this.nameCompany = storage.getCompanyName();

    this.stateSideBarSaved = localStorage.getItem('stateSideBar') == 'true' ? true : false;
    this.stateSideBar = !this.stateSideBarSaved;

    this.setSettingsModule();

    this.getScreens();
  }

  setSettingsModule() {
    if (!this.permissions.includes(this.authSettings.Visualizar)) return;
    const sectionSettigns = sessionStorage.getItem('sectionSettigns');

    if (sectionSettigns) {
      this.activeSettings = sectionSettigns === 'true' ? true : false;
    } else {
      this.activeSettings = false
    }

    this.lastUrl = sessionStorage.getItem('lastUrl') ? sessionStorage.getItem('lastUrl')! : '';

    if (this.router.url.indexOf('settings') !== -1 && !this.activeSettings) {
      this.activeSettings = true;
    }
  }

  contentClick() {
    if (this.stateSideBarSaved == false && !this.stateSideBar) {
      this.toggleSidebar();
    }
  }

  fixedSideBar() {
    this.stateSideBarSaved = !this.stateSideBarSaved;
    localStorage.removeItem('stateSideBar');
    localStorage.setItem('stateSideBar', this.stateSideBarSaved ? 'true' : 'false');
    this.toggleSidebar();
  }

  toggleSidebar() {
    this.stateSideBar = !this.stateSideBar;

    for (const menu of this.sideNav) {
      this.sideNav[this.sideNav.indexOf(menu)].showSubItems = false;
    }
  }

  selected(item: SideNavItem) {
    const router = this.router.url.split('?')[0];

    if (item.subItems) {
      for (const sub of item.subItems!) {
        if (router == `/${sub.link}`) {
          return true;
        } else if (sub.subItems) {
          for (const subTwo of sub.subItems) {
            if (router == `/${subTwo.link}`) {
              return true;
            }
          }
        }
      }
    }

    if (router == `/${item.link}`) {
      return true;
    } else {
      return false;
    }
  }

  openItem(item: SideNavItem) {
    if (item.subItems) {
      if (this.stateSideBar) {
        this.toggleSidebar();
      }

      if (this.sideNav.indexOf(item) >= 0) {
        this.sideNav[this.sideNav.indexOf(item)].showSubItems = !this.sideNav[this.sideNav.indexOf(item)].showSubItems;
      }

      if (this.settingsSideNav.indexOf(item) >= 0) {
        this.settingsSideNav[this.settingsSideNav.indexOf(item)].showSubItems = !this.settingsSideNav[this.settingsSideNav.indexOf(item)].showSubItems;
      }

    } else {
      this.settingsSideNav.forEach(setting => {
        if (setting.name === 'voltar') setting.link = this.lastUrl;
      });

      this.getScreens();

      this.translate.get(item.name).subscribe((translatedName: string) => {
        this.currentScreen = translatedName;
      });

      sessionStorage.clear()

      this.router.navigateByUrl(item.link);
    }
  }

  doLogout() {
    sessionStorage.clear();
    this.authService.doLogout().subscribe({
      next: (response) => {
        this.storage.doLogout();
      },
      error: (response) => {

      }
    });
  }

  getScreens() {
    for (const item of this.sideNav) {
      if (item.subItems) {
        for (const sub of item.subItems) {
          if (sub.subItems) {
            for (const subS of sub.subItems) {
              subS.link ? this.screens.push(subS) : null;
            }
          } else {
            sub.link ? this.screens.push(sub) : null;
          }
        }
      } else {
        item.link ? this.screens.push(item) : null;
      }
    }

    for (const screen of this.screens) {
      this.translate.get(screen.name).subscribe((translated: string) => {
        this.screensName.push(`${translated}`)

        if (this.router.url == `/${screen.link}`) {
          this.currentScreen = translated;
        }
      });
    }

  }

  goToScreen(event: any) {
    if (event !== null) {
      sessionStorage.clear()
      if (Number(event) >= 0) {
        this.router.navigate([this.screens[Number(event)].link]);
      }
    }
  }

  openModalChangeSubsidiary() {
    const modalOptions: NgbModalOptions = {
      centered: true,
    };
    const modalRef = this.modalService.open(ModalChangeSubsidiaryComponent, modalOptions);

    modalRef.result
      .then((result: boolean) => {
        if (result) {
          location.reload();
        }
      })
      .catch((result) => {

      })
  }


  openDropDown(){
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  openModalChangePhotoUser(){
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-change-photo-user',
    };
    const modalRef = this.modalService.open(ModalChangePhotoUserComponent, modalOptions);

  }

  openModalChangePassword(){
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-change-password',
    };
    const modalRef = this.modalService.open(ModalChangePasswordComponent, modalOptions);

  }

  goToSettings() {
    if (!this.activeSettings) {
      sessionStorage.setItem('lastUrl', this.router.url);
      this.lastUrl = sessionStorage.getItem('lastUrl') ? sessionStorage.getItem('lastUrl')! : '';
    }

    this.btnSettings.nativeElement.blur();
    this.activeSettings = true
    sessionStorage.setItem('sectionSettigns', String(this.activeSettings));

    if (this.activeSettings) {
      this.router.navigate(['settings/permissions/groups']);
    }
  }

}
