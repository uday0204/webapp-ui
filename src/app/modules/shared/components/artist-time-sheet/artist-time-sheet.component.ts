import { Component, OnInit, ViewChild } from '@angular/core';
import { WorklogService } from 'src/app/modules/system/time-sheet/worklog.service';
import { HelperService } from 'src/app/modules/core/services/helper.service';
import { TaskLogPanelComponent } from '../task-log-panel/task-log-panel.component';

@Component({
  selector: 'app-artist-time-sheet',
  templateUrl: './artist-time-sheet.component.html',
  styleUrls: ['./artist-time-sheet.component.scss']
})
export class ArtistTimeSheetComponent implements OnInit {

  @ViewChild(TaskLogPanelComponent, { static: false }) taskLogPanelComponent: TaskLogPanelComponent;
  isDataReady: boolean;
  events: any;
  workLogs: any;
  selectedDate: any;
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
      .getTimesheet(month, year, null)
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
    this.taskLogPanelComponent.prepareData(this.selectedDate);
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

  /*setSelectedDate(date: any) {
    this.selectedDate = this.helperService.transformDate(date, 'yyyy-MM-dd');
  }*/

}