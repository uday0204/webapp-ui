import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {


  this.userForm = this.fb.group({
    userId: [null, [Validators.required]],
    userName: [null, [Validators.required]],
    mobile: [null, [Validators.required]],
    email: [null, [Validators.required]]
  });

}

}
