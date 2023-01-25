interface Skus {
	moveUp: string;
	pinToTop: string;
}

export interface TierOptions {
	name: string;
	skus: Skus;
}

const bitsTierOptions: TierOptions[] = [
	{
		name: 'Tier 1',
		skus: {
			moveUp: 'move-up-t1',
			pinToTop: 'pin-item-t1'
		}
	},
	{
		name: 'Tier 2',
		skus: {
			moveUp: 'move-up-t2',
			pinToTop: 'pin-item-t2'
		}
	},
	{
		name: 'Tier 3',
		skus: {
			moveUp: 'move-up-t3',
			pinToTop: 'pin-item-t3'
		}
	},
];

export default bitsTierOptions;