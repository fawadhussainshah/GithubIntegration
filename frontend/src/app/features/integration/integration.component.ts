import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
})
export class IntegrationComponent {
  isConnected = false;
  connectedDate: string | null = null;
  integrationId: string | null = null;

  constructor(private api: ApiService) {
    this.api.getIntegrationStatus().subscribe((res : { connected: boolean, date?: string, _id?: string }) => {
      console.log("res = ",res)
      this.isConnected = res.connected;
      this.connectedDate = res.date ?? null;
      this.integrationId = res._id ?? null;

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
}
