export interface GumdropCollection {
	[sharpAddress: string]: number
}

export interface ItemCollection {
	[sharpAddress: string]: string[];
}

export interface ItemData {
	description: string;
	privilege: boolean;
	price: number;
	rarity: number;
}

export interface Item {
	name: string;
	data: ItemData;
}

export interface DailyStoreItem {
	date: string;
	items: Item[];
}

export interface Database {
	echoBlacklist: string[];
	acceptedExceptions: string[];
	gumdropCollections: GumdropCollection;
	itemCollections: ItemCollection;
	dailyStoreItems: DailyStoreItem;
	banlist: string[];
}