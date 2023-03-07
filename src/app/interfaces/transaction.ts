
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