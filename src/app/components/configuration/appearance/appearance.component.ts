import { Component, Input, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
    selector: 'app-appearance',
    templateUrl: './appearance.component.html',
    styleUrls: ['./appearance.component.scss']
})
export class AppearanceComponent {

    appearance: FormGroup = new FormGroup({
        color: new FormControl('#FFFFFF' as string),
        'border-color': new FormControl('#FFFFFF' as string),
        'background-color': new FormControl('#000000' as string),
    });

    constructor(public settings: SettingsService) {
        settings.appearance$.subscribe(value => {
            SettingsService.SetSelective(value, this.appearance);
        });
    }

    colorChange(value: string, prop: string) {
        this.appearance.controls[prop].setValue(value);
    }

    save() {
        this.settings.updateApperance(this.appearance.value);
    }

    randomize() {
        this.appearance.patchValue({
            'background-color': this.rndColor(),
            'border-color': this.rndColor(),
            'color': this.rndColor()
        });
    }
    
    rndColor(): string {
        return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase()}`;
    }
}
