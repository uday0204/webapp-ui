import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  OnDestroy
} from "@angular/core";
import { Page } from "../../model/page";
import { ShowsService } from "src/app/modules/system/shows/shows.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { PlaylistService } from "src/app/modules/system/playlist/playlist.service";
import { NzDrawerService } from "ng-zorro-antd";
import { DailiesFilterSettingsComponent } from "src/app/modules/system/modals/dailies-filter-settings/dailies-filter-settings.component";

@Component({
  selector: "app-playlist-dailies",
  templateUrl: "./playlist-dailies.component.html",
  styleUrls: ["./playlist-dailies.component.scss"]
})
export class PlaylistDailiesComponent implements OnInit {
  @ViewChild("myTable", { static: false }) table: any;
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  childDrawerRef: any;
  drawerTitle: any;
  playlistFilters: any;

  isReadOnly: boolean;
  showDummy: boolean;
  isEmptyData: boolean;
  isDataReady: boolean;
  isLoading: boolean = true;
  rows: any;
  page = new Page();
  selectedPageSize: any;
  pageSizeOptions: any;
  tableColumns: any;
  selectedTableColumns: any;
  selected = [];
  currPageInfo: any;

  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  tableHeight: any = "calc(100vh - 200px)";

  constructor(
    private showService: ShowsService,
    private playlistService: PlaylistService,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private drawerService: NzDrawerService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.selectedPageSize = this.page.size;
  }

  async ngOnInit() {
    this.isReadOnly = this.helperService.isReadOnly("Task");
    this.getTableColumns();
    this.playlistFilters = {
      showIds: []
    };
  }

  setPageSize() {
    let pageInfo = {
      pageSize: this.selectedPageSize,
      offset: 0
    };
    this.setPage(pageInfo);
  }

  getTableColumns() {
    this.tableColumns = [
      {
        name: "taskName",
        displayName: "Task Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false
      },
      {
        name: "taskType",
        displayName: "Task Type",
        defaultDisplay: true,
        sortable: true,
        isEditable: false
      },
      {
        name: "status",
        displayName: "Status",
        defaultDisplay: true,
        sortable: true,
        isEditable: false
      },
      {
        name: "revisionId",
        displayName: "Version",
        defaultDisplay: true,
        sortable: true,
        isEditable: false
      },
      {
        name: "showName",
        displayName: "Show Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false
      },
      {
        name: "shotName",
        displayName: "Shot Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false
      },
      {
        name: "assetName",
        displayName: "Asset Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false
      },
      {
        name: "assignee",
        displayName: "Assignee",
        defaultDisplay: true,
        sortable: false,
        isEditable: false
      },
      {
        name: "accountable",
        displayName: "Accountable",
        defaultDisplay: true,
        sortable: false,
        isEditable: false
      },
      {
        name: "startDate",
        displayName: "Start Date",
        defaultDisplay: true,
        sortable: false,
        isEditable: false
      },
      {
        name: "endDate",
        displayName: "End Date",
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

  setPage(pageInfo) {
    this.currPageInfo = pageInfo;
    this.isLoading = true;
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;
    this.page.search = this.searchPattern;
    this.page.sortBy = this.sortBy;
    this.page.orderBy = this.orderBy;
    this.showDummy = true;
    let params = `search=${this.page.search}&pageNo=${this.page.pageNumber}&pageSize=${this.page.size}`;
    let filterParams = this.getFilterParams();
    if (filterParams !== "") {
      params += `&${filterParams}`;
    }
    this.playlistService.getDailiesPlaylist(params).subscribe(
      resp => {
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
            } catch (e) {}
          }, 500);
        } else {
          this.isLoading = false;
          this.onDataError(resp);
        }

        this.setTableHeight();
      },
      error => {
        this.isLoading = false;
        this.setTableHeight();
        this.onDataError(error);
      }
    );
  }

  onDataError(error: any) {
    this.isEmptyData = true;
  }

  createVersion() {}

  onSort(event: any) {
    console.log("Sort Event", event);
    this.sortBy = event.sorts[0].prop;
    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  onSelect({ selected }) {
    console.log("Select Event", selected, this.selected);
  }

  editHandler(row: any) {}

  getColWidth(colName: any) {
    return 200;
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  setTableHeight() {
    if (!this.isValidArr(this.rows)) {
      this.tableHeight = 150 + "px";
    } else {
      if (this.rows.length <= 10) {
        this.tableHeight = this.rows.length * 50 + 120 + "px";
      } else {
        this.tableHeight = "calc(100vh - 300px)";
      }
    }
  }

  getTableHeight() {
    return this.tableHeight;
  }

  filterHandler() {
    this.openFilterSettingsForm();
  }

  getFilterParams() {
    let filterParams = "";
    for (let i in this.playlistFilters) {
      let item = this.playlistFilters[i];
      if (item && item.length > 0) {
        if (filterParams != "") {
          filterParams += "&";
        }
        filterParams += `${i}=${item.toString()}`;
      }
    }
    return filterParams;
  }

  openFilterSettingsForm(): void {
    this.drawerTitle = "Filters";
    this.childDrawerRef = this.drawerService.create<
      DailiesFilterSettingsComponent,
      {
        filters: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: DailiesFilterSettingsComponent,
      nzContentParams: {
        filters: this.playlistFilters
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper"
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe(data => {
      if (data) {
        if (JSON.stringify(this.playlistFilters) !== JSON.stringify(data)) {
          this.playlistFilters = data;
          this.currPageInfo.offset = 0;
          this.setPage(this.currPageInfo);
        } else {
        }
      }
    });
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }
}
