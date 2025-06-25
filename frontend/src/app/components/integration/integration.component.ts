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

interface GitHubData {
  id: string;
  name: string;
  type: string;
  created_at: string;
  updated_at: string;
  status: string;
  author?: string;
  repository?: string;
  organization?: string;
}

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
      this.userInfo.username =  res.username ?? null

    });
  }

  connect() {
    this.api.connectToGitHub();
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

  // Integration state
  // isConnected = false;
  // connectionDate = new Date('2024-01-15T10:30:00');
  userInfo:any = {
    username: 'john-doe',
    // avatar: '/placeholder.svg?height=40&width=40',
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
  displayedColumns: string[] = [
    'name',
    'type',
    'status',
    'created_at',
    'updated_at',
    'actions',
  ];

  mockData: GitHubData[] = [
    {
      id: '1',
      name: 'awesome-project',
      type: 'repository',
      created_at: '2024-01-10T08:00:00Z',
      updated_at: '2024-01-20T14:30:00Z',
      status: 'active',
      author: 'john-doe',
      organization: 'tech-corp',
    },
    {
      id: '2',
      name: 'feature/user-auth',
      type: 'pull-request',
      created_at: '2024-01-18T09:15:00Z',
      updated_at: '2024-01-19T16:45:00Z',
      status: 'open',
      author: 'jane-smith',
      repository: 'awesome-project',
    },
    {
      id: '3',
      name: 'Fix login bug',
      type: 'commit',
      created_at: '2024-01-19T11:20:00Z',
      updated_at: '2024-01-19T11:20:00Z',
      status: 'merged',
      author: 'bob-wilson',
      repository: 'awesome-project',
    },
    {
      id: '4',
      name: 'Login page not responsive',
      type: 'issue',
      created_at: '2024-01-17T13:45:00Z',
      updated_at: '2024-01-20T10:15:00Z',
      status: 'closed',
      author: 'alice-brown',
      repository: 'awesome-project',
    },
    {
      id: '5',
      name: 'tech-corp',
      type: 'organization',
      created_at: '2023-06-15T12:00:00Z',
      updated_at: '2024-01-20T09:30:00Z',
      status: 'active',
      author: 'admin',
    },
  ];

  filteredData: GitHubData[] = [...this.mockData];

  // connectToGitHub() {
  //   // Simulate connection
  //   this.isConnected = true;
  //   this.connectionDate = new Date();
  // }

  // disconnectFromGitHub() {
  //   this.isConnected = false;
  // }

  onIntegrationChange() {
    // Handle integration change
    this.filterData();
  }

  onEntityChange() {
    // Handle entity change
    this.filterData();
  }

  onSearch() {
    this.filterData();
  }

  filterData() {
    this.filteredData = this.mockData.filter((item) => {
      const matchesSearch =
        !this.searchTerm ||
        Object.values(item).some((value) =>
          value
            ?.toString()
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        );

      const matchesEntity =
        this.selectedEntity === 'repositories'
          ? item.type === 'repository'
          : this.selectedEntity === 'pull-requests'
          ? item.type === 'pull-request'
          : this.selectedEntity === 'commits'
          ? item.type === 'commit'
          : this.selectedEntity === 'issues'
          ? item.type === 'issue'
          : this.selectedEntity === 'organizations'
          ? item.type === 'organization'
          : true;

      return matchesSearch && matchesEntity;
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'primary';
      case 'open':
        return 'accent';
      case 'closed':
        return 'warn';
      case 'merged':
        return 'primary';
      default:
        return '';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
