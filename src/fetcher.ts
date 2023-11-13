/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable no-process-env */
import {DOMAIN, SHOPIFY_GRAPHQL_API_ENDPOINT} from './constants.js';
import {isShopifyError} from './error.js';

const endpoint = `${DOMAIN}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? '';

type ExtractVariables<T> = T extends {variables: {[key: string]: unknown}}
	? T['variables']
	: never;

export const shopifyFetch = async <T>({
	cache = 'force-cache',
	headers,
	query,
	tags,
	variables,
}: {
	cache?: RequestCache;
	headers?: HeadersInit;
	query: string;
	tags?: string[];
	variables?: ExtractVariables<T>;
}): Promise<{status: number; body: T}> => {
	try {
		const result = await fetch(endpoint, {
			body: JSON.stringify({
				...(query && {query}),
				...(variables && {variables}),
			}),
			cache,
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Storefront-Access-Token': key,
				...headers,
			},
			method: 'POST',
			...(tags && {next: {tags}}),
		});

		const body = (await result.json()) as T;

		if ((body as {errors: unknown[]}).errors) {
			throw (body as {errors: unknown[]}).errors[0];
		}

		return {
			body,
			status: result.status,
		};
	} catch (error) {
		if (isShopifyError(error)) {
			throw {
				cause: error.cause?.toString() || 'unknown',
				message: error.message,
				query,
				status: error.status || 500,
			};
		}

		throw {
			error,
			query,
		};
	}
};
