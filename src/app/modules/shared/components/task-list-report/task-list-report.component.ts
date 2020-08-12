import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Page } from "../../model/page";
import { DaybookService } from "src/app/modules/system/dashboards/daybook.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ShowsService } from "src/app/modules/system/shows/shows.service";
import { NzDrawerService } from "ng-zorro-antd";
import { AppConstants } from "src/app/constants/AppConstants";
import { TaskFilterSettingsComponent } from "src/app/modules/system/modals/task-filter-settings/task-filter-settings.component";
import { Role } from '../../model/role';
import { NoteFormComponent } from 'src/app/modules/system/modals/note-form/note-form.component';

@Component({
  selector: "app-task-list-report",
  templateUrl: "./task-list-report.component.html",
  styleUrls: ["./task-list-report.component.scss"]
})
export class TaskListReportComponent implements OnInit {
  @ViewChild("myTable", { static: false }) table: any;
  @ViewChild("myGroupHeader", { static: false }) groupHeader: any;
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;

  isRowGroupEnabled: boolean = true;
  showDummy: boolean;
  childDrawerRef: any;
  isEmptyData: boolean;
  isDataReady: boolean;
  isLoading: boolean = true;
  rows: any;
  //showId: any;
  page = new Page();
  selectedPageSize: any;
  tableColumns: any;
  selectedTableColumns: any;
  intervalId: any;
  pageSizeOptions: any;
  drawerTitle: any;
  currPageInfo: any;
  isSearching: boolean;
  searchPattern = "";
  taskFilters: any;
  sortBy: any = "";
  orderBy: any = "";
  shows: any;
  types: any;
  type: any = "shot";
  groupBy: any;
  role: any;
  isArtist: any;
  date: any = new Date();


  constructor(
    private daybookService: DaybookService,
    private helperService: HelperService,
    private showsService: ShowsService,
    private drawerService: NzDrawerService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.selectedPageSize = this.page.size; //.toString();
  }

  ngOnInit() {
    this.role = this.helperService.getRole();
    this.isArtist = this.checkArtist();
    this.prepareData();
  }

  /*showChangeHandler(e) {
    this.showId = e;
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }*/

  radioChangeHandler(e) {
    this.type = e;
    this.currPageInfo.offset = 0;
    this.taskFilters.showId = null;
    this.taskFilters.shotIds = [];
    this.taskFilters.assetIds = [];
    this.setGroupByValue();
    this.setPage(this.currPageInfo);
  }

  disabledDate = (startValue: Date): boolean => {
    if (!startValue) {
      return false;
    }
    let today = new Date();
    let last10 = new Date(today.setDate(today.getDate() - 8));
    return startValue.getTime() < last10.getTime();
  };

