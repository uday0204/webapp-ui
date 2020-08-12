import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy
} from "@angular/core";
import { Router } from "@angular/router";
import { NzDrawerRef, NzDrawerService } from "ng-zorro-antd/drawer";
import { InteractionService } from 'src/app/modules/core/services/interaction.service';
import { HelperService } from 'src/app/modules/core/services/helper.service';
//import { AddNewComponent } from "../modals/add-new/add-new.component";
//import { InteractionService } from "../../core/services/interaction.service";
//import { Subscription } from "rxjs";
//import { HelperService } from "../../core/services/helper.service";

@Component({
  selector: 'app-default-listing',
  templateUrl: './default-listing.component.html',
  styleUrls: ['./default-listing.component.scss']
})
export class DefaultListingComponent implements OnInit {

  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  drawerRef: any;
  listArr: any;
  iconDefaultColor = "white";

  constructor(
    private router: Router,
    private drawerService: NzDrawerService,
    private interactionService: InteractionService,
    private helperService: HelperService
  ) { }

  ngOnInit() {
    this.interactionService.sendInteraction("breadcrumb", "listing");
    this.helperService.isGlobalAddEnabled = true;
    this.generateList();
  }

  generateList() {
    debugger;
  }
  clickHandler(item: any) {

  }

  closeForm() {

  }

}
