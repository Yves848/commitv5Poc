import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { TestComponent } from './components/test/test.component';
import { GlobalMaterialModuleModule } from './global-material-module/global-material-module.module';

@NgModule({
  declarations: [AppComponent, TestComponent, HomeComponent, FichiersComponent, AproposComponent, MenuComponent, ProjetComponent, NewDialogComponent],
  imports: [BrowserModule, AppRoutingModule, NgxElectronModule, BrowserAnimationsModule, GlobalMaterialModuleModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [NewDialogComponent],
})
export class AppModule {}
