import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskLogPanelComponent } from '../task-log-panel/task-log-panel.component';
import { WorklogService } from 'src/app/modules/system/time-sheet/worklog.service';
import { HelperService } from 'src/app/modules/core/services/helper.service';
import { ArtistTableViewComponent } from '../artist-table-view/artist-table-view.component';

@Component({
  selector: 'app-studio-time-sheet',
  templateUrl: './studio-time-sheet.component.html',
  styleUrls: ['./studio-time-sheet.component.scss']
})
export class StudioTimeSheetComponent implements OnInit {

  @ViewChild(TaskLogPanelComponent, { static: false }) taskLogPanelComponent: TaskLogPanelComponent;
  @ViewChild(ArtistTableViewComponent, { static: false }) artistTableViewComponent: ArtistTableViewComponent;
  isDataReady: boolean;
  isTableView: boolean = true;
  events: any;
  workLogs: any;
  selectedDate: any;
  userId: any;
  constructor(
    private worklogService: WorklogService,
    private helperService: HelperService,
  ) { }

  ngOnInit() {
    this.selectedDate = new Date();
    this.prepareData();
  }

  async prepareData() {
    //this.isDataReady = false;
    await this.getTimesheet();
    this.isDataReady = true;
  }

  async getTimesheet() {
    let month = this.helperService._getMonth(this.selectedDate);
    let year = this.helperService._getYear(this.selectedDate);
    await this.worklogService
      .getTimesheet(month, year, this.userId)
      .toPromise()
      .then(resp => {
        this.workLogs = resp.entity;
        this.frameEvents();
      })
      .catch(error => {
        this.events = null;
      });
  }

  onDateChange(e: any) {
    this.selectedDate = e.date;
    if (e.isMonthChange) {
      this.prepareData();
    }
    if (this.isTableView) {
      this.artistTableViewComponent.updatePage(this.selectedDate);
    } else {
      this.taskLogPanelComponent.prepareData(this.selectedDate);
    }
  }

  onUserSelect(e: any) {
    this.isTableView = false;
    this.userId = e.id;
    this.prepareData();
  }

  onUserClose(e: any) {
    this.isTableView = true;
    this.userId = null;
    this.prepareData();
  }

  onUpdateLog(e: any) {
    this.selectedDate = e;
    this.prepareData();
  }

  frameEvents() {
    this.events = [];
    if (this.workLogs && this.workLogs.length > 0) {
      for (let index = 0; index < this.workLogs.length; index++) {
        this.addLogEvent(this.workLogs[index].loggedDate, JSON.stringify(this.workLogs[index]));
      }
    }
  }

  addLogEvent(date: any, details: any): void {
    this.events = [
      ...this.events,
      {
        title: details,
        start: new Date(date),
        end: new Date(date),
        draggable: false,
        resizable: {
          beforeStart: false,
          afterEnd: false
        }
      }
    ];
  }

}
