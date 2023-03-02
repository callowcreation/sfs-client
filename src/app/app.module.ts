import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { WindowRef } from './window-ref';
import { GuestsListComponent } from './components/guests-list/guests-list.component';

import { UserPipe } from './pipes/user.pipe';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenHeaderInterceptor } from './interceptors/token-header.interceptor';
import { UsersInterceptor } from './interceptors/users.interceptor';

const matModules: (any[] | Type<any> | ModuleWithProviders<{}>) = [
    MatFormFieldModule,
    MatListModule,
    MatSelectModule,
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        GuestsListComponent,
        UserPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        matModules
    ],
    providers: [
        WindowRef,
        { provide: HTTP_INTERCEPTORS, useClass: TokenHeaderInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: UsersInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
