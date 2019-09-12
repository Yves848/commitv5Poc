import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxElectronModule } from 'ngx-electron';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './components/test/test.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalMaterialModuleModule } from './global-material-module/global-material-module.module';
import { HomeComponent } from './components/home/home.component';
import { FichiersComponent } from './components/fichiers/fichiers.component';
import { AproposComponent } from './components/apropos/apropos.component';

@NgModule({
  declarations: [AppComponent, TestComponent, HomeComponent, FichiersComponent, AproposComponent],
  imports: [BrowserModule, AppRoutingModule, NgxElectronModule, BrowserAnimationsModule, GlobalMaterialModuleModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
