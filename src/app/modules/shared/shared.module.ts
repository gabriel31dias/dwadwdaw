import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { RouterModule } from '@angular/router';
import { provideEnvironmentNgxCurrency, NgxCurrencyInputMode, NgxCurrencyDirective } from 'ngx-currency';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

import { InputComponent } from './components/inputs/input/input.component';
import { BtnConfirmActionComponent } from './components/buttons/btn-confirm-action/btn-confirm-action.component';
import { TableDinamicGridComponent } from './components/tables/table-dinamic-grid/table-dinamic-grid.component';
import { DropdownDefaultComponent } from './components/inputs/dropdown-default/dropdown-default.component';
import { BtnCancelTransparentComponent } from './components/buttons/btn-cancel-transparent/btn-cancel-transparent.component';
import { TemplateComponent } from './components/template/template.component';
import { SegmentedButtonComponent } from './components/segmented-button/segmented-button.component';
import { InputSearchComponent } from './components/inputs/input-search/input-search.component';
import { PeriodTwoDatesComponent } from './components/inputs/period-two-dates/period-two-dates.component';
import { ModalConfirmationComponent } from './components/modais/modal-confirmation/modal-confirmation.component';
import { TableSortComponent } from './components/tables/table-sort/table-sort.component';
import { OrderByPipe } from './pipes/orderby.pipe';
import { FilterColumnsComponent } from './components/advanced-filter-column/filter-columns/filter-columns.component';
import { FilterDataColumnComponent } from './components/advanced-filter-column/filter-data-column/filter-data-column.component';
import { BreadcrumbComponent } from './components/buttons/stepper/breadcrumb.component';
import { InputTextAreaComponent } from './components/inputs/input-text-area/input-text-area.component';
import { TableSimpleGridComponent } from './components/tables/table-simple-grid/table-simple-grid.component';
import { FilterColumnTypeComponent } from './components/advanced-filter-column/filter-column-type/filter-column-type.component';
import { ModalUploadFilesComponent } from './components/modais/modal-upload-files/modal-upload-files.component';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';
import { FilterDataMoreComponent } from './components/advanced-filter-column/filter-data-more/filter-data-more.component';
import { ModalIncludeNfComponent } from './components/modais/modal-include-nf/modal-include-nf.component';
import { ModalDefineMeasureComponent } from './components/modais/modal-define-measure/modal-define-measure.component';
import { ModalIncludeClientComponent } from './components/modais/modal-include-client/modal-include-client.component';
import { ModalSearchClientComponent } from './components/modais/modal-search-client/modal-search-client.component';
import { ModalSearchResultComponent } from './components/modais/modal-search-result/modal-search-result.component';
import { ModalInvalidFileComponent } from './components/modais/modal-invalid-file/modal-invalid-file.component';
import { ModalHistoricChangesComponent } from './components/modais/modal-historic-changes/modal-historic-changes.component';
import { ModalDetailsChangeComponent } from './components/modais/modal-details-change/modal-details-change.component';
import { ModalChangeSubsidiaryComponent } from './components/modais/modal-change-subsidiary/modal-change-subsidiary.component';
import { ModalInfoComponent } from './components/modais/modal-info/modal-info.component';
import { ModalDetailsStatusComponent } from './components/modais/modal-details-status/modal-details-status.component';
import { TabsComponent } from './components/buttons/tabs/tabs.component';
import { ToggleComponent } from './components/buttons/toggle/toggle.component';
import { CustomInputDecimalComponent } from './components/custom-fields/custom-input-decimal/custom-input-decimal.component';
import { CustomTimeInputComponent } from './components/custom-fields/custom-time-input/custom-time-input.component';
import { CustomDateInputComponent } from './components/custom-fields/custom-date-input/custom-date-input.component';
import { CustomNumericInputComponent } from './components/custom-fields/custom-numeric-input/custom-numeric-input.component';
import { CustomOneLineTextInputComponent } from './components/custom-fields/custom-one-line-text-input/custom-one-line-text-input.component';
import { CustomUniqueDropdownComponent } from './components/custom-fields/custom-unique-dropdown/custom-unique-dropdown.component';
import { CustomTextBoxComponent } from './components/custom-fields/custom-text-box/custom-text-box.component';
import { CustomCheckboxInputComponent } from './components/custom-fields/custom-checkbox-input/custom-checkbox-input.component';
import { TemplateCustomFieldComponent } from './components/template-custom-field/template-custom-field.component';
import { CustomMultipleDropdownComponent } from './components/custom-fields/custom-multiple-dropdown/custom-multiple-dropdown.component';
import { ModalSetSizeComponent } from './components/modais/modal-set-size/modal-set-size.component';
import { ModalPreviewNewDisplayComponent } from './components/modais/modal-preview-new-display/modal-preview-new-display.component';
import { ModalObservationComponent } from './components/modais/modal-observation/modal-observation.component';
import { ModalChangePasswordComponent } from './components/modais/modal-change-password/modal-change-password.component';
import { ModalChangePhotoUserComponent } from './components/modais/modal-change-photo-user/modal-change-photo-user.component';
import { InputDateComponent } from './components/inputs/input-date/input-date.component';
import { InputTimeComponent } from './components/inputs/input-time/input-time.component';
import { EnterKeySubmitDirective } from './directives/enter-key-submit.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { InputM3Component } from './components/modular-groups/input-m3/input-m3.component';
import { SelectComponent } from './components/selects/select/select.component';
import { InputTimeBComponent } from './components/inputs/input-time-b/input-time-b.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { InputPeriodComponent } from './components/inputs/input-period/input-period.component';
import { ModalSendEmailSingleComponent } from './components/modais/modal-send-email-single/modal-send-email-single.component';
import { ModalSendEmailMultipleComponent } from './components/modais/modal-send-email-multiple/modal-send-email-multiple.component';
import { GmDriverComponent } from './components/modular-groups/driver/gm-driver/gm-driver.component';
import { ModalAdvancedSearchDriverComponent } from './components/modular-groups/driver/modal-advanced-search-driver/modal-advanced-search-driver.component';
import { TableAdvancedComponent } from './components/tables/table-advanced/table-advanced.component';
import { ModalActionsDriverComponent } from './components/modular-groups/driver/modal-actions-driver/modal-actions-driver.component';
import { GmSelectionNfComponent } from './components/modular-groups/nota-fiscal/gm-selection-nf/gm-selection-nf.component';
import { TableGridSecondaryComponent } from './components/tables/table-grid-secondary/table-grid-secondary.component';
import { ModalActionsNfComponent } from './components/modular-groups/nota-fiscal/modal-actions-nf/modal-actions-nf.component';
import { ModalUploadNfComponent } from './components/modular-groups/nota-fiscal/modal-upload-nf/modal-upload-nf.component';
import { ModalSearchNfComponent } from './components/modular-groups/nota-fiscal/modal-search-nf/modal-search-nf.component';
import { ModalSelectLayoutReportComponent } from './components/modais/modal-select-layout-report/modal-select-layout-report.component';
import { ModalSelectNfComponent } from './components/modular-groups/nota-fiscal/modal-select-nf/modal-select-nf.component';



