import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Tier } from 'src/app/interfaces/settings';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-bits',
  templateUrl: './bits.component.html',
  styleUrls: ['./bits.component.scss']
})
export class BitsComponent {

    bits: FormGroup = new FormGroup({
        'enable-bits': new FormControl(this.settings.bits$.value['enable-bits'] as boolean),
        'bits-tier': new FormControl(this.settings.bits$.value['bits-tier'] as Tier),
        'pin-days': new FormControl(this.settings.bits$.value['pin-days'] as number),
    });
    
    options: Tier[] = ['Tier 1', 'Tier 2', 'Tier 3'];
    option: Tier = 'Tier 1';
    
    constructor(public settings: SettingsService) {}
}
