import { Component, OnInit, Input } from "@angular/core";
import { formatDistance } from "date-fns";
import { UploadFile, UploadXHRArgs, UploadChangeParam } from "ng-zorro-antd";
import { filter } from "rxjs/operators";
import { TasksService } from "src/app/modules/system/shows/tasks.service";
import { ShowsService } from "src/app/modules/system/shows/shows.service";
import { HelperService } from "src/app/modules/core/services/helper.service";

@Component({
  selector: "app-notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.scss"]
})
export class NotesComponent implements OnInit {
  @Input() taskId: any;
  showMoreComments = false;
  showInlineCommentEditor = -1;
  submitting = false;
  comments = [];
  user = {
    userName: "Test",
    thumbnail: "",
    replies: []
  };
  inputValue = "";
  replyInputValue = "";
  visibilityState = [];
  uploading = false;

  customOptions = [
    {
      import: "attributors/style/size",
      whitelist: [
        "10px",
        "12px",
        "16px",
        "18px",
        "20px",
        "24px",
        "28px",
        "32px",
        "46px"
      ]
    }
  ];

  toolbarOptions = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [
        {
          size: [
            "10px",
            "12px",
            "16px",
            "18px",
            "20px",
            "24px",
            "28px",
            "32px",
            "46px"
          ]
        }
      ]
    ]
  };
  isDataReady: boolean;
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: false,
    hidePreviewIconInNonImage: true
  };
  fileList: any = [];
  fileListOuter: any = [];
  previewImage: string | undefined = "";
  previewVisible = false;

  constructor(
    private tasksService: TasksService,
    private showsService: ShowsService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.user.thumbnail = this.helperService.userInfo!.thumbnail;
    this.user.userName = this.helperService.userInfo!.firstName;
    this.prepareData();
  }

  prepareData() {
    //this.isDataReady = false;
    this.fileList = [];
    this.fileListOuter = [];
    this.tasksService
      .getTaskNotesByTask(this.taskId)
      .toPromise()
      .then(resp => {
        if (resp && resp.entity) {
          this.comments = resp.entity;
        }
        this.isDataReady = true;
      })
      .catch(error => {
        this.comments = [];
        this.isDataReady = true;
      });
  }

  handleSubmitAndUpload(node: string, index: number, item: any): void {
    console.log(node);
    console.log(index);
    console.log(item);
    const currIndex = index;
    const comment = node === "parent" ? this.inputValue : this.replyInputValue;
    this.inputValue = this.replyInputValue = "";

    const formData = new FormData();
    // tslint:disable-next-line:no-any
    /*this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });*/

    const tempComment = {
      ...this.user,
      comment: comment,
      createdDate: new Date()
    };
    formData.append("comment", JSON.stringify(tempComment));

    this.submitting = true;
    this.uploading = true;
    /*const req = new HttpRequest('POST', 'http://localhost/corstest/upload.php', formData, {
      reportProgress: true,
      withCredentials: true
    });*/

    this.submitting = false;
    this.inputValue = "";
    this.uploading = false;
    const commentList = {
      ...this.user,
      comment: comment,
      createdDate: tempComment.createdDate,
      attachments: [],
      replies: []
    };
    let attachments = [];
    if (node === "parent") {
      this.comments = [...this.comments, commentList].map(e => {
        return {
          ...e,
          displayTime: formatDistance(new Date(), new Date(e.createdDate))
        };
      });
      this.showMoreComments = this.comments.length > 2 ? true : false;
      if (this.fileListOuter && this.fileListOuter.length > 0) {
        for (let i = 0; i < this.fileListOuter.length; i++) {
          if (
            this.fileListOuter[i] &&
            this.fileListOuter[i].response &&
            this.fileListOuter[i].response.fileDownloadUri
          ) {
            let attachment = new Object();
            attachment["attachment"] = this.fileListOuter[
              i
            ].response.fileDownloadUri;
            attachments.push(attachment);
          }
        }
      }
    } else {
      this.visibilityState[currIndex] = "hide";
      if (!this.comments[currIndex].replies) {
        this.comments[currIndex].replies = [];
      }
      this.comments[currIndex].replies = [
        ...this.comments[currIndex].replies,
        commentList
      ].map(e => {
        return {
          ...e,
          displayTime: formatDistance(new Date(), new Date(e.createdDate))
        };
      });
      if (this.fileList && this.fileList.length > 0) {
        for (let i = 0; i < this.fileList.length; i++) {
          if (
            this.fileList[i] &&
            this.fileList[i].response &&
            this.fileList[i].response.fileDownloadUri
          ) {
            let attachment = new Object();
            attachment["attachment"] = this.fileList[
              i
            ].response.fileDownloadUri;
            attachments.push(attachment);
          }
        }
      }
    }

    let noteIn = {
      entityTypeId: 6,
      entityId: this.taskId,
      parentNotesId: item ? item.id : null,
      comment: comment,
      attachments: attachments
    };
    this.createNote(noteIn);
  }

  createNote(noteIn: any) {
    this.tasksService
      .createNote(noteIn)
      .toPromise()
      .then(resp => {
        if (resp && resp.entity) {
        }
        this.prepareData();
      })
      .catch(error => {
        this.prepareData();
      });
  }

  showHideComments() {
    this.showMoreComments = !this.showMoreComments;
  }

  showCommentInlineReply(index) {
    this.showInlineCommentEditor = index;
    if (this.visibilityState[index] === "show") {
      this.visibilityState[index] = "hide";
    }
  }

  hideCommentInline(index) {
    this.showInlineCommentEditor = -1;
    this.visibilityState[index] =
      this.visibilityState[index] === "show" ? "hide" : "show";
  }

  getDisplayTime(node: any) {
    return formatDistance(new Date(), new Date(node.createdDate));
  }

  uploadAPI = () => {
    return this.showsService.uploadFileEndPoint();
  };

  uploadMonitor = (e: UploadChangeParam) => {
    console.log(e);
  };

  handlePreview(url) {
    if (url) {
      this.previewImage = url; //file.url || file.thumbUrl;
      this.previewVisible = true;
    }
  }
}
