import { Component } from '@angular/core';
import { Mode, TwitchLibService } from 'src/app/services/twitch-lib.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent { 	
    
	mode: Mode = 'viewer';
    
    constructor(private twitchLibService: TwitchLibService) { }
    
	ngOnInit(): void {

		const { context$ } = this.twitchLibService;

		context$.subscribe(context => {
			this.mode = context.mode;
		});
	}

}
