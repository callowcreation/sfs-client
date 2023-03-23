import { Component, Input } from '@angular/core';

export class Warning extends Error {
    
}

@Component({
    selector: 'app-warning-notice',
    template: `
    <p class="message">{{warning?.message}}</p>
  `,
    styles: [`
    :host { padding: 5px 15px; box-sizing: border-box; display: block; color: red; background-color: #fff700; }
    p { margin: 0 }
    p { font-size: 10px; font-weight: bolder }
  `]
})
export class WarningNoticeComponent {
    @Input() warning: Warning | null = null;
}