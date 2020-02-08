import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DirectionPageRoutingModule } from './direction-routing.module';

import { DirectionPage } from './direction.page';

const routes: Routes = [
  {
    path: '',
    component: DirectionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // DirectionPageRoutingModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [DirectionPage]
})
export class DirectionPageModule {}
