import { User } from "src/app/shared/interfaces";

export class ActionStates {
	public show: boolean = true;
	public enabled: boolean = true;
}

export class ShoutoutItem {

	public moveUp: ActionStates = new ActionStates();
	public pinToTop: ActionStates = new ActionStates();
	public isPinned: boolean = false;

	constructor(public user: User, public posted_by: string, private showMoveUp: boolean, private showPinToTop: boolean) {
		this.moveUp.show = showMoveUp;
		this.pinToTop.show = showPinToTop;
		user.description = user.description ? this.truncate(70) : user.description;
	}

	private truncate(length: number) {
		return (this.user.description.length > length) ? this.user.description.substring(0, length - 1) + '...' : this.user.description;
	}
}
