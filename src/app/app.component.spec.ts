import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { ShoutoutsItemsListComponent } from './components/shoutouts-items-list/shoutouts-items-list.component';
import { WindowRef } from './window-ref';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				AppComponent,
				DashboardComponent,
				MainHeaderComponent,
				ShoutoutsItemsListComponent
			],
			imports: [HttpClientTestingModule],
			providers: [HttpClientModule, WindowRef]
		}).compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});

	it(`should have as title 'sfs-client'`, () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app.title).toEqual('sfs-client');
	});

	/*it('should render title', () => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('.content span').textContent).toContain('sfs-client app is running!');
	});*/
});
