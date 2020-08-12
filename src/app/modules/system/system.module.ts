import { NgModule } from '@angular/core'; 
 import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgZorroAntdModule, NZ_I18N, en_US } from "ng-zorro-antd";
import { SharedModule } from "../shared/shared.module";
import { SystemRoutingModule } from './system-routing.module';
import { HomeComponent } from './layout/home.component';

import { IconsProviderModule } from '../../icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
 import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
 import { NgHttpLoaderModule } from "ng-http-loader";
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductComponent } from './product/product.component';
import { UserComponent } from './user/user.component'; 
registerLocaleData(en);


 

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    ProductComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    SystemRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    SharedModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }]
})

export class SystemModule { }