  onDateChange(e) {
    console.log(e);
    this.date = e;
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  typeChangeHandler(e) {
  }

  filterHandler() {
    this.drawerTitle = "Filter Settings";
    this.openFilterSettingsForm();
  }

  getTableColumns() {
    this.tableColumns = [
      {
        name: "showName",
        displayName: "Show Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false
      },
      {
        name: "taskName",
        displayName: "Task Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false
      },
      {
        name: "taskTypeName",
        displayName: "Task Type",
        defaultDisplay: true,
        sortable: true,
        isEditable: true
      },
      {
        name: "workStatus",
        displayName: "Status",
        defaultDisplay: true,
        sortable: true,
        isEditable: true
      },
      {
        name: "accountableName",
        displayName: "Accountable",
        defaultDisplay: true,
        sortable: true,
        isEditable: true
      },
      {
        name: "artistName",
        displayName: "Artist",
        defaultDisplay: this.isArtist ? false : true,
        sortable: true,
        isEditable: true
      },
      {
        name: "clientName",
        displayName: "Client",
        defaultDisplay: this.isArtist ? false : true,
        sortable: true,
        isEditable: true
      },
      {
        name: "priority",
        displayName: "Priority",
        defaultDisplay: true,
        sortable: true,
        isEditable: true
      },
      {
        name: "completionPercentage",
        displayName: "Completion Percentage",
        defaultDisplay: true,
        sortable: false,
        isEditable: true
      },
      {
        name: "startDate",
        displayName: "Start Date",
        defaultDisplay: true,
        sortable: true,
        isEditable: true
      },
      {
        name: "endDate",
        displayName: "End Date",
        defaultDisplay: (this.isArtist) ? true : false,
        sortable: true,
        isEditable: true
      }
    ];
    this.frameSelectedColumns();
    this.isDataReady = true;
  }

  frameSelectedColumns() {
    this.selectedTableColumns = this.tableColumns.filter((item, index) => {
      item["index"] = index;
      return item.defaultDisplay;
    });
  }

  searchHandler() {
    this.isSearching = true;
  }

  searchDetails() {
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  searchBlur() {
    if (this.searchPattern == "") {
      this.isSearching = false;
    }
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
  }

  setGroupByValue() {
    this.groupBy = this.type === "shot" ? "shotCode" : "assetName";
  }

  getGroupName(group) {
    return group.value[0][this.groupBy];
  }

  setPageSize() {
    let pageInfo = {
      pageSize: this.selectedPageSize,
      offset: 0
    };
    this.setPage(pageInfo);
  }

  setPage(pageInfo: any) {
    this.currPageInfo = pageInfo;
    this.isLoading = true;
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;
    this.page.search = this.searchPattern;
    this.page.sortBy = this.sortBy;
    this.page.orderBy = this.orderBy;
    this.showDummy = true;
    let params = "";
    let serviceName = "";

    //params = `search=${this.page.search}&pageNo=${this.page.pageNumber}&pageSize=${this.page.size}&sortBy=${this.page.sortBy}&orderBy=${this.page.orderBy}&date=${dateStr}`;
    params = `search=${this.page.search}&pageNo=${this.page.pageNumber}&pageSize=${this.page.size}&sortBy=${this.page.sortBy}&orderBy=${this.page.orderBy}`;
    if (!this.isArtist) {
      let date = new Date();
      let dateStr = '';
      if (this.date) {
        date = this.date;
      }
      dateStr = this.helperService.transformDate(date, 'yyyy-MM-dd');
      params += `&date=${dateStr}`;
    }
    let filterParams = this.getFilterParams();
    if (filterParams !== "") {
      params += `&${filterParams}`;
    }

    if (this.isArtist) {
      serviceName = "getMyTaskShotView";
      if (this.type === "asset") {
        serviceName = "getMyTaskAssetView";
      }
      //if (this.showId) {
      this.showsService[serviceName](null, params).subscribe(
        resp => {
          this.onDataReceived(resp);
        },
        error => {
          this.isLoading = false;
          this.onDataError(error);
        }
      );
      /*} else {
        this.rows = [];
      }*/

    } else {
      //params += `&showId=${this.showId}`;
      serviceName = "getShotViewReport";
      if (this.type === "asset") {
        serviceName = "getAssetViewReport";
      }
      this.daybookService[serviceName](params).subscribe(
        resp => {
          this.onDataReceived(resp);
          /*if (resp && resp.valid) {
            this.page.totalElements = resp.total;
            this.page.totalPages = Math.ceil(resp.total / this.page.size);
            this.rows = resp.coll;
            setTimeout(() => {
              try {
                let parentHeight = this.table.bodyComponent.scroller.parentElement.getBoundingClientRect()
                  .height;
                let childHeight = this.table.bodyComponent.scroller.element.getBoundingClientRect()
                  .height;
                if (childHeight > parentHeight) {
                  this.showDummy = false;
                } else {
                  this.showDummy = true;
                }
              } catch (e) { }
            }, 500);
          } else {
            this.onDataError(resp);
          }
          this.isLoading = false;*/
        },
        error => {
          this.isLoading = false;
          this.onDataError(error);
        }
      );
    }
  }

  onDataReceived(resp: any) {
    if (resp && resp.valid) {
      this.page.totalElements = resp.total;
      this.page.totalPages = Math.ceil(resp.total / this.page.size);
      this.rows = resp.coll;
      setTimeout(() => {
        this.isLoading = false;
        this.table.recalculate();
        try {
          let parentHeight = this.table.bodyComponent.scroller.parentElement.getBoundingClientRect()
            .height;
          let childHeight = this.table.bodyComponent.scroller.element.getBoundingClientRect()
            .height;
          if (childHeight > parentHeight) {
            this.showDummy = false;
          } else {
            this.showDummy = true;
          }
        } catch (e) { }
      }, 500);
    } else {
      this.onDataError(resp);
    }
    //this.isLoading = false;
  }

  onDataError(error: any) {
    this.isLoading = false;
    this.isEmptyData = true;
  }

  openFilterSettingsForm(): void {
    this.childDrawerRef = this.drawerService.create<
      TaskFilterSettingsComponent,
      {
        type: any;
        filters: any;
        //showId: any;
        isArtist: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: TaskFilterSettingsComponent,
      nzContentParams: {
        type: this.type,
        filters: this.taskFilters,
        //showId: this.showId,
        isArtist: this.isArtist
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper"
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
    });

    this.childDrawerRef.afterClose.subscribe(data => {
      if (data) {
        if (JSON.stringify(this.taskFilters) !== JSON.stringify(data)) {
          this.taskFilters = data;
          this.currPageInfo.offset = 0;
          this.setPage(this.currPageInfo);
        } else {
        }
      }
    });
  }

  getFilterParams() {
    let filterParams = "";
    /*if (this.shotFilters.seasonIds && this.shotFilters.seasonIds.length > 0) {
      if (filterParams != "") {
        filterParams += '&';
      }
      filterParams += `seasonId=${this.shotFilters.seasonIds[0]}`;
    }
    if (this.shotFilters.seasonIds && this.shotFilters.seasonIds.length > 0) {
      if (filterParams != "") {
        filterParams += '&';
      }
      filterParams += `seasonId=${this.shotFilters.seasonIds[0]}`;
    }*/

    for (let i in this.taskFilters) {
      let item = this.taskFilters[i];
      //if (i != "showId") {        
      if (item && item.length > 0) {
        if (filterParams != "") {
          filterParams += "&";
        }
        filterParams += `${i}=${item.toString()}`;
      }
      //} else{

      //}
    }

    if (this.taskFilters.showId) {
      if (filterParams != "") {
        filterParams += "&";
      }
      filterParams += `showId=${this.taskFilters.showId}`;
    }



    return filterParams;
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }

  onSort(event: any) {
    this.sortBy = this.getSortByProp(event);
    if (this.sortBy === "startDate") {
      this.sortBy = "projectedStartDt";
    }
    /*if (this.sortBy === "shotCode") {
      return;
    }


    if (this.sortBy === "client") {
      this.sortBy = "clientName";
    }
    if (this.sortBy === "taskType") {
      this.sortBy = "taskTypeName";
    }
    if (this.sortBy === "status") {
      this.sortBy = "workStatus";
    }


    if (this.sortBy === "startDate") {
      this.sortBy = "projectedStartDt";
    }
    if (this.sortBy === "endDate") {
      this.sortBy = "projectedEndDt";
    }
    if (this.sortBy === "artist") {
      this.sortBy = "artistName";
    }*/
    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  getSortByProp(event: any) {
    let colName = '';
    let prop = '';
    try {
      colName = event.column.name
      prop = this.helperService.findObjectInArrayByKey(this.tableColumns, 'displayName', colName).name;
    } catch (e) {
    }
    return prop;
  }

  getColWidth(colName) {
    // if (colName === "completionPercentage") {
    //   return 200;
    // } else {
    //   return 150;
    // }
    if (
      colName === "artistName" ||
      colName === "accountableName" ||
      colName === "workStatus" ||
      colName === "sequenceName"
    ) {
      return 200;
    } else if (
      colName === "shotName" ||
      colName === "taskName" ||
      colName === "completionPercentage" ||
      colName === "annotationPath" ||
      colName === "referencePath" ||
      colName === "description"
    ) {
      return 250;
    } else if (colName === "thumbnail") {
      return 150;
    } else {
      return 200;
    }
  }

  getTitle(row: any, col: any) {
    return (row[col.name]) ? row[col.name] : '';
    //return row[col.name];
  }

  async prepareData() {
    //await this.getShows();
    this.setFilters();
    this.getTableColumns();
    this.types = [
      {
        name: "Shot View",
        id: "shot"
      },
      {
        name: "Asset View",
        id: "asset"
      }
    ];
    this.setGroupByValue();
    this.isDataReady = true;
  }

  setFilters() {
    this.taskFilters = {
      showId: null,
      shotIds: [],
      assetIds: [],
      accountableIds: [],
      workStatusIds: [],
      taskPriorityIds: [],
      taskTypeIds: []
    };
    if (!this.isArtist) {
      this.taskFilters.artistIds = [];
    }
  }

  /*async getShows() {
    let serviceName = "getShows";
    if (this.isArtist) {
      serviceName = "getShowsByArist";
    }
    await this.showsService[serviceName]()
      .toPromise()
      .then(resp => {
        this.shows = resp.entity;
        if (this.shows && this.shows.length > 0) {
          this.showId = this.shows[0].id;
        }
      })
      .catch(error => {
        this.shows = null;
      });
  }*/

  checkArtist() {
    if (this.role === Role.ARTIST) {
      return true;
    }
    return false;
  }

  getTaskTypeColorCode(row: any) {
    let defaultCode = "#fff";
    return row && row.taskColorCode ? row.taskColorCode : defaultCode;
  }

  getWorkStatusColorCode(row: any) {
    let defaultCode = "#038e4e";
    return row && row.statusColorCode ? row.statusColorCode : defaultCode;
  }

  getProgressConfig(row: any) {
    let defaultCode = "#038e4e";
    let code = row && row.statusColorCode ? row.statusColorCode : defaultCode;
    return {
      showInfo: false,
      type: "line",
      strokeLinecap: "square",
      //strokeWidth: 8,
      strokeColor: code
    };
  }

  noteHandler(row: any) {
    this.drawerTitle = "Task Notes";
    this.openTaskNotes(row.id);
  }

  openTaskNotes(taskId: any): void {
    this.childDrawerRef = this.drawerService.create<
      NoteFormComponent,
      { taskId: any; },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: NoteFormComponent,
      nzContentParams: {
        taskId: taskId
      },
      nzClosable: false,
      nzWidth: "50%",
      nzWrapClassName: "modal-wrapper"
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
    });

    this.childDrawerRef.afterClose.subscribe(isSuccess => {
    });
  }


}
