import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AproposComponent } from './components/apropos/apropos.component';
import { FichiersComponent } from './components/fichiers/fichiers.component';
import { HomeComponent } from './components/home/home.component';
import { TestComponent } from './components/test/test.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'fichier', component: FichiersComponent },
  { path: 'recherche', component: TestComponent },
  { path: 'apropos', component: AproposComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
