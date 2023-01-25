import { Component } from '@angular/core';
import { BaseSettingsComponent } from '../base-settings/base-settings.component';

@Component({
  selector: 'app-config-panel',
  templateUrl: './config-panel.component.html',
  styleUrls: ['./config-panel.component.scss']
})
export class ConfigPanelComponent extends BaseSettingsComponent {

  receiveChange($event: any): void {
    this.changeEvent.emit($event);
  }

}
