import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-panel',
  templateUrl: './progress-panel.component.html',
  styleUrls: ['./progress-panel.component.scss']
})
export class ProgressPanelComponent implements OnInit {

  @Input() progressEntities: any;
  displayNames = {
    "Not Started": "Offline", "On hold": "On Hold", "WIP": "In Progress", "Need Assistance": "Need Assistance", "Completed": "Completed"
  }
  constructor() { }

  ngOnInit() {
  }

  getTitle(item: any) {
    return this.getDisplayName(item.name);
  }
  getValue(item: any) {
    return item.value;
  }
  getPercent(item: any) {
    return Math.round(item.per);
  }
  getTextColor(item: any) {
    return item.code;
  }
  getDisplayName(key: any) {
    return key;
    return this.displayNames[key];
  }

  getProgressConfig(item: any) {
    return {
      showInfo: true,
      type: "circle",
      strokeLinecap: "square",
      strokeWidth: 8,
      strokeColor: item.code
    };
  }


}
