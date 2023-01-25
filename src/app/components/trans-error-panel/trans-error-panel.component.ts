import { Component, Input, OnInit } from '@angular/core';
import { TransError } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-trans-error-panel',
  templateUrl: './trans-error-panel.component.html',
  styleUrls: ['./trans-error-panel.component.scss']
})
export class TransErrorPanelComponent implements OnInit {

	@Input() transError: TransError;
  
	@Input() backgroundColor: string;

	@Input() borderColor: string;

	@Input() color: string;
  
  constructor() { }

  ngOnInit() {
  }

}
