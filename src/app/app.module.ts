import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { WindowRef } from './window-ref';

import { LocalStorageService } from './services/local-storage.service';
import { ErrorHandlerService } from './services/error-handler.service';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { ShoutoutsItemsListComponent } from './components/shoutouts-items-list/shoutouts-items-list.component';
import { LoaderPanelComponent } from './components/loader-panel/loader-panel.component';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';
import { ErrorPanelComponent } from './components/error-panel/error-panel.component';
import { ListItemComponent } from './components/list-item/list-item.component';
import { ConfigPanelComponent } from './components/config-panel/config-panel.component';
import { BaseSettingsComponent } from './components/base-settings/base-settings.component';
import { TransErrorPanelComponent } from './components/trans-error-panel/trans-error-panel.component';

@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent,
		MainHeaderComponent,
		ShoutoutsItemsListComponent,
		LoaderPanelComponent,
		SettingsPanelComponent,
		ErrorPanelComponent,
		ListItemComponent,
		ConfigPanelComponent,
		BaseSettingsComponent,
		TransErrorPanelComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule
	],
	providers: [
		WindowRef,
		LocalStorageService,
		{
			provide: ErrorHandler,
			useClass: ErrorHandlerService,
		},
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
