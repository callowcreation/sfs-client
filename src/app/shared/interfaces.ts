
export interface Authorized {
	clientId: string;
	token: string;
	channelId: string;
	userId: string;
}

export interface User {
	broadcaster_type: string;
	created_at: string;
	description: string;
	display_name: string;
	email: string;
	id: string;
	login: string;
	offline_image_url: string;
	profile_image_url: string;
	type: string;
	view_count: number;
}

export interface Settings {
	'background-color': string;
	'color': string;
	'border-color': string;
	'auto-shoutouts': boolean;
	'enable-bits': boolean;
	'bits-tier': string;
	'pin-days': number;
}

export interface SettingsResponse {
	settings: Settings;
    error?: string | any; // known string value [Only absolute URLs are supported]
}

export interface PinnedResponse {
	username: string;
	posted_by: string;
	timestamp: number;
}

export interface ActionResponse {
    channelId,// known value - just used to confirm action response from backend
    opaqueUserId// known value - just used to confirm action response from backend
}

export interface PinnedExpired {
	username: string;
	posted_by: string;
}

export interface ShoutoutsResponse {
	shoutouts: string[];
	posted_bys: string[];
	pinned: PinnedResponse;
}

export interface ShoutoutResponse {
	usernames: string[];
	posted_by: string;
	add: boolean;
	max_count: number;
	timestamp: number;
}

export interface TransactionCost {
	amount: string;
	type: string;
}

export interface TransactionProduct {
	cost: TransactionCost;
	displayName: string;
	inDevelopment: boolean | undefined;
	sku: string;
}

export interface TransactionObject {
	displayName: string;
	initiator: string;
	product: TransactionProduct;
	transactionId: string;
	transactionReceipt: string;
	userId: string;
}

export interface TransactionPayload {
	transaction: TransactionObject;
	username: string;
}

export interface TransactionResponse {
	type: string;
	username: string;
	posted_by?: string | null;
	timestamp: number;
	panel_id: string;
}

export interface TransError {
	type: string;
	prompt: string;
	message: string;
}

export interface PubSubMessage {
	environment?: 'dev' | 'prod';
	version: string;
	timestamp: number;
	error?: string;
	settingsResponse?: SettingsResponse;
	shoutoutsResponse?: ShoutoutsResponse;
	shoutoutResponse?: ShoutoutResponse;
	transactionResponse?: TransactionResponse;
	actionResponse?: ActionResponse;
}