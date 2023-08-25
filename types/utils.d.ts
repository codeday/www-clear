/* eslint-disable no-unused-vars */
declare type PartialExcept<T, K extends keyof T> = Pick<T, K> & Omit<Partial<T>, K>;
declare type PropFor<T extends object> = Pick<T, 'id' | '__typename'>;
