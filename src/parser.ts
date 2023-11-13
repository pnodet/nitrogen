import {HIDDEN_PRODUCT_TAG} from './constants.js';
import type {
	Cart,
	Collection,
	Connection,
	Image,
	ShopifyCart,
	ShopifyCollection,
	ShopifyProduct,
} from './types.js';

export const removeEdgesAndNodes = <T>(array: Connection<T>) => {
	return array.edges.map(edge => edge?.node);
};

export const reshapeCart = (cart_: ShopifyCart): Cart => {
	const cart = {...cart_};

	if (!cart.cost?.totalTaxAmount) {
		cart.cost.totalTaxAmount = {
			amount: '0.0',
			currencyCode: 'USD',
		};
	}

	return {
		...cart,
		lines: removeEdgesAndNodes(cart.lines),
	};
};

export const reshapeCollection = (
	collection: ShopifyCollection,
): Collection | undefined => {
	if (!collection) {
		return undefined;
	}

	return {
		...collection,
	};
};

export const reshapeCollections = (collections: ShopifyCollection[]) => {
	const reshapedCollections = [];

	for (const collection of collections) {
		if (collection) {
			const reshapedCollection = reshapeCollection(collection);

			if (reshapedCollection) {
				reshapedCollections.push(reshapedCollection);
			}
		}
	}

	return reshapedCollections;
};

export const reshapeImages = (
	images: Connection<Image>,
	productTitle: string,
) => {
	const flattened = removeEdgesAndNodes(images);

	return flattened.map(image => {
		const filename = image.url.match(/.*\/(.*)\..*/)?.[1];

		return {
			...image,
			altText: image.altText || `${productTitle} - ${filename}`,
		};
	});
};

export const reshapeProduct = (
	product: ShopifyProduct,
	filterHiddenProducts = true,
) => {
	if (
		!product ||
		(filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
	) {
		return undefined;
	}

	const {images, variants, ...rest} = product;

	return {
		...rest,
		images: reshapeImages(images, product.title),
		variants: removeEdgesAndNodes(variants),
	};
};

export const reshapeProducts = (products: ShopifyProduct[]) => {
	const reshapedProducts = [];

	for (const product of products) {
		if (product) {
			const reshapedProduct = reshapeProduct(product);

			if (reshapedProduct) {
				reshapedProducts.push(reshapedProduct);
			}
		}
	}

	return reshapedProducts;
};
