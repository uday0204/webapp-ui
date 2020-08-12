import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-task-detail-tab",
  templateUrl: "./task-detail-tab.component.html",
  styleUrls: ["./task-detail-tab.component.scss"]
})
export class TaskDetailTabComponent implements OnInit {
  @Input() showName: any;
  @Input() shotIn: any;
  @Input() assetIn: any;
  @Input() taskIn: any;

  constructor() {}

  ngOnInit() {}
}
