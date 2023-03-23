import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';

import { WindowRef } from './window-ref';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { GuestListComponent } from './components/guest-list/guest-list.component';
import { ErrorNoticeComponent } from './components/error-notice/error-notice.component';
import { WarningNoticeComponent } from './components/warning-notice/warning-notice.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { AppearanceComponent } from './components/configuration/appearance/appearance.component';

import { UserPipe } from './pipes/user.pipe';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenHeaderInterceptor } from './interceptors/token-header.interceptor';
import { UsersInterceptor } from './interceptors/users.interceptor';
import { TruncatePipe } from './pipes/truncate.pipe';
import { BackendHeaderInterceptor } from './interceptors/backend-header.interceptor';
// import { UncaughtErrorHandlerService } from './services/uncaught-error-handler.service';
import { DynamicUserPipe } from './pipes/dynamic-user.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviourComponent } from './components/configuration/behaviour/behaviour.component';
import { BitsComponent } from './components/configuration/bits/bits.component';


const matModules: (any[] | Type<any> | ModuleWithProviders<{}>) = [
    MatFormFieldModule,
    MatListModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatTabsModule,
    MatCheckboxModule,
    MatSliderModule
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        GuestListComponent,
        UserPipe,
        DynamicUserPipe,
        TruncatePipe,
        ErrorNoticeComponent,
        WarningNoticeComponent,
        ConfirmDialogComponent,
        AppearanceComponent,
        ConfigurationComponent,
        BehaviourComponent,
        BitsComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        matModules,
        BrowserAnimationsModule
    ],
    providers: [
        WindowRef,
        { provide: HTTP_INTERCEPTORS, useClass: BackendHeaderInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: TokenHeaderInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: UsersInterceptor, multi: true },
        // { provide: ErrorHandler, useClass: UncaughtErrorHandlerService },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
