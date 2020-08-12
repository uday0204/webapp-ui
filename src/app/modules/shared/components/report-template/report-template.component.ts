import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HelperService } from 'src/app/modules/core/services/helper.service';
import { ReportService } from 'src/app/modules/system/report/report.service';
import { AppConstants } from 'src/app/constants/AppConstants';
import { ShowsService } from 'src/app/modules/system/shows/shows.service';
import { ReportFilterSettingsComponent } from 'src/app/modules/system/modals/report-filter-settings/report-filter-settings.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { RolesService } from 'src/app/modules/system/configs/roles.service';
import { UserListFormComponent } from 'src/app/modules/system/modals/user-list-form/user-list-form.component';
import { ReportFormComponent } from 'src/app/modules/system/modals/report-form/report-form.component';

@Component({
  selector: 'app-report-template',
  templateUrl: './report-template.component.html',
  styleUrls: ['./report-template.component.scss']
})
export class ReportTemplateComponent implements OnInit {

  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  childDrawerRef: any;
  drawerTitle: any;

  isShowSelect: boolean;
  shows: any;
  showId: any;


  isArtistSelect: boolean;
  artists: any;
  artistId: any;


  ranges: any;
  dateRangeTypeId: any;

  reportTypes: any;
  reportTypeId: any;

  isCustom: boolean;
  dateRange: any;


  reportOut: any;
  reportData: any;
  chartData: any;
  barChartData: any;
  reportTableData: any;
  tableColumns: any;


  isLoading: any;
  reportFilters: any;
  contentHeight: number;
  graphContainerHeight: number;
  graphContainerWidth: number;
  boxCount = 7;
  boxArrRow1 = [];
  boxArrRow2 = [];
  isReportTemplateVisible: boolean;
  isTemplateListVisible: boolean;

  selectedReportTemplate: any;
  intervalId: any;


  constructor(
    private helperService: HelperService,
    private reportService: ReportService,
    private showsService: ShowsService,
    private rolesService: RolesService,
    private drawerService: NzDrawerService

  ) { }

  ngOnInit() {
    this.prepareData();
    this.showReportTemplate();
  }

  showReportTemplate() {
    this.isReportTemplateVisible = true;
    this.isTemplateListVisible = false;
  }

  showTemplateList() {
    this.selectedReportTemplate = null;
    this.reportTypeId = null;
    this.resetAll();
    this.isReportTemplateVisible = false;
    this.isTemplateListVisible = true;
  }

  onResize() {
    this.getBoxHeight();
  }

  getBoxHeight() {
    if (document.getElementsByClassName("box")[0]) {
      let boxWidth = document.getElementsByClassName("box")[0].clientWidth;
      this.contentHeight = boxWidth;
      setTimeout(() => {
        let boxContainerHeight = document.getElementsByClassName(
          "box-container"
        )[0].clientHeight;
        let graphContainerWidth = document.getElementsByClassName(
          "graph-container"
        )[0].clientWidth;

        this.graphContainerHeight = boxContainerHeight;
        this.graphContainerWidth = graphContainerWidth;
      }, 100);
    }
  }

  prepareData() {
    let count = 0;
    this.boxArrRow1 = [];
    this.boxArrRow2 = [];
    for (let i = 0; i < this.boxCount; i++) {
      this.boxArrRow1.push(count++);
    }
    for (let i = 0; i < this.boxCount; i++) {
      this.boxArrRow2.push(count++);
    }
    this.getReportTypes();
  }

  async getReportTypes() {
    await this.reportService.getReportTypes().toPromise()
      .then((resp: any) => {
        this.reportTypes = resp.entity;
        this.onReportTypesResponse();
      })
      .catch((error: any) => {
        this.reportTypes = [];
      })
  }

  async getDaterange(id: any) {
    await this.reportService.getDaterange(id).toPromise()
      .then((resp: any) => {
        this.ranges = resp.entity;
        this.onDateRangeTypesResponse();
      })
      .catch((error: any) => {
        this.ranges = [];
      })
  }

