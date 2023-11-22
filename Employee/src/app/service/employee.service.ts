import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Employee, postEmployee } from '../models/employee.model';


@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  baseUrl = 'http://localhost:3000/api/v1/employee'
  constructor(private http : HttpClient) { }

  // `http://localhost:3000/api/v1/employee?page=${this.currentPage}&pageSize=${this.pageSize}`

  getEmployees(page : number , limit : number){

    return this.http.get(`http://localhost:3000/api/v1/employee?page=${page}&pageSize=${limit}`);
  }

  postEmployee(employee : postEmployee){
    return this.http.post<Employee>(this.baseUrl, employee)
  }

  deleteEmployee(employeeId: number){
    return this.http.delete(this.baseUrl + '/' + employeeId);

  }

  updateEmployee(employeeId: string , employee : postEmployee){
    return this.http.put(this.baseUrl + '/' + employeeId , employee)
  }

  searchEmployees(searchTerm: any){
   
      return this.http.get(`http://localhost:3000/api/v1/employee/search?query=${searchTerm}`);
  }
}
