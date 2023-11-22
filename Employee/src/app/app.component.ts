import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Employee, postEmployee } from './models/employee.model';
import { EmployeeService } from './service/employee.service';
import axios from 'axios';
import { EmployeeComponent } from './employee/employee.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('addEmployeeButton') addEmployeeButton: any;
  @ViewChild('EmployeeComponent') x!: EmployeeComponent;

  title = 'Employee';

  submitted = false;

  employeeForm: FormGroup;

  employees: Employee[] = [];

  employeesToDisplay: Employee[] = [];

  allEmployees: Employee[] = [];

  getUpdateId: any;

  //for pagination
  // data : Employee[];
  // totalData : number = 0;
  // totalPages : number = 0;
  // itemsPerPage : number = 50;
  // pageNumber : number = 1;
  // startIndex : number = 0;
  // endIndex : number = 0;
  // dataPerPage: Employee[];

  currentPage = 1;
  pageSize = 50;
  totalCount = 0;
  totalPages = 0;

 

  showAdd: boolean = false;
  showUpdate: boolean = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = fb.group({});
    this.employees = [];
    this.employeesToDisplay = [];
   

    // this.data =  this.employees
    // this.dataPerPage = this.employees
    // this.getEmployeeData = this.getEmployeeData;
  }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      //  employeeid: ['',Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile_number: ['', Validators.required],
      experience: ['', Validators.required],
      salary: ['', Validators.required],
    });
    this.getEmployeeData();
    // this.paginatedData();
  }

  ngAfterViewInit(): void {
    // console.log(this.x);
  }

  // emp :any;

  getEmployeeData() {
    // axios.get(`http://localhost:3000/api/v1/employee?page=${this.currentPage}&pageSize=${this.pageSize}`).then((Response: { data: any; }) => {
    this.employeeService
      .getEmployees(this.currentPage, this.pageSize)
      .subscribe((Response: any) => {
        // console.log(Response)
        // console.log("app component")

        this.employees = Response.data;

        this.allEmployees = Response.data;

        this.totalCount = Response.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);

        this.employeesToDisplay = this.employees;
      });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getEmployeeData();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getEmployeeData();
    }
  }

  //Client side Pagination
  // paginatedData(){
  //   axios.get('http://localhost:3000/api/v1/employee').then((Response: { data: any; }) => {

  //     this.data = Response.data;
  //     this.totalData = this.data.length;
  //     // console.log(this.totalData);

  //     this.totalPages = Math.ceil(this.totalData / this.itemsPerPage)
  //     // console.log(this.totalPages);

  //     this.startIndex = ((this.pageNumber-1)*this.itemsPerPage);
  //     this.endIndex = this.pageNumber * this.itemsPerPage;

  //     // console.log(this.data.slice(this.startIndex , this.endIndex));
  //     this.dataPerPage = this.data.slice(this.startIndex , this.endIndex)
  //     // console.log(this.dataPerPage)
  //   })

  // }

  // previousPage(){
  //   if(this.pageNumber > 1){
  //     this.pageNumber--;
  //     this.paginatedData();
  //   }
  // }

  // nextPage(){
  //   if(this.pageNumber < this.totalPages){
  //     this.pageNumber++;
  //     this.paginatedData();
  //   }
  // }

  // getPages(): number[]{
  //   const pageNumbers : number[] = [] ;

  //   for(let i = 1 ; i<=this.totalPages ; i++){
  //     pageNumbers.push(i);
  //   }
  //   return pageNumbers;
  // }

  // page(pg : number){
  //   this.pageNumber = pg;
  //   this.paginatedData();
  // }

  addEmployee() {
    if (this.employeeForm.valid) {
      let employee: postEmployee = {
        // employeeid: this.employeeId.value,
        first_name: this.FirstName.value,
        last_name: this.LastName.value,
        email: this.Email.value,
        mobile_number: this.Mobile.value,
        experience: this.jobExperience.value,
        salary: this.Salary.value,
      };

      this.employeeService.postEmployee(employee).subscribe((res) => {
        this.employees?.unshift(res);
      });

      this.clearForm();
      location.reload();
    } else {
      alert('form is not valid');
      this.clearForm();
    }
  }

  removeEmployee(employeeId: number) {
    // this.employees.forEach((val, index) => {
    //   if (val.employeeid === parseInt(event)) {
    //     this.employeeService.deleteEmployee(event)
    //       // this.employees.splice(index, 1);

    // });

    this.employeeService.deleteEmployee(employeeId).subscribe(
      () => {
        this.employees = this.employees.filter(
          (e: any) => e.employeeid !== employeeId
        );
      },
      (error) => {
        console.error('Error while deleting employee', error);
      }
    );
    location.reload();
  }

  clickAddEmployee() {
    this.clearForm();
    this.showAdd = true;
    this.showUpdate = false;
  }

  editEmployee(employeeId: number) {
    this.showAdd = false;
    this.showUpdate = true;

    this.getUpdateId = employeeId;
    // console.log(this.showAdd, this.showUpdate);

    const employee = this.employees.find(
      (emp: any) => emp.employeeid === employeeId
    );
    if (employee) {
      this.setForm(employee);
    }
  }

  updateEmployee() {
    // console.log("update button clicked")

    if (this.employeeForm.valid) {
      let updateEmployee: postEmployee = {
        first_name: this.FirstName.value,
        last_name: this.LastName.value,
        email: this.Email.value,
        mobile_number: this.Mobile.value,
        experience: this.jobExperience.value,
        salary: this.Salary.value,
      };

      this.employeeService
        .updateEmployee(this.getUpdateId, updateEmployee)
        .subscribe(
          (res) => {
            console.log('employee data is updated', res);
          },
          (error) => {
            console.error('error in updating epmployee', error);
          }
        );
      location.reload();
    } else {
      alert('form is not valid');
      this.clearForm();
    }
  }

  setForm(emp: Employee) {
    this.FirstName.setValue(emp.first_name);
    this.LastName.setValue(emp.last_name);
    this.Email.setValue(emp.email);
    this.Mobile.setValue(emp.mobile_number);
    this.jobExperience.setValue(emp.experience);
    this.Salary.setValue(emp.salary);
  }

  //client side searching

  // searchEmployees(){
  //   const searchTerm = this.searchTerm.value.toLowerCase();
  //   this.employeesToDisplay = this.employees.filter((employee : Employee)=>{
  //     const name = `${employee.first_name} ${employee.last_name}`
  //     return name.toLowerCase().includes(searchTerm);
  //   })
  //   }

  // server side searching

  searchEmployees(searchTerm : any) {
    this.employeeService.searchEmployees(searchTerm).subscribe((data:any)=>{
      this.employeesToDisplay = data.data;
      // console.log(this.employeesToDisplay)
    });
  }

  get myForm() {
    return this.employeeForm.controls;
  }

  clearForm() {
    // this.employeeId.setValue('');
    this.FirstName.setValue('');
    this.LastName.setValue('');
    this.Email.setValue('');
    this.Mobile.setValue('');
    this.jobExperience.setValue('');
    this.Salary.setValue('');
  }

  public get FirstName(): FormControl {
    return this.employeeForm.get('first_name') as FormControl;
  }

  public get LastName(): FormControl {
    return this.employeeForm.get('last_name') as FormControl;
  }
  public get Email(): FormControl {
    return this.employeeForm.get('email') as FormControl;
  }

  public get Mobile(): FormControl {
    return this.employeeForm.get('mobile_number') as FormControl;
  }

  public get jobExperience(): FormControl {
    return this.employeeForm.get('experience') as FormControl;
  }

  public get Salary(): FormControl {
    return this.employeeForm.get('salary') as FormControl;
  }
}
