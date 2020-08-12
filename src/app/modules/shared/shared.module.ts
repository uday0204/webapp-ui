import { NgModule } from "@angular/core";
import { CommonModule, DecimalPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NumericDirective } from "./directives/numeric.directive";
import { ImagePreloadDirective } from "./directives/image-preload.directive";
import { AvatarComponent } from "./components/avatar/avatar.component";
import { NgZorroAntdModule, NZ_I18N, en_US } from "ng-zorro-antd";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ProgressComponent } from "./components/progress/progress.component";
import { NodataComponent } from "./components/nodata/nodata.component";
 import { ImageComponent } from "./components/image/image.component";
import { UserListByRoleComponent } from "./components/user-list-by-role/user-list-by-role.component";
import { ColorPickerComponent } from "./components/color-picker/color-picker.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { StarPanelComponent } from "./components/star-panel/star-panel.component";
import { ProgressPanelComponent } from "./components/progress-panel/progress-panel.component";
 import { StarDetailsComponent } from "./components/star-details/star-details.component";
 import { NgxEchartsModule } from "ngx-echarts";

import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
 
 

 @NgModule({
  declarations: [
    ProgressComponent,
    AvatarComponent,
    NumericDirective,
    ImagePreloadDirective,
    NodataComponent,
    
    ImageComponent,
    UserListByRoleComponent,
    ColorPickerComponent,
    PageNotFoundComponent,
    StarPanelComponent,
    ProgressPanelComponent,
     StarDetailsComponent
      
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    NgxDatatableModule,
 
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }) 
  ],
  exports: [
    ProgressComponent,
    AvatarComponent,
    NumericDirective,
    ImagePreloadDirective,
    NodataComponent,
    
    ImageComponent,
    UserListByRoleComponent,
    ColorPickerComponent,
    PageNotFoundComponent,
    StarPanelComponent,
    ProgressPanelComponent,
 
    StarDetailsComponent,
 
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, DecimalPipe]
})
export class SharedModule {}
