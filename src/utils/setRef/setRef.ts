import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import { ForwardedRef, LegacyRef } from 'react';

/**
 * refに値を設定する
 * @param ref
 * @param value
 */
export default function setRef<T = any>(ref: ForwardedRef<T> | LegacyRef<T> | null | undefined, value: T | null): void {
  if (ref != null && !isString(ref)) {
    if (isFunction(ref)) {
      ref(value);
    } else {
      (ref as any).current = value;
    }
  }
}
