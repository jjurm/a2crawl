import { IonicModule } from '@ionic/angular';
// import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { Routes, RouterModule } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { DirectionPageRoutingModule } from './direction-routing.module';

const routes: Routes = [
  {
    path: '',
    component: Tab2Page
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    // RouterModule.forChild([{ path: '', component: Tab2Page }])
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [Tab2Page],
  providers: [Geolocation]
})
export class Tab2PageModule {}
