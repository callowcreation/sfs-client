import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SettingsService } from 'src/app/services/settings.service';

export type Tier = 'Tier 1' | 'Tier 2' | 'Tier 3';

@Component({
  selector: 'app-bits',
  templateUrl: './bits.component.html',
  styleUrls: ['./bits.component.scss']
})
export class BitsComponent {

    bits: FormGroup = new FormGroup({
        'enable-bits': new FormControl(false),
        'bits-tier': new FormControl('Tier1'),
        'pin-days': new FormControl(3),
    });
    
    options: Tier[] = ['Tier 1', 'Tier 2', 'Tier 3'];
    option: Tier = 'Tier 1';
    
    constructor(public settings: SettingsService) {
        settings.values$.subscribe(value => {
            //this.bits.setValue(value);
        });
    }
}