  async getShows() {
    await this.showsService.getShows()
      .toPromise()
      .then(resp => {
        this.shows = resp.entity;
        this.onShowsResponse();
      })
      .catch(error => {
        this.shows = null;
      });
  }

  async getUsersByRole(roleId: any) {
    await this.rolesService
      .getUsersByRole(roleId)
      .toPromise()
      .then((resp: any) => {
        this.artists = resp.entity;
        this.onArtistsResponse();
      })
      .catch((error: any) => {
        this.artists = [];
      });
  }



  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  rangeChangeHandler(e: any) {
    this.dateRangeTypeId = e;
    this.isCustom = false;
    if (e === AppConstants.REPORT_CUSTOM_RANGE_ID) {
      this.isCustom = true;
    }
  }

  resetAll() {
    this.isShowSelect = false;
    this.isArtistSelect = false;
    this.isCustom = false;
    this.showId = null;
    this.dateRange = null;
    this.dateRangeTypeId = null;
    this.ranges = [];
    this.reportTableData = null;
    this.reportData = null;
    this.chartData = null;
    this.barChartData = null;
  }

  reportTypeChangeHandler(e: any) {
    this.reportTypeId = e;
    this.resetAll();
    /*this.isShowSelect = false;
    this.isArtistSelect = false;
    this.isCustom = false;
    this.showId = null;
    this.dateRange = null;
    this.dateRangeTypeId = null;
    this.ranges = [];
    this.reportTableData = null;
    this.reportData = null;
    this.chartData = null;
    this.barChartData = null;*/
    this.setFilters(e);
    if (e) {
      this.getDaterange(e);
    }
    if (e === AppConstants.PROJECT_REPORT_ID || e === AppConstants.FINANCIAL_REPORT_ID) {
      this.isShowSelect = true;
      this.getShows();
    }

    if (e === AppConstants.INDIVIDUAL_ARTIST_REPORT_ID) {
      this.isArtistSelect = true;
      this.getUsersByRole(AppConstants.ARTIST_ROLE_ID);
    }
  }

  customChangeHandler(e) {
    console.log(e);
  }

  submitHandler() {
    this.isLoading = true;
    let params = this.getParams();
    let filterParams = this.getFilterParams();
    if (filterParams !== '') {
      if (params != '') {
        params += '&';
      }
      params += filterParams;
    }
    if (this.reportTypeId === AppConstants.ARTIST_AVAILABILITY_REPORT_ID) {
      this.reportService.getReportData(this.reportTypeId, this.dateRangeTypeId, params).toPromise()
        .then((resp: any) => {
          this.isLoading = false;
          this.reportTableData = this.frameReportTableData(resp.entity);
        })
        .catch((error: any) => {
          this.isLoading = false;
          this.reportTableData = [];
        })
    } else {
      this.reportService.getReportKPI(this.reportTypeId, params).toPromise()
        .then((resp: any) => {
          this.reportData = this.frameReportData(resp.entity);
          this.chartData = resp.entity.status;
          if (this.reportTypeId === AppConstants.FINANCIAL_REPORT_ID) {
            this.barChartData = {
              actual: resp.entity.actual,
              achieved: resp.entity.achieved,
            }
          }
          this.isLoading = false;
          setTimeout(() => {
            this.getBoxHeight();
          }, 100);
        })
        .catch((error: any) => {
          this.reportData = [];
          this.isLoading = false;
        })
    }

  }

  getParams() {
    let params = "";
    if (this.dateRangeTypeId) {
      params = this.addParam(params, 'dateRangeTypeId', this.dateRangeTypeId);
    }
    if (this.isShowSelect) {
      params = this.addParam(params, 'showIds', this.showId);
    }
    if (this.isArtistSelect) {
      params = this.addParam(params, 'artistId', this.artistId);
    }
    if (this.isCustom) {
      params = this.addParam(params, 'dataStartDate', this.helperService.transformDate(this.dateRange[0], 'yyyy-MM-dd'));
      params = this.addParam(params, 'dataEndDate', this.helperService.transformDate(this.dateRange[1], 'yyyy-MM-dd'));
    }
    return params;
  }

