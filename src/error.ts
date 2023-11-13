export type ShopifyErrorLike = {
	status: number;
	message: Error;
	cause?: Error;
};

const isObject = (object: unknown): object is {[key: string]: unknown} => {
	return (
		typeof object === 'object' && object !== null && !Array.isArray(object)
	);
};

const findError = <T extends {[key: string]: unknown}>(error: T): boolean => {
	if (Object.prototype.toString.call(error) === '[object Error]') return true;

	const prototype = Object.getPrototypeOf(error) as T | null;

	return prototype === null ? false : findError(prototype);
};

export const isShopifyError = (error: unknown): error is ShopifyErrorLike => {
	if (!isObject(error)) return false;

	if (error instanceof Error) return true;

	return findError(error);
};
