import {DOMAIN, TAGS} from './constants.js';
import {shopifyFetch} from './fetcher.js';
import {
	removeEdgesAndNodes,
	reshapeCollection,
	reshapeCollections,
	reshapeProduct,
	reshapeProducts,
} from './parser.js';
import {
	getCollectionProductsQuery,
	getCollectionQuery,
	getCollectionsQuery,
} from './queries/collection.js';
import {getMenuQuery} from './queries/menu.js';
import {getPageQuery, getPagesQuery} from './queries/page.js';
import {
	getProductQuery,
	getProductRecommendationsQuery,
	getProductsQuery,
} from './queries/product.js';
import type {
	Collection,
	Menu,
	Page,
	Product,
	ShopifyCollectionOperation,
	ShopifyCollectionProductsOperation,
	ShopifyCollectionsOperation,
	ShopifyMenuOperation,
	ShopifyPageOperation,
	ShopifyPagesOperation,
	ShopifyProductOperation,
	ShopifyProductRecommendationsOperation,
	ShopifyProductsOperation,
} from './types.js';

export const getCollection = async (
	handle: string,
): Promise<Collection | undefined> => {
	const res = await shopifyFetch<ShopifyCollectionOperation>({
		query: getCollectionQuery,
		tags: [TAGS.collections],
		variables: {
			handle,
		},
	});

	return reshapeCollection(res.body.data.collection);
};

export const getCollectionProducts = async ({
	collection,
	reverse,
	sortKey,
}: {
	collection: string;
	reverse?: boolean;
	sortKey?: string;
}): Promise<Product[]> => {
	const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
		query: getCollectionProductsQuery,
		tags: [TAGS.collections, TAGS.products],
		variables: {
			handle: collection,
			reverse,
			sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey,
		},
	});

	if (!res.body.data.collection) {
		console.warn(`No collection found for \`${collection}\``);

		return [];
	}

	return reshapeProducts(
		removeEdgesAndNodes(res.body.data.collection.products),
	);
};

export const getCollections = async (): Promise<Collection[]> => {
	const res = await shopifyFetch<ShopifyCollectionsOperation>({
		query: getCollectionsQuery,
		tags: [TAGS.collections],
	});
	const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
	const collections = [
		{
			description: 'All products',
			handle: '',
			path: '/search',
			seo: {
				description: 'All products',
				title: 'All',
			},
			title: 'All',
			updatedAt: new Date().toISOString(),
		},
		/* Filter out the `hidden` collections.
       Collections that start with `hidden-*` need to be hidden on the search page. */
		...reshapeCollections(shopifyCollections).filter(
			collection => !collection.handle.startsWith('hidden'),
		),
	];

	return collections;
};

export const getMenu = async (handle: string): Promise<Menu[]> => {
	const res = await shopifyFetch<ShopifyMenuOperation>({
		query: getMenuQuery,
		tags: [TAGS.collections],
		variables: {
			handle,
		},
	});

	return (
		res.body?.data?.menu?.items.map((item: {title: string; url: string}) => ({
			path: item.url
				.replace(DOMAIN, '')
				.replace('/collections', '/search')
				.replace('/pages', ''),
			title: item.title,
		})) || []
	);
};

export const getPage = async (handle: string): Promise<Page> => {
	const res = await shopifyFetch<ShopifyPageOperation>({
		query: getPageQuery,
		variables: {handle},
	});

	return res.body.data.pageByHandle;
};

export const getPages = async (): Promise<Page[]> => {
	const res = await shopifyFetch<ShopifyPagesOperation>({
		query: getPagesQuery,
	});

	return removeEdgesAndNodes(res.body.data.pages);
};

export const getProduct = async (
	handle: string,
): Promise<Product | undefined> => {
	const res = await shopifyFetch<ShopifyProductOperation>({
		query: getProductQuery,
		tags: [TAGS.products],
		variables: {
			handle,
		},
	});

	return reshapeProduct(res.body.data.product, false);
};

export const getProductRecommendations = async (
	productId: string,
): Promise<Product[]> => {
	const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
		query: getProductRecommendationsQuery,
		tags: [TAGS.products],
		variables: {
			productId,
		},
	});

	return reshapeProducts(res.body.data.productRecommendations);
};

export const getProducts = async ({
	query,
	reverse,
	sortKey,
}: {
	query?: string;
	reverse?: boolean;
	sortKey?: string;
}): Promise<Product[]> => {
	const res = await shopifyFetch<ShopifyProductsOperation>({
		query: getProductsQuery,
		tags: [TAGS.products],
		variables: {
			query,
			reverse,
			sortKey,
		},
	});

	return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
};

export {
	addToCart,
	createCart,
	getCart,
	removeFromCart,
	updateCart,
} from './cart.js';
