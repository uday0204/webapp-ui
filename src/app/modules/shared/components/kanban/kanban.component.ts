import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkstatusService } from 'src/app/modules/system/configs/workstatus.service';
import { ShowsService } from 'src/app/modules/system/shows/shows.service';
import { AppConstants } from 'src/app/constants/AppConstants';
import { HelperService } from 'src/app/modules/core/services/helper.service';
import { NotificationService } from 'src/app/modules/core/services/notification.service';

declare const jKanban: any;

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KanbanComponent implements OnInit {

  isDataReady: boolean;
  isDataFramed: boolean;
  kanbanChartRef: any;

  task = {
    id: 0,
    name: '',
    endDate: '-',
    typeName: '',
    typeColorCode: '',
    accName: '',
    priority: '',
    workStatus: '',
    statusColorCode: '',
    thumb: ''
  };

  workStatusInfo = {
    id: 0,
    code: '',
    taskObj: []
  };

  kanbanObj = [];
  emptyKanbanObj = [];
  filledKanbanObj = [];

  kanbanData = {
    id: '',
    title: '',
    class: '',
    style: '',
    item: []
  };

  workStatus = {};

  constructor(
    private http: HttpClient,
    private workstatusService: WorkstatusService,
    private showsService: ShowsService,
    private notificationService: NotificationService,
    private helperService: HelperService,
  ) { }

  ngOnInit() {
    this.prepareData();
    //this.getWorkStatus();
  }

  async prepareData() {
    this.isDataReady = false;
    this.isDataFramed = false;
    this.resetAll();
    this.getWorkstatusList();
  }

  async getWorkstatusList() {
    this.workStatus = {};
    const ref = this;
    await this.workstatusService
      .getWorkstatusList()
      .toPromise()
      .then((resp: any) => {
        let responseAny;
        responseAny = resp;
        if (responseAny && responseAny.entity) {
          for (const data of responseAny.entity) {
            if (data.name in ref.workStatus === false) {
              ref.workStatus[data.name] = {};
            }
            ref.workStatusInfo.id = data.id;
            ref.workStatusInfo.code = data.code;
            ref.workStatusInfo.taskObj = [];
            ref.workStatus[data.name] = JSON.parse(JSON.stringify(ref.workStatusInfo));
          }
          this.getArtistTaskList();
        }
        //this.workStatuses = resp.entity;

      })
      .catch((error: any) => {
        //this.workStatuses = [];
      });
  }

  async getArtistTaskList() {
    const ref = this;
    await this.showsService
      .getArtistTaskList()
      .toPromise()
      .then((resp: any) => {
        let responseAny;
        responseAny = resp;
        if (responseAny && responseAny.entity) {
          for (const data of responseAny.entity) {
            ref.task.id = data.id;
            ref.task.name = data.taskName;
            if (this.helperService.transformDate(data.endDate, 'MMM dd, yyyy')) {
              ref.task.endDate = this.helperService.transformDate(data.endDate, 'MMM dd, yyyy');
            } else {
              ref.task.endDate = '<span>           NA</span>';

            }
            ref.task.typeName = data.taskTypeName;
            ref.task.typeColorCode = data.taskColorCode;
            if (data.accountableName) {
              ref.task.accName = data.accountableName;
            } else {
              ref.task.accName = 'NA';
            }

            if (data.priority) {
              ref.task.priority = data.priority;
            } else {
              ref.task.priority = 'NA';
            }

            ref.task.workStatus = data.workStatus;
            ref.task.statusColorCode = data.statusColorCode;
            if (data.userThumbnail) {
              ref.task.thumb = data.userThumbnail;
            } else {
              ref.task.thumb = '';
            }
            ref.workStatus[data.workStatus].taskObj.push(JSON.parse(JSON.stringify(ref.task)));
          }
          this.frameKanbanData();
          this.isDataReady = true;
          setTimeout(() => {
            this.isDataFramed = true;
            this.loadKanbanChart();
          }, 10)
        }
      })
      .catch((error: any) => {
        //this.workStatuses = [];
      });
  }

  /*getWorkStatus() {

    this.workStatus = {};
    const ref = this;
    this.http.get('http://192.168.0.22:4200/assets/workStatus.json').subscribe(
      response => {
        let responseAny;
        responseAny = response;
        if (responseAny && responseAny.entity) {
          for (const data of responseAny.entity) {
            if (data.name in ref.workStatus === false) {
              ref.workStatus[data.name] = {};
            }
            ref.workStatusInfo.id = data.id;
            ref.workStatusInfo.code = data.code;
            ref.workStatusInfo.taskObj = [];
            ref.workStatus[data.name] = JSON.parse(JSON.stringify(ref.workStatusInfo));
          }
        }
        this.getTaskList();
      });
  }*/

  /*getTaskList() {
    const ref = this;
    this.http.get('http://192.168.0.22:4200/assets/taskList.json').subscribe(
      response => {
        let responseAny;
        responseAny = response;
        if (responseAny && responseAny.entity) {
          for (const data of responseAny.entity) {
            ref.task.id = data.id;
            ref.task.name = data.taskName;
            ref.task.endDate = data.endDate;
            ref.task.typeName = data.taskTypeName;
            ref.task.typeColorCode = data.taskColorCode;
            ref.task.accName = data.accountableName;
            ref.task.priority = data.priority;
            ref.task.workStatus = data.workStatus;
            ref.task.statusColorCode = data.statusColorCode;
            ref.task.thumb = data.userThumbnail;
            ref.workStatus[data.workStatus].taskObj.push(JSON.parse(JSON.stringify(ref.task)));
          }
          this.frameKanbanData();
        }
      });
  }*/

  frameKanbanData() {
    const xKeyNames = Object.keys(this.workStatus);
    for (const [k, v] of xKeyNames.entries()) {

      this.kanbanData.id = v + '_' + this.workStatus[v].id;
      this.kanbanData.title = v;
      this.kanbanData.class = 'kanbanTitleCustom';
      this.kanbanData.style = 'border-top-color:' + this.workStatus[v].code;
      while (this.kanbanData.item.length) {
        this.kanbanData.item.pop();
      }

      for (const data of this.workStatus[v].taskObj) {
        if (data) {
          const frData = this.frameItemString(data);
          this.kanbanData.item.push(JSON.parse(JSON.stringify(frData)));
        }
      }
      if (this.workStatus[v].taskObj.length !== 0) {
        this.filledKanbanObj.push(JSON.parse(JSON.stringify(this.kanbanData)));
      } else {
        const itemObj = {
          title: 'No Task',
          style: 'color:white; border-left-color:#464646;'
        };
        // this.kanbanData.item.push(JSON.parse(JSON.stringify(itemObj)));
        this.emptyKanbanObj.push(JSON.parse(JSON.stringify(this.kanbanData)));
      }

    }
    this.kanbanObj = this.filledKanbanObj.concat(this.emptyKanbanObj);
  }

  frameItemString(data) {
    const itemObj = {
      title: '',
      style: 'border-left-color:' + data.typeColorCode,
      id: data.id
    };
    if (!data.thumb) {
      data.thumb = "assets/images/no-image.png";
    }
    const tempStr = '<div><span>' + data.typeName + '</span><span style=\'float: right;color: #ef5350;\'>End Date</span>' +
      '</div><div style=\'padding-bottom: 10px;\'><div style=\'color: ' + data.typeColorCode + ';width: 60%;float: left;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\'>' + data.name + '</div>' +
      '<div style=\'text-align: right;float: right;width: 40%;\'>' + data.endDate + '</div></div><div>Accountable</div>' +
      '<div style=\'padding-bottom: 10px;\'><img src=\'' + data.thumb + '\' class=\'avatar\'>' +
      data.accName + '</div>' + '<div>Priority: <span style=\'color: ' + data.statusColorCode +
      ';font-weight: 600;\'>' + data.priority + '</span></div>';
    itemObj.title = tempStr;
    return itemObj;
  }

  loadKanbanChart() {
    this.kanbanChartRef = new jKanban({
      element: '#demo1',
      gutter: '15px',
      widthBoard: '300px',
      // itemHandleOptions: {
      //   enabled: false,
      //   handleClass: 'item_handle',
      //   customCssHandler: 'drag_handler',
      //   customCssIconHandler: 'drag_handler_icon',
      //   customHandler: '<span class=\'item_handle\'>+</span> %s',
      // },
      addItemButton: false,
      click: (el) => {
        console.log(el);
      },
      dropEl: (el, target, source, sibling) => {
        console.log(source.parentElement.getAttribute('data-id'));
        console.log(target.parentElement.getAttribute('data-id'));
        console.log(el.getAttribute('data-eid'));
        let taskId = el.getAttribute('data-eid');
        let currWorkStatusId = source.parentElement.getAttribute('data-id').split('_')[1];
        let workStatusId = target.parentElement.getAttribute('data-id').split('_')[1];
        if (currWorkStatusId !== workStatusId) {
          let taskIn = {
            type: "workStatusId",
            workStatusId: workStatusId
          }
          this.updateConfirm(taskId, taskIn);
        }
      },
      dragEl: (el, source) => {
        console.log(el + '-' + source);
      },
      dragendEl: (el) => {
        console.log(el);
      },
      boards: this.kanbanObj
    });
  }

  async updateConfirm(taskId: any, taskIn: any) {
    let isEditSuccess = false;
    let errorMessage = "Record update failed.";
    await this.showsService
      .inlineEditTask(taskId, taskIn)
      .toPromise()
      .then((resp: any) => {
        isEditSuccess = true;
      })
      .catch((error: any) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== '') {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        isEditSuccess = false;
      });
    if (isEditSuccess) {
      this.showNotification({
        type: "success",
        title: "Success",
        content: "Record updated successfully.",
        duration: AppConstants.NOTIFICATION_DURATION
      });
    } else {
      this.showNotification({
        type: "error",
        title: "Error",
        content: errorMessage,
        duration: AppConstants.NOTIFICATION_DURATION
      });
    }
    //this.prepareData();
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  resetAll() {
    this.kanbanChartRef = null;
    this.task = {
      id: 0,
      name: '',
      endDate: '',
      typeName: '',
      typeColorCode: '',
      accName: '',
      priority: '',
      workStatus: '',
      statusColorCode: '',
      thumb: ''
    };

    this.workStatusInfo = {
      id: 0,
      code: '',
      taskObj: []
    };

    this.kanbanObj = [];
    this.emptyKanbanObj = [];
    this.filledKanbanObj = [];

    this.kanbanData = {
      id: '',
      title: '',
      class: '',
      style: '',
      item: []
    };

    this.workStatus = {};
  }

}
