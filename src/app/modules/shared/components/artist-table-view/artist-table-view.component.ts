import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { WorklogService } from 'src/app/modules/system/time-sheet/worklog.service';
import { HelperService } from 'src/app/modules/core/services/helper.service';
import { Page } from '../../model/page';
import { AppConstants } from 'src/app/constants/AppConstants';

@Component({
  selector: 'app-artist-table-view',
  templateUrl: './artist-table-view.component.html',
  styleUrls: ['./artist-table-view.component.scss']
})
export class ArtistTableViewComponent implements OnInit {

  @ViewChild("myTable", { static: false }) table: any;
  @Input("selectedDate") selectedDate: any;

  showDummy: boolean;
  isEmptyData: boolean;
  isDataReady: boolean;
  isLoading: boolean = true;
  rows: any;
  page = new Page();
  selectedPageSize: any;
  tableColumns: any;
  selectedTableColumns: any;
  intervalId: any;
  pageSizeOptions: any;
  currPageInfo: any;
  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  isRowGroupEnabled: boolean = true;

  constructor(
    private worklogService: WorklogService,
    private helperService: HelperService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.selectedPageSize = this.page.size; //.toString();
  }

  ngOnInit() {
    this.prepareData();
  }

  prepareData() {
    this.getTableColumns();
    this.isDataReady = true;
  }

  getTableColumns() {
    this.tableColumns = [
      /*{
        name: "thumbnail",
        displayName: "Thumbnail",
        defaultDisplay: true,
        sortable: false,
        isEditable: false
      },*/
      /*{
        name: "userName",
        displayName: "User",
        defaultDisplay: true,
        sortable: true,
        isEditable: false
      },*/
      {
        name: "taskName",
        displayName: "Task Name",
        defaultDisplay: true,
        sortable: false,
        isEditable: false
      },
      {
        name: "notes",
        displayName: "Notes",
        defaultDisplay: true,
        sortable: false,
        isEditable: false
      },
      {
        name: "hoursWorked",
        displayName: "Hours Worked",
        defaultDisplay: true,
        sortable: true,
        isEditable: false
      },
      {
        name: "completionPercentage",
        displayName: "Completion Percentage",
        defaultDisplay: true,
        sortable: false,
        isEditable: false
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

  setPageSize() {
    let pageInfo = {
      pageSize: this.selectedPageSize,
      offset: 0
    };
    this.setPage(pageInfo);
  }

  updatePage(date: any) {
    this.selectedDate = date;
    this.searchPattern = "";
    this.isSearching = false;
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
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
    let date = this.helperService.transformDate(this.selectedDate, 'yyyy-MM-dd');
    let params = "";
    params = `search=${this.page.search}&pageNo=${this.page.pageNumber}&pageSize=${this.page.size}&sortBy=${this.page.sortBy}&orderBy=${this.page.orderBy}&date=${date}`;
    this.worklogService.getWorklogList(params).subscribe(
      resp => {
        this.onDataReceived(resp);
      },
      error => {
        this.isLoading = false;
        this.onDataError(error);
      }
    );
  }

  onDataReceived(resp: any) {
    if (resp && resp.valid) {
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
    this.isLoading = false;
  }

  onDataError(error: any) {
    this.isEmptyData = true;
  }

  getDate() {
    return this.selectedDate;
  }

  getTitle(row: any, col: any) {
    return (row[col.name]) ? row[col.name] : '';
    //return row[col.name];
  }

  onSort(event) {
    this.sortBy = event.sorts[0].prop;
    /*if (this.sortBy === "startDate") {
      this.sortBy = "projectedStartDt";
    }
    if (this.sortBy === "endDate") {
      this.sortBy = "projectedEndDt";
    }*/
    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  getColWidth(colName) {
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

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
  }

  getGroupName(group) {
    return group.value[0]['userName'];
  }




}