  addParam(params: any, key: any, value: any) {
    if (params != "") {
      params += '&';
    }
    params += `${key}=${value}`;
    return params;
  }

  getFilterParams() {
    let filterParams = "";
    for (let i in this.reportFilters) {
      let item = this.reportFilters[i];
      if (item && item.length > 0) {
        if (filterParams != "") {
          filterParams += "&";
        }
        filterParams += `${i}=${item.toString()}`;
      }
    }
    return filterParams;
  }

  isSubmitEnabled() {
    let enabled = (this.reportTypeId) ? true : false;
    if (this.isValidArr(this.ranges)) {
      enabled = (this.dateRangeTypeId) ? true : false;
    }
    if (enabled && this.isShowSelect) {
      enabled = (this.showId) ? true : false;
    }
    if (enabled && this.isArtistSelect) {
      enabled = (this.artistId) ? true : false;
    }
    if (enabled && this.isCustom) {
      enabled = (this.dateRange) ? true : false;
    }
    return enabled;
  }

  isSaveDisabled() {
    let disabled = true;
    if (this.isValidArr(this.reportData) || this.isValidArr(this.reportTableData)) {
      disabled = false;
    }
    return disabled;
  }

  isFilterDisabled() {
    let disabled = false;
    let advFilterDisabledReportIds = [
      AppConstants.PROJECT_REPORT_ID,
      AppConstants.INDIVIDUAL_ARTIST_REPORT_ID,
      AppConstants.FINANCIAL_REPORT_ID
    ];
    if (!this.reportTypeId) {
      disabled = true;
    }
    if (advFilterDisabledReportIds.includes(this.reportTypeId)) {
      disabled = true;
    }
    return disabled;
  }

  setFilters(reportTypeId: any) {
    this.reportFilters = {};
    let reportIdsWithShowFilter = AppConstants.SHOW_FILTER_REPORT_IDS;
    let reportIdsWithDepartmentFilter = AppConstants.DEPARTMENT_FILTER_REPORT_IDS;
    if (reportIdsWithShowFilter.includes(reportTypeId)) {
      this.reportFilters.showIds = null;
    }
    if (reportIdsWithDepartmentFilter.includes(reportTypeId)) {
      this.reportFilters.departmentIds = null;
    }
  }

  filterHandler() {
    this.openFilterSettingsForm();
  }

  getDate(date: any) {
    return this.helperService.transformDate(date, 'MMM dd, yyyy');
  }

  getAvailableArtists(data: any) {
    //data = 'Test User1,Test User1,Test User1,Test User1,Test User1,Test User1,Test User1,Test User1,Test User1,Test User1,Test User1, ';
    return data.split(',').join(' | ');
  }

  getColWidth(colName: any) {
    if (colName === "availableArtists") {
      return 500;
    }
    return 150;
  }

  frameReportTableData(entity: any) {
    let reportTableData = [];
    if (!entity) {
      return reportTableData;
    }
    if (!entity.data) {
      return reportTableData;
    }
    if (!entity.schema) {
      return reportTableData;
    }
    if (entity.data.length < 1) {
      return reportTableData;
    }
    if (entity.schema.length < 1) {
      return reportTableData;
    }


    this.tableColumns = [
      {
        name: "date",
        displayName: "Date",
        defaultDisplay: true,
        sortable: false,
        isEditable: false
      },
      {
        name: "availableArtistCount",
        displayName: "Available Artists",
        defaultDisplay: true,
        sortable: false,
        isEditable: false
      },
      {
        name: "department",
        displayName: "Department",
        defaultDisplay: true,
        sortable: false,
        isEditable: false
      },
      /*{
        name: "availableArtists",
        displayName: "Available Artists",
        defaultDisplay: true,
        sortable: false,
        isEditable: false
      },*/

    ];

    let row = null;
    for (let i = 0; i < entity.data.length; i++) {
      row = this.getRowInfo(entity.schema, entity.data[i]);
      reportTableData.push(row);
    }
    return reportTableData;

  }

