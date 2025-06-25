import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { ApiService } from '../../services/api.service';
import { AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'app-integration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatBadgeModule,
    MatDividerModule,
    MatMenuModule,
    AgGridModule
  ],
  templateUrl: './integration.component.html',
  styleUrl: './integration.component.scss'
})
export class IntegrationComponent {

  isConnected = false;
  connectedDate: string | null = null;
  integrationId: string | null = null;

  constructor(private api: ApiService) {
    this.api.getIntegrationStatus().subscribe((res : { connected: boolean, date?: string, _id?: string, username?:string }) => {
      console.log("res = ",res)
      this.isConnected = res.connected;
      this.connectedDate = res.date ?? null;
      this.integrationId = res._id ?? null;
      this.userInfo.username =  res.username ?? null;
      if (this.isConnected){
        this.searchData(0);
      }

    });
  }
  ngOnInit(){
    if (this.isConnected){
      this.searchData(0);
    }
  }

  connect() {
    this.api.connectToGitHub();
    this.api.sync().subscribe(resp=>{
      console.log("sync done")
    })
  }

  remove() {
    console.log("in - ",this.integrationId)
    if (!this.integrationId) return;

    this.api.removeIntegration(this.integrationId).subscribe(() => {
      this.isConnected = false;
      this.connectedDate = null;
      this.integrationId = null;
    });
  }



  title = 'GitHub Integration Dashboard';

  userInfo:any = {
    username: 'john-doe',
  };

  // Dropdown options
  activeIntegrations = ['GitHub', 'GitLab', 'Bitbucket'];
  selectedIntegration = 'GitHub';

  entities = [
    'organizations',
    'repositories',
    'commits',
    'pull-requests',
    'issues',
    'changelogs',
    'users',
  ];
  selectedEntity = 'repositories';

  // Search and filter
  searchTerm = '';

  // Table data


  onIntegrationChange() {
    // Handle integration change
    // this.filterData();
  }

  onEntityChange() {
    this.searchData(0);
  }



  columnDefs:any = [];

  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  rowData = [];
  paginationPageSize = 10;
  currentPage = 0;
  totalCount = 0;

 searchData(page: number = 0){
    console.log("selectedEntityMain = ",this.selectedEntity)
    this.api.search(this.selectedEntity,this.searchTerm,page,this.paginationPageSize).subscribe(resp=>{
      console.log("resp = ",resp);
      this.rowData = resp['rowData'];
      this.columnDefs = resp['columnDefs'];
      this.totalCount = resp.totalCount;
      this.currentPage = page;
    })
  }

  nextPage() {
    if ((this.currentPage + 1) * this.paginationPageSize < this.totalCount) {
      this.searchData(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.searchData(this.currentPage - 1);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.paginationPageSize);
  }
}
