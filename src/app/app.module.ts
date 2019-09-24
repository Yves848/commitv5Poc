import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxElectronModule } from 'ngx-electron';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AproposComponent } from './components/apropos/apropos.component';
import { FichiersComponent } from './components/fichiers/fichiers.component';
import { HomeComponent } from './components/home/home.component';
import { NewDialogComponent } from './components/home/new-dialog/new-dialog.component';
import { MenuComponent } from './components/menu/menu.component';
import { ProjetComponent } from './components/projet/projet.component';
import { InfoMainComponent } from './components/snackbar/info-main/info-main.component';
import { TemplateComponent } from './components/snackbar/infoMain/template/template.component';
import { TestComponent } from './components/test/test.component';
import { GlobalMaterialModuleModule } from './global-material-module/global-material-module.module';
import { ImportComponent } from './components/import/import.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { ImportGroupComponent } from './components/import/import-group/import-group.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    HomeComponent,
    FichiersComponent,
    AproposComponent,
    MenuComponent,
    ProjetComponent,
    NewDialogComponent,
    InfoMainComponent,
    TemplateComponent,
    ImportComponent,
    ConfigurationComponent,
    ImportGroupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxElectronModule,
    BrowserAnimationsModule,
    GlobalMaterialModuleModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [NewDialogComponent, InfoMainComponent],
})
export class AppModule {}
