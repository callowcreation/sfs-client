import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
	selector: 'app-error-panel',
	templateUrl: './error-panel.component.html',
	styleUrls: ['./error-panel.component.scss']
})
export class ErrorPanelComponent implements OnInit {

	hasError: boolean = false;

	constructor(public errorService: ErrorHandlerService) { }

	ngOnInit(): void {
		this.errorService.errorHandler$.subscribe(error => {
			this.hasError = true;
		});
	}
}
