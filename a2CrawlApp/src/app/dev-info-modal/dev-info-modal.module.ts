import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevInfoModalPageRoutingModule } from './dev-info-modal-routing.module';

import { DevInfoModalPage } from './dev-info-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevInfoModalPageRoutingModule
  ],
  declarations: [DevInfoModalPage]
})
export class DevInfoModalPageModule {}