@NgModule({
  declarations: [
    InputComponent,
    BtnConfirmActionComponent,
    TableDinamicGridComponent,
    DropdownDefaultComponent,
    BtnCancelTransparentComponent,
    TemplateComponent,
    SegmentedButtonComponent,
    InputSearchComponent,
    PeriodTwoDatesComponent,
    ModalConfirmationComponent,
    TableSortComponent,
    OrderByPipe,
    FilterColumnsComponent,
    FilterDataColumnComponent,
    BreadcrumbComponent,
    InputTextAreaComponent,
    TableSimpleGridComponent,
    FilterColumnTypeComponent,
    ModalUploadFilesComponent,
    DragAndDropDirective,
    FilterDataMoreComponent,
    ModalIncludeNfComponent,
    ModalDefineMeasureComponent,
    ModalIncludeClientComponent,
    ModalSearchClientComponent,
    ModalSearchResultComponent,
    ModalInvalidFileComponent,
    ModalHistoricChangesComponent,
    ModalDetailsChangeComponent,
    ModalChangeSubsidiaryComponent,
    ModalInfoComponent,
    ModalDetailsStatusComponent,
    TabsComponent,
    ToggleComponent,
    CustomInputDecimalComponent,
    CustomTimeInputComponent,
    CustomDateInputComponent,
    CustomNumericInputComponent,
    CustomOneLineTextInputComponent,
    CustomUniqueDropdownComponent,
    CustomTextBoxComponent,
    CustomCheckboxInputComponent,
    TemplateCustomFieldComponent,
    CustomMultipleDropdownComponent,
    ModalSetSizeComponent,
    ModalPreviewNewDisplayComponent,
    ModalObservationComponent,
    ModalChangePasswordComponent,
    ModalChangePhotoUserComponent,
    InputDateComponent,
    InputTimeComponent,
    EnterKeySubmitDirective,
    ClickOutsideDirective,
    InputM3Component,
    SelectComponent,
    InputTimeBComponent,
    SnackbarComponent,
    InputPeriodComponent,
    ModalSendEmailSingleComponent,
    ModalSendEmailMultipleComponent,
    GmDriverComponent,
    ModalAdvancedSearchDriverComponent,
    TableAdvancedComponent,
    ModalActionsDriverComponent,
    GmSelectionNfComponent,
    TableGridSecondaryComponent,
    ModalActionsNfComponent,
    ModalUploadNfComponent,
    ModalSearchNfComponent,
    ModalSelectNfComponent,
    ModalSelectLayoutReportComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule.forChild(),
    FormsModule,
    AngularSlickgridModule.forRoot(),
    NgSelectModule,
    RouterModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxCurrencyDirective,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  exports: [
    InputComponent,
    InputTimeBComponent,
    BtnConfirmActionComponent,
    TableDinamicGridComponent,
    DropdownDefaultComponent,
    BtnCancelTransparentComponent,
    TemplateComponent,
    SegmentedButtonComponent,
    InputSearchComponent,
    PeriodTwoDatesComponent,
    ModalConfirmationComponent,
    TableSortComponent,
    FilterColumnsComponent,
    FilterDataColumnComponent,
    BreadcrumbComponent,
    InputTextAreaComponent,
    TableSimpleGridComponent,
    ModalUploadFilesComponent,
    ModalIncludeNfComponent,
    ModalDefineMeasureComponent,
    ModalHistoricChangesComponent,
    ModalDetailsChangeComponent,
    TabsComponent,
    ToggleComponent,
    CustomInputDecimalComponent,
    CustomTimeInputComponent,
    CustomDateInputComponent,
    CustomNumericInputComponent,
    CustomOneLineTextInputComponent,
    CustomUniqueDropdownComponent,
    CustomTextBoxComponent,
    CustomCheckboxInputComponent,
    TemplateCustomFieldComponent,
    CustomMultipleDropdownComponent,
    ModalSetSizeComponent,
    ModalPreviewNewDisplayComponent,
    InputDateComponent,
    InputTimeComponent,
    EnterKeySubmitDirective,
    InputM3Component,
    SelectComponent,
    SnackbarComponent,
    InputPeriodComponent,
    GmDriverComponent,
    GmSelectionNfComponent,
    ModalSearchNfComponent
  ],
  providers: [
    provideNgxMask(),
    provideEnvironmentNgxCurrency({
      align: "left",
      allowNegative: false,
      allowZero: true,
      decimal: ",",
      precision: 2,
      prefix: "R$ ",
      suffix: "",
      thousands: ".",
      nullable: true,
      min: null,
      max: null,
      inputMode: NgxCurrencyInputMode.Financial,
    }),
    {
      provide: NgSelectConfig,
      useFactory: () => {
        const config = new NgSelectConfig();
        config.typeToSearchText = 'Digite para buscar'
        config.addTagText = 'Adicionar item'
        config.loadingText = 'Buscando...';
        config.notFoundText = 'Nenhum item encontrado';
        config.clearAllText = "Limpar seleção";
        return config;
      },
    }
  ]
})
export class SharedModule { }
