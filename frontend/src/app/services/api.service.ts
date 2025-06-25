import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getIntegrationStatus() {
    console.log("called")
    return this.http.get<any>('http://localhost:3000/api/github/status', { withCredentials: true });
  }

  connectToGitHub() {
    // Redirect user to the GitHub OAuth URL handled by backend
    window.location.href = 'http://localhost:3000/auth/github';
  }

  removeIntegration(id: string) {
    return this.http.delete(`http://localhost:3000/api/github/integration/${id}`, { withCredentials: true });
  }

  sync(){
    return this.http.get<any>('http://localhost:3000/api/github/sync', { withCredentials: true });
  }

  search(entity: string, q: string,page:number, pageSize:number){
    return this.http.get<any>(`http://localhost:3000/api/github/search?entity=${entity}&q=${q}&page=${page}&pageSize=${pageSize}`, { withCredentials: true });
  }


  // search(entity: string, q: string){
  //   return this.http.get<any>(`http://localhost:3000/api/github/search?entity=${entity}&q=${q}`, { withCredentials: true });
  // }
  
}
