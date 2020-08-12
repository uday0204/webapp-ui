import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  isDebug = true;
  constructor() {
    if (window.location.href.indexOf('debug=true') > -1) {
      this.isDebug = true;
    }
  }

  log(msg: any, args?: any) {
    if (this.isDebug) {
      if (args) {
        console.log(msg + args);
      } else {
        console.log(msg);
      }
    }
  }

  error(msg: any, args?: any) {
    if (this.isDebug) {
      if (args) {
        console.error(msg + args);
      } else {
        console.error(msg);
      }
    }
  }

  warn(msg: any, args?: any) {
    if (this.isDebug) {
      if (args) {
        console.warn(msg + args);
      } else {
        console.warn(msg);
      }
    }
  }
}
