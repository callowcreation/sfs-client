import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class UncaughtErrorHandlerService implements ErrorHandler {

    constructor(private snackBar: MatSnackBar, private zone: NgZone) { }

    handleError(error: any): void {
        this.zone.run(() => {
            /*this.snackBar.open(
                `We noticed something went wrong and will be looking into it.`,
                'Close',
                {
                    duration: 2000
                }
            );*/
            console.warn(`Caught with custom handler: `, error);
        });
    }

}