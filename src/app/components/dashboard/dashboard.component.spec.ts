import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

import { DashboardComponent } from './dashboard.component';
import { MainHeaderComponent } from '../main-header/main-header.component';
import { ShoutoutsItemsListComponent } from '../shoutouts-items-list/shoutouts-items-list.component';
import { WindowRef } from '../../window-ref';

describe('DashboardComponent', () => {
	let component: DashboardComponent;
	let fixture: ComponentFixture<DashboardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				DashboardComponent,
				MainHeaderComponent,
				ShoutoutsItemsListComponent
			],
			imports: [HttpClientTestingModule],
			providers: [HttpClientModule, WindowRef]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
