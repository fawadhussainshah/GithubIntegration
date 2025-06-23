import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntegrationComponent } from './features/integration/integration.component';
import { ViewerComponent } from './features/viewer/viewer.component';
import { OauthCallbackComponent } from './features/oauth-callback/oauth-callback.component';

// src/app/app.routes.ts

export const routes: Routes = [
    { path: '', component: IntegrationComponent },
    { path: 'viewer', component: ViewerComponent },
    { path: 'oauth/callback', component: OauthCallbackComponent }
  ];

