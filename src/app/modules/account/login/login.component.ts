import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from  "../../../modules/core/authentication/authentication.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LoggerService } from "../../../modules/core/services/logger.service";
import { AppConstants } from  "../../../constants/AppConstants";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  @ViewChild("username", { static: true }) username;
  loginForm: FormGroup;
  passwordVisible = false;
  loginErrMsg = AppConstants.LOGIN_ERROR;
  loginFailed = AppConstants.LOGIN_FAILED;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService
  ) { }

  ngOnInit(): void {
    
    //"loginid":"test@ymail.com",
    //"password":"test12"
    //const u = "supervisor@ymail.com";
    //const p = "test12";

    const u = null;
    const p = null;

    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });

    this.loginForm.setValue({
      userName: u,
      password: p
    });
  }

  submitForm(): void {
    this.router.navigate(["/dashboard"]);
    return;
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    if (!this.loginForm.valid) {
      return;
    }
    //const loginParams = `loginId=${this.loginForm.value.userName}&password=${this.loginForm.value.password}`;
    const loginParams = {
      loginId: this.loginForm.value.userName,
      password: this.loginForm.value.password
    }

    this.router.navigate(["/system"]);
    return;
    this.authService.login(loginParams).subscribe(
      response => {
        if (response) {
          this.log("Login Success" + response);
          //this.interactionService.sendInteraction('LOGIN_SUCCESS');
          const retUrl = this.route.snapshot.queryParamMap.get("returnUrl");
          this.router.navigate([retUrl || "/system"]);
          this.resetLoginForm();
        } else {
          //this.interactionService.sendInteraction('LOGIN_ERROR');
          this.resetLoginForm();
          this.loginForm.setErrors({ loginError: true });
        }
      },
      error => {
        //this.interactionService.sendInteraction('LOGIN_ERROR');
        this.resetLoginForm();
        this.loginErrMsg = this.loginFailed;
        this.log("Error " + error);
        this.log("Login Error : " + this.loginErrMsg);
        this.loginForm.setErrors({ loginError: true });
      }
    );
  }

  resetLoginForm() {
    this.username.nativeElement.focus();
    this.loginForm.reset();
  }

  log(s) {
    this.logger.log("<LoginComponent> " + s);
  }
}
