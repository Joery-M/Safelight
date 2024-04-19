/**
 * Gives the Promise + non-Promise variant of a function
 *
 * @example MaybePromise<(x: number, y: string | number) => Date> =
 * 	((x: number, y: string | number) => Date) | ((x: number, y: string | number) => Promise<Date>)
 *
 * @author [COlda](https://gist.github.com/CCColda/4251981e652164b4195ec78bcefbb8b7)
 */
export type MaybePromise<T extends (...args: any) => any> =
    | T
    | (T extends (...args: infer A) => infer R ? (...args: A) => Promise<R> : never);

export type MaybePromiseResult<T = any> = T | Promise<T>;
