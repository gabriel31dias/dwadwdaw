import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { StorageService } from '../../services/storage.service';
import { EmpresaUsuario } from '../../../shared/models/companies-user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { Filial } from 'src/app/modules/shared/models/subsidiaries.model';
import { PermissionService } from 'src/app/modules/settings/services/permission.service';
import { SnackbarType } from 'src/app/modules/shared/consts/snackbar-type.const';

@Component({
  selector: 'app-select-company',
  templateUrl: './select-company.component.html',
  styleUrls: ['./select-company.component.scss']
})
export class SelectCompanyComponent implements OnInit {

  companyId: string;
  nameUser: string = '';
  companies: EmpresaUsuario[] = [];
  companiesNames: string[] = [];
  indexCompanySelected: number  | null = null;
  companySelected: EmpresaUsuario = <EmpresaUsuario>{};
  snackbar: Snackbar = new Snackbar();
  subsidiaries: Filial[] = [];
  loading: boolean = false;

  /** Construtor da classe `GmDriverComponent`.
   * @param translate Service responsável pela tradução do sistema.
   * @param router Service responsável pela chamada de rotas URL.
   * @param storageService Service responsável para buscar e inserir dados no Storage.
   * @param authService Service responsável para chamada de APIs de Autenticação.
   * @param sharedService Service responsável para chamada de APIs do módulo compartilhado.
   * @param permissionService Service responsável para chamada de APIs de Permissões.
  */
  constructor(private translate: TranslateService,
    private router: Router,
    private storageService: StorageService,
    private authService: AuthenticationService,
    private sharedService: SharedService,
    private permissionService: PermissionService
  ) {
    this.translate.use('pt-br');
    this.nameUser = storageService.getNameUser()!;
    this.companyId = storageService.getCompanyId()!;
  }

  /** Método executado ao carregar o componente. */
  ngOnInit(): void {
    this.getCompaniesOfUser();
  }

  /** Realiza a busca de empresas matriz. */
  getCompaniesOfUser() {
    this.authService.getCompaniesOfUser().subscribe({
      next: (response) => {
        this.companies = response.dados;
        this.companiesNames = this.companies.map(company => {
          return company.nomeFantasia;
        })
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  /** Atribui o valor a empresa selecionada
   * @param event Evento de clique no botão.
   */
  selectCompany(event: boolean) {
    if (event && this.indexCompanySelected !== null) {
      this.companySelected = this.companies[this.indexCompanySelected];
      this.loginCompany();
    } else {
      this.snackbar.open = true;
      this.snackbar.message = 'empresaNaoSelecionadaAcesso';
    }
  }

  /** Efetua o login na empresa selecionada. */
  loginCompany() {
    this.authService.loginCompany(this.companySelected.empresaId).subscribe({
      next: (response) => {
        this.storageService.setNameUser(response.dados.nomeUsuario);
        this.storageService.setToken(response.dados.token);
        this.setCompanySelected();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.type = SnackbarType.Danger;
      }
    })
  }

  /** Método responsável por inserir os dados da filial atual da empresa matriz selecionada. */
  setCompanySelected() {
    if (this.companySelected.cdFilial) {
      this.loading = true;
      // Busca todas as filiais da empresa matriz selecionada.
      this.sharedService.getSubsidiaries(this.companySelected.empresaId).subscribe({
        next: async (response) => {
          this.subsidiaries = response.dados;

          await this.setNameSubsidiary();
          this.storageService.setCompany(this.companySelected);
          this.permissionsUser();
        },
        error: (response) => {
          this.loading = false;
          this.snackbar.open = true;
          this.snackbar.message = response.error.mensagem;
          this.snackbar.errorHandling = response.error.tratamentoErro;
          this.snackbar.type = SnackbarType.Danger;
        }
      })
    } else {
      this.storageService.setCompany(this.companySelected);
      this.permissionsUser();
    }
  }

  /** Insere o nome da filial atual da empresa matriz selecionada. */
  async setNameSubsidiary() {
    for (const sub of this.subsidiaries) {
      if (sub.cdFilial === this.companySelected.cdFilial) {
        this.companySelected.nomeFantasia = sub.nome;
        return
      }
    }
  }

  /** Faz o logout do sistema, redirecionando o usuário para a tela de login. */
  logout(event: boolean) {
    this.authService.doLogout().subscribe({
      next: (response) => {
        this.storageService.doLogout();
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.type = SnackbarType.Danger;
      }
    });
  }

  /** Obtém as permissões do usuário logado e salva elas no local storage. */
  permissionsUser() {
    this.companyId = this.storageService.getCompanyId()!;
    this.permissionService.getPermissionsUser(this.companyId).subscribe({
      next: (response) => {
        this.loading = false;
        const permissions: string[] = response.dados;
        this.storageService.setPermissionsUser(permissions);
        this.router.navigate(['/home']);
      },
      error: (response) => {
        this.loading = false;
        const permissions: string[] = [];
        this.storageService.setPermissionsUser(permissions);
        this.router.navigate(['/home']);

        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.type = SnackbarType.Danger;
      }
    })
  }


}
