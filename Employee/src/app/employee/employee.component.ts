import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Employee } from '../models/employee.model';
import { EmployeeService } from '../service/employee.service';

// import {getEmployeeData} from '../app.component'

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit{
 
  @Input() employee : Employee;
  @Output() onRemoveEmployee : EventEmitter <number> =  new EventEmitter<number>();;
  @Output() onEditEmployee = new EventEmitter<number>();

  formValue: any;


  constructor(private employeeService : EmployeeService){
      this.employee={
      employeeid: 0,
      first_name:'',
      last_name:'',
      email :'',
      mobile_number : '',
      experience: 0,
      salary:0,
    };
    
  }

  ngOnInit(): void {
    // console.log(this.employee)
    // console.log("hello");
    
    // this.getEmployeeData();
  }

  deleteEmployeeClicked(){
    alert("Are you sure you want to delete this employee?")
    this.onRemoveEmployee.emit(this.employee.employeeid);
    
    // console.log(this.employee.employeeid);
  }

  editEmployeeClicked(){
    this.onEditEmployee.emit(this.employee.employeeid);
    console.log("edit button clicked");

  }
}