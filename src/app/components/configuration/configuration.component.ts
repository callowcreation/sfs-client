import { Component, Input } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent {

    @Input() showSettings: boolean = false;

    constructor(public settings: SettingsService) {}
}
