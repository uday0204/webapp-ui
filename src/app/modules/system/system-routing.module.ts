import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './layout/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductComponent } from './product/product.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  { path: '', component: HomeComponent ,
    children: [ 
      { path: 'dashboard', component:DashboardComponent },
      { path: 'clients', loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule), },
      { path: 'products', component : ProductComponent } ,
      { path: 'user', component : UserComponent } 

    ]
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
