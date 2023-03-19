import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-behaviour',
  templateUrl: './behaviour.component.html',
  styleUrls: ['./behaviour.component.scss']
})
export class BehaviourComponent {

    behaviour: FormGroup = new FormGroup({
        'auto-shoutouts': new FormControl(this.settings.behaviour$.value['auto-shoutouts'] as boolean),
        'badge-vip': new FormControl(this.settings.behaviour$.value['badge-vip'] as boolean),
        'commands': new FormControl(this.settings.behaviour$.value['commands'] as string[])
    });
    
    constructor(public settings: SettingsService) {}
}
