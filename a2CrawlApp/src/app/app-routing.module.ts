import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'tab2Page',
    loadChildren: () => import('./tab2/tab2.module').then( m => m.Tab2PageModule)
  },
  {
    path: 'dev-info-modal',
    loadChildren: () => import('./dev-info-modal/dev-info-modal.module').then( m => m.DevInfoModalPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
