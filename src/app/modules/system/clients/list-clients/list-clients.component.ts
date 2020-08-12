import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html'
})
export class ListClientsComponent implements OnInit {

  constructor(
    private fb: FormBuilder

  ) { }
  
  listOfData= [ {
    key: '1',
    name: 'John Brown',
    gender: 32,
    email : 'testemail@gamil.com',
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Uday',
    gender: 40,
    email : 'testemail@gamil.com',
    address: 'chennai'
  },
  {
    key: '3',
    name: 'Rajesh',
    gender: 40,
    email : 'rajesh@gamil.com',
    address: 'Technospurs chennai'
  },
]
  ngOnInit(): void {
  }

}
