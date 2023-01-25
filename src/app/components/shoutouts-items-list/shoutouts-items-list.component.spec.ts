import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoutoutsItemsListComponent } from './shoutouts-items-list.component';
import { WindowRef } from '../../window-ref';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('ShoutoutsItemsListComponent', () => {
	let component: ShoutoutsItemsListComponent;
	let fixture: ComponentFixture<ShoutoutsItemsListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ShoutoutsItemsListComponent],
			imports: [HttpClientTestingModule],
			providers: [HttpClientModule, WindowRef]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ShoutoutsItemsListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