  getRowInfo(schema: any, data: any) {
    let row = new Object();
    let schemaKey = '';
    for (let i = 0; i < schema.length; i++) {
      schemaKey = schema[i].split(' ').join('');
      schemaKey = schemaKey.charAt(0).toLowerCase() + schemaKey.slice(1);
      row[schemaKey] = (data[i]) ? data[i] : '';
    }
    return row;
  }

  frameReportData(entity: any) {
    let reportData = [];
    let info = null;
    for (let i = 0; i < entity.schema.length; i++) {
      info = new Object();
      info.key = entity.schema[i];
      info.value = 0;
      if (entity.data && entity.data[0] && entity.data[0][i]) {
        info.value = entity.data[0][i];
      }
      reportData.push(info);
    }
    return reportData;
  }

  isMoreVisible(row: any) {
    let isVisible = false;
    if (row.availableArtistCount > 1) {
      isVisible = true;
    }
    return isVisible;
  }



  viewHandler(row: any): void {
    let data = row["availableArtists"].split(',');
    this.drawerTitle = "Artist List";
    this.childDrawerRef = this.drawerService.create<
      UserListFormComponent,
      { data: any },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: UserListFormComponent,
      nzContentParams: {
        data: data
      },
      nzClosable: false,
      nzWrapClassName: "modal-wrapper",
      nzWidth: "30%"
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
    });

    this.childDrawerRef.afterClose.subscribe(data => {
    });
  }

  isValidData(index: any) {
    return (index < this.reportData.length);
  }

  getArtistName(artist: any) {
    let name = '';
    if (artist.firstName) {
      name += artist.firstName + ' ';
    }
    if (artist.lastName) {
      name += artist.lastName;
    }
    return name;
  }

  getKey(index: any) {
    return (this.reportData[index] && this.reportData[index].key) ? this.reportData[index].key : '';
  }

  getValue(index: any) {
    return (this.reportData[index] && this.reportData[index].value) ? this.reportData[index].value : 0;
  }

  saveHandler() {
    let mode = "create";
    if (this.selectedReportTemplate) {
      mode = "update";
    }
    this.frameReportIn();
    console.log(this.reportOut);
    this.openSaveReportForm(mode);
  }

  fillFormControls() {
    this.reportOut.reportName = '';
    this.reportOut.reportFrequency = 1;
    this.reportOut.reportDeliveryEndDate = null;
    this.reportOut.distributionEmail = null;
    if (this.selectedReportTemplate) {
      this.reportOut.id = this.selectedReportTemplate.id;
      this.reportOut.reportName = this.selectedReportTemplate.reportName;
      this.reportOut.reportFrequency = this.selectedReportTemplate.reportFrequency;
      this.reportOut.reportDeliveryEndDate = this.selectedReportTemplate.reportDeliveryEndDate;
      this.reportOut.distributionEmail = this.selectedReportTemplate.distributionEmail.split(',');
    }
  }

  frameReportIn() {
    this.reportOut = new Object();
    this.fillFormControls();
    this.reportOut.reportTypeId = this.reportTypeId;
    if (this.dateRangeTypeId) {
      this.reportOut.dateRangeTypeId = this.dateRangeTypeId;
    }
    if (this.isCustom) {
      this.reportOut.dataStartDate = this.helperService.transformDate(this.dateRange[0], 'yyyy-MM-dd');
      this.reportOut.dataEndDate = this.helperService.transformDate(this.dateRange[1], 'yyyy-MM-dd');
    }
    this.reportOut = { ...this.reportOut, reportFilter: { ...this.reportFilters } };
    if (this.isShowSelect) {
      if (this.reportOut.reportFilter) {
        this.reportOut.reportFilter = {};
      }
      this.reportOut.reportFilter.showIds = [this.showId];
    }
    if (this.isArtistSelect) {
      if (this.reportOut.reportFilter) {
        this.reportOut.reportFilter = {};
      }
      this.reportOut.reportFilter.artistId = this.artistId;
    }
  }

  openSaveReportForm(mode: any): void {
    this.drawerTitle = "Save Report";
    this.childDrawerRef = this.drawerService.create<
      ReportFormComponent,
      {
        reportOut: any;
        mode: any
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: ReportFormComponent,
      nzContentParams: {
        reportOut: this.reportOut,
        mode: mode
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper"
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
    });

    this.childDrawerRef.afterClose.subscribe(data => {
      if (data) {
        console.log('openSaveReportForm close ' + data);
      }
    });
  }

  openFilterSettingsForm(): void {
    this.drawerTitle = "Filters";
    this.childDrawerRef = this.drawerService.create<
      ReportFilterSettingsComponent,
      {
        reportTypeId: any;
        filters: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: ReportFilterSettingsComponent,
      nzContentParams: {
        reportTypeId: this.reportTypeId,
        filters: this.reportFilters
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper"
    });

    this.childDrawerRef.afterOpen.subscribe(() => {
    });

    this.childDrawerRef.afterClose.subscribe(data => {
      if (data) {
        if (JSON.stringify(this.reportFilters) !== JSON.stringify(data)) {
          this.reportFilters = data;
        } else {
        }
      }
    });
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }

  getBtnText() {
    return (this.selectedReportTemplate) ? 'Edit Template' : 'Add Template';
  }

  reportSelectHandler(event: any) {
    this.selectedReportTemplate = null;
    this.reportService.getReportTemplate(event.id).toPromise().then((resp: any) => {
      this.selectedReportTemplate = resp.entity;
      this.loadReportTemplate();
    })
      .catch((error: any) => {
        this.selectedReportTemplate = null;
      })
  }

  loadReportTemplate() {
    this.prepareData();
    this.showReportTemplate();
  };

  onReportTypesResponse() {
    if (this.selectedReportTemplate) {
      if (this.selectedReportTemplate.reportTypeId) {
        this.reportTypeChangeHandler(this.selectedReportTemplate.reportTypeId);
      }
      if (this.selectedReportTemplate.reportFilter) {
        this.reportFilters = this.selectedReportTemplate.reportFilter;
      }
      this.intervalId = setInterval(() => {
        this.checkSubmit();
      }, 100);
    }
  }

  checkSubmit() {
    if (this.isSubmitEnabled()) {
      clearInterval(this.intervalId);
      this.submitHandler();
    } else {
    }
  }

  onDateRangeTypesResponse() {
    if (this.selectedReportTemplate) {
      if (this.selectedReportTemplate.dateRangeTypeId) {
        this.rangeChangeHandler(this.selectedReportTemplate.dateRangeTypeId);
        if (this.isCustom) {
          this.dateRange = [];
          if (this.selectedReportTemplate.dataStartDate) {
            this.dateRange[0] = this.selectedReportTemplate.dataStartDate;
          }
          if (this.selectedReportTemplate.dataEndDate) {
            this.dateRange[1] = this.selectedReportTemplate.dataEndDate;
          }
        }
      }
    }
  }

  onShowsResponse() {
    if (this.selectedReportTemplate) {
      if (this.selectedReportTemplate.reportFilter && this.selectedReportTemplate.reportFilter.showIds) {
        this.showId = this.selectedReportTemplate.reportFilter.showIds[0];
      }
    }
  }

  onArtistsResponse() {
    if (this.selectedReportTemplate) {
      if (this.selectedReportTemplate.reportFilter && this.selectedReportTemplate.reportFilter.artistId) {
        this.artistId = this.selectedReportTemplate.reportFilter.artistId;
      }
    }
  }

  isUpdateMode() {
    return this.selectedReportTemplate != null;
  }


}
