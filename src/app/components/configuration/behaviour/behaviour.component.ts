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
        'auto-shoutouts': new FormControl(false),
        'badge-vip': new FormControl(false),
        'commands': new FormControl(['so', 'shoutout'])
    });
    
    constructor(public settings: SettingsService) {
        settings.behaviour$.subscribe(value => {
            SettingsService.SetSelective(value, this.behaviour);
        });
    }
    
    save() {
        this.settings.updateBehaviour(this.behaviour.value);
    }
}
