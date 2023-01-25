import { Injectable, ErrorHandler } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

    private errorHandlerSource = new Subject<string>();
	public errorHandler$ = this.errorHandlerSource.asObservable();

	constructor() { }

	handleError(err: any): void {
		this.errorHandlerSource.next(err.message);
		console.error(' +++++++++++++++++ HANDLED ????????????????? ', err);
	}

}
