import {
	addToCartMutation,
	createCartMutation,
	editCartItemsMutation,
	removeFromCartMutation,
} from './mutations/cart.js';
import {reshapeCart} from './parser.js';
import {getCartQuery} from './queries/cart.js';
import {TAGS} from './constants.js';
import {shopifyFetch} from './fetcher.js';
import type {
	Cart,
	ShopifyAddToCartOperation,
	ShopifyCartOperation,
	ShopifyCreateCartOperation,
	ShopifyRemoveFromCartOperation,
	ShopifyUpdateCartOperation,
} from './types.js';

export const createCart = async (): Promise<Cart> => {
	const res = await shopifyFetch<ShopifyCreateCartOperation>({
		cache: 'no-store',
		query: createCartMutation,
	});

	return reshapeCart(res.body.data.cartCreate.cart);
};

export const addToCart = async (
	cartId: string,
	lines: Array<{merchandiseId: string; quantity: number}>,
): Promise<Cart> => {
	const res = await shopifyFetch<ShopifyAddToCartOperation>({
		cache: 'no-store',
		query: addToCartMutation,
		variables: {
			cartId,
			lines,
		},
	});

	return reshapeCart(res.body.data.cartLinesAdd.cart);
};

export const removeFromCart = async (
	cartId: string,
	lineIds: string[],
): Promise<Cart> => {
	const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
		cache: 'no-store',
		query: removeFromCartMutation,
		variables: {
			cartId,
			lineIds,
		},
	});

	return reshapeCart(res.body.data.cartLinesRemove.cart);
};

export const updateCart = async (
	cartId: string,
	lines: Array<{id: string; merchandiseId: string; quantity: number}>,
): Promise<Cart> => {
	const res = await shopifyFetch<ShopifyUpdateCartOperation>({
		cache: 'no-store',
		query: editCartItemsMutation,
		variables: {
			cartId,
			lines,
		},
	});

	return reshapeCart(res.body.data.cartLinesUpdate.cart);
};

export const getCart = async (cartId: string): Promise<Cart | undefined> => {
	const res = await shopifyFetch<ShopifyCartOperation>({
		cache: 'no-store',
		query: getCartQuery,
		tags: [TAGS.cart],
		variables: {cartId},
	});

	// Old carts becomes `null` when you checkout.
	if (!res.body.data.cart) {
		return undefined;
	}

	return reshapeCart(res.body.data.cart);
};
