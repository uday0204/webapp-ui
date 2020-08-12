import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SharedModule } from "./modules/shared/shared.module";
 import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { NgHttpLoaderModule } from "ng-http-loader";
import {SystemModule} from "./modules/system/system.module";
import {SystemRoutingModule} from "./modules/system/system-routing.module";
import {AccountModule} from "./modules/account/account.module";
import {AccountRoutingModule} from "./modules/account/account-routing.module";

import {ClientsModule} from "./modules/system/clients/clients.module";
import {ClientsRoutingModule} from "./modules/system/clients/clients-routing.module";



registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SystemModule,
    SystemRoutingModule,
    AccountModule,
    AccountRoutingModule,
    ClientsModule,
    ClientsRoutingModule,
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
   
    NgxDatatableModule,  
    AppRoutingModule,
    IconsProviderModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxDatatableModule,
    NgHttpLoaderModule,
    NzTableModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
