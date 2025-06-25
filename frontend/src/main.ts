import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component.js';
// ⬇️ Register AG Grid Modules
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]); // ✅ Correct for bundled version


bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
