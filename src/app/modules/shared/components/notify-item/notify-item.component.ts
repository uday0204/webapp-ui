import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HelperService } from 'src/app/modules/core/services/helper.service';

@Component({
  selector: 'app-notify-item',
  templateUrl: './notify-item.component.html',
  styleUrls: ['./notify-item.component.scss']
})
export class NotifyItemComponent implements OnInit {

  @Input() data: any;
  @Output("mark") markEvent: EventEmitter<any> = new EventEmitter<any>();
  macroMap: any;
  macroArr: any;
  constructor(private helperService: HelperService) { }

  ngOnInit() {
    this.macroArr = ['USER_NAME', 'ENTITY_NAME', 'ASSIGNED_USER_NAME', 'STATUS'];
    this.macroMap = {
      USER_NAME: {
        key: 'userName',
        className: 'n-user'
      },
      ENTITY_NAME: {
        key: 'entityName',
        className: 'n-entity'
      },
      ASSIGNED_USER_NAME: {
        key: 'assignedUserName',
        className: 'n-user'
      },
      STATUS: {
        key: 'statusName',
        className: 'n-user'
      }
    }
  }



  getMsg(data: any) {
    let msg = '';
    try {
      if (data && data.activityLog && data.activityLog.activityLogDetailVo && data.activityLog.activityLogDetailVo.message) {
        msg = data.activityLog.activityLogDetailVo.message;
        msg = this.replaceMacros(data, msg);
      }
    } catch (e) {

    }
    return msg;
  }

  getDate(data: any) {
    let date = '';
    if (data && data.activityLog && data.activityLog.logTime) {
      date = this.helperService.transformDate(data.activityLog.logTime, 'MMM dd, yyyy');
    }
    return date;
    //return data.activityLog.logTime;
  }

  getTime(data: any) {
    let time = '';
    if (data && data.activityLog && data.activityLog.logTime) {
      time = this.helperService.transformDate(data.activityLog.logTime, ' - hh:mm a');
    }
    return time;
    //return data.activityLog.logTime;
  }

  getTimeLong(data: any) {
    let time = '';
    if (data && data.activityLog && data.activityLog.logTime) {
      time = this.helperService.transformDate(data.activityLog.logTime, 'MM/dd/yyyy - hh:mm a');
    }
    return time;
  }

  getMarkLabel(data: any) {
    let label = 'Mark as read';
    if (data && data.isVisited) {
      label = '';
    }
    return label;
  }

  isMarkDisabled(data: any) {
    let disabled = false;
    if (data && data.isVisited) {
      disabled = true;
    }
    return disabled;
  }


  replaceMacros(data: any, _msg: string) {
    let msg = _msg;
    let macroInfo = null;
    let macroKey = null;
    let macroStr = null;
    let replaceMacro = null;
    let macroValue = '';
    for (let i = 0; i < this.macroArr.length; i++) {
      macroKey = this.macroArr[i];
      macroInfo = this.macroMap[this.macroArr[i]];
      macroStr = `<${macroKey}>`;
      replaceMacro = `<span class='${macroInfo.className}'>${macroStr}</span>`;
      if (msg.indexOf(macroStr) > -1) {
        msg = msg.split(macroStr).join(replaceMacro);
        if (data.activityLog.activityLogDetailVo[macroInfo.key]) {
          macroValue = data.activityLog.activityLogDetailVo[macroInfo.key];
        }
        msg = msg.split(macroStr).join(macroValue);
      }
    }
    return msg;
  }

  replaceEntityName(data: any, _msg: string) {
    let msg = _msg;
    let entityMacro = '<ENTITY_NAME>';
    let replaceMacro = `<span class='n-entity'>${entityMacro}</span>`;
    let entityName = '';
    if (data.activityLog.activityLogDetailVo.entityName) {
      entityName = data.activityLog.activityLogDetailVo.entityName;
    }
    if (msg.indexOf(entityMacro) > -1) {
      msg = msg.split(entityMacro).join(replaceMacro);
      msg = msg.split(entityMacro).join(entityName);
    }
    return msg;
  }

  replaceUserName(data: any, _msg: string) {
    let msg = _msg;
    return msg;
  }



  getAvatarInfo(data: any) {
    /*return {
      firstName: data.firstName,
      lastName: data.lastName,
      thumbnail: data.thumbnail
    };
    return {
      firstName: 'F',
      lastName: 'L',
      thumbnail: ''
    };*/




    let firstName = '';
    let lastName = '';
    let thumbnail = '';

    if (data.activityLog.activityLogDetailVo.userName) {
      firstName = data.activityLog.activityLogDetailVo.userName;
      lastName = data.activityLog.activityLogDetailVo.userName;
    }


    if (data.activityLog.activityLogDetailVo.thumbnail) {
      thumbnail = data.activityLog.activityLogDetailVo.thumbnail;
    }



    return {
      firstName: firstName,
      lastName: lastName,
      thumbnail: thumbnail
    };
  }

  onIconClick(data: any) {
    this.markEvent.emit(data.id);
  }
}
