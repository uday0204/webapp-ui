import { formatDate } from "@angular/common";
import { Injectable, Inject, LOCALE_ID } from "@angular/core";

import { getMonth, getYear } from "date-fns";
import { Role } from "../../shared/model/role";

@Injectable({
  providedIn: "root"
})
export class HelperService {
  isCollapsed = true;
  isGlobalAddEnabled = false;
  userInfo: any;
  loginInfo: any;
  latestTimeStamp: any;
  defaultAppLogo = "assets/images/logo.png";

  constructor(@Inject(LOCALE_ID) private locale: string) { }

  hasViewPermission(permission: any) {
    if (this.loginInfo && this.loginInfo.permissions) {
      if (this.loginInfo.permissions.hasOwnProperty(permission)) {
        if (
          this.loginInfo.permissions[permission] === "FULL_ACCESS" ||
          this.loginInfo.permissions[permission] === "READ_ONLY"
        ) {
          return true;
        }
      }
    }
    return false;
  }

  isReadOnly(permission: any) {
    if (this.loginInfo && this.loginInfo.permissions) {
      if (this.loginInfo.permissions.hasOwnProperty(permission)) {
        if (this.loginInfo.permissions[permission] === "FULL_ACCESS") {
          return false;
        }
      }
    }
    return true;
  }

  getRole() {
    if (!this.loginInfo) {
      return null;
    }
    if (!this.loginInfo.roles) {
      return null;
    }
    if (!this.loginInfo.roles[0]) {
      return null;
    }

    return this.loginInfo.roles[0];
  }

  getUserId() {
    if (!this.loginInfo) {
      return null;
    }
    if (!this.loginInfo.id) {
      return null;
    }
    return this.loginInfo.id;
  }

  getDayName(date: Date) {
    return date.toLocaleDateString("en", { weekday: "long" });
  }

  _getMonth(date: any) {
    return getMonth(date) + 1;
  }

  _getYear(date: any) {
    return getYear(date);
  }

  getCollapsedFlag() {
    return this.isCollapsed;
  }

  setCollapsedFlag(_isCollapsed) {
    this.isCollapsed = _isCollapsed;
  }

  toggleCollapsedFlag() {
    this.isCollapsed = !this.isCollapsed;
  }

  getInvalidMandatoryStrings(obj: any, keys: string[]) {
    for (let i = 0; i < keys.length; i++) {
      let valueToCheck = obj[keys[i]];
      if (!valueToCheck || valueToCheck.trim() === "") {
        return keys[i];
      }
    }
    return "";
  }

  getInvalidMandatoryNumbers(obj: any, keys: any) {
    for (let i = 0; i < keys.length; i++) {
      let valueToCheck = obj[keys[i]];
      if (!valueToCheck || isNaN(valueToCheck)) {
        return keys[i];
      }
    }
    return "";
  }

  getInvalidMandatoryArrays(obj: any, keys: string[]) {
    for (let i = 0; i < keys.length; i++) {
      let valueToCheck = obj[keys[i]];
      if (!valueToCheck || valueToCheck.length <= 0) {
        return keys[i];
      }
    }
    return "";
  }

  isAnyoneMandatoryArraysFilled(obj: any, keys: string[]) {
    for (let i = 0; i < keys.length; i++) {
      let valueToCheck = obj[keys[i]];
      if (valueToCheck && valueToCheck.length > 0) {
        return true;
      }
    }
    return false;
  }

  convertArrNumToStr(arr: any) {
    return arr && arr.length > 0 ? arr.map(String) : arr;
  }
  convertArrStrToNum(arr: any) {
    return arr && arr.length > 0 ? arr.map(Number) : arr;
  }

  getValueInObject(obj: any, key1: any, value1: any, key2: any) {
    let result = "";
    result = obj.filter(item => {
      if (item[key1] === value1) {
        return item;
      }
    });
    if (result && result.length > 0) {
      return result[0][key2];
    } else {
      return 0;
    }
  }

  getValidPercentage(value: any) {
    return (value ? Math.round(value) : "0 ") + " %";
  }

  transformDate(date: any, format?: any) {
    let _format = "yyyy-MM-dd HH:mm:ss";
    if (format) {
      _format = format;
    }
    try {
      return formatDate(date, _format, this.locale);
    } catch {
      return null;
    }
  }

  findObjectInArrayByKey(arr: any, key: any, val: any) {
    if (arr && arr.length > 0) {
      let matchedObject =
        arr[
        arr
          .map((item: any) => {
            return item[key];
          })
          .indexOf(val)
        ];
      return matchedObject;
    }
    return null;
  }

  isValidArr(arr: any) {
    return arr && arr.length > 0 ? true : false;
  }

  getErrorDetails(error: any) {
    let errorDetails = "";
    try {
      if (error && error.error && error.error.body) {
        if (error.error.body.length > 0) {
          for (let i = 0; i < error.error.body.length; i++) {
            if (error.error.body[i] && error.error.body[i].message) {
              errorDetails += `<li>${error.error.body[i].message}</li>`;
            }
          }
        }
      }
      if (errorDetails !== "") {
        errorDetails = `<ul>${errorDetails}</ul>`;
      }
    } catch (e) { }
    return errorDetails;
  }

  convertFrom24To12Format(time24: any) {
    if (time24 != "") {
      const [sHours, minutes] = time24
        .match(/([0-9]{1,2}):([0-9]{2})/)
        .slice(1);
      const period = +sHours < 12 ? "AM" : "PM";
      const hours = +sHours % 12 || 12;
      return `${hours}:${minutes} ${period}`;
    } else {
      return "";
    }
  }

  isSameObject(obj1: any, obj2: any) {
    let isSame = false;
    if (obj1 && obj2) {
      if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        isSame = true;
      }
    }
    return isSame;
  }

  hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  getLink(type: any) {
    let linkInfo = {
      studio: "/configs/roles",
      role: "/configs/roles",
      user: "/configs/users",
      group: "/configs/groups",
      department: "/configs/departments",
      tasktype: "/configs/tasktypes",
      workstatus: "/configs/workstatus",
      priority: "/configs/priorities",
      client: "/configs/clients",
      template: "/configs/templates",
      show: "/shows",
      mytask: "/tasks",
      playlist: "/playlist",
      timesheet: "/time-sheet",
      timesheetreview: "/time-sheet-review",
      report: "/report",
      daybook: "/daybook",
      favourites: "/favourites"
    };
    return linkInfo[type];
  }
}
