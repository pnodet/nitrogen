import {ensureStartsWith} from './utils.js';

export type SortFilterItem = {
	title: string;
	slug: string | null;
	sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE';
	reverse: boolean;
};

export const defaultSort: SortFilterItem = {
	reverse: false,
	slug: null,
	sortKey: 'RELEVANCE',
	title: 'Relevance',
};

export const sorting: SortFilterItem[] = [
	defaultSort,
	{
		reverse: false,
		slug: 'trending-desc',
		sortKey: 'BEST_SELLING',
		title: 'Trending',
	}, // asc
	{
		reverse: true,
		slug: 'latest-desc',
		sortKey: 'CREATED_AT',
		title: 'Latest arrivals',
	},
	{
		reverse: false,
		slug: 'price-asc',
		sortKey: 'PRICE',
		title: 'Price: Low to high',
	}, // asc
	{
		reverse: true,
		slug: 'price-desc',
		sortKey: 'PRICE',
		title: 'Price: High to low',
	},
];

export const TAGS = {
	cart: 'cart',
	collections: 'collections',
	products: 'products',
};

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';
export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2023-01/graphql.json';

// eslint-disable-next-line no-process-env
export const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
	? // eslint-disable-next-line no-process-env
	  ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
	: '';
