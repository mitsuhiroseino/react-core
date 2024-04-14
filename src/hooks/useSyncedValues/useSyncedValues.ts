import { MutableRefObject, useEffect, useRef, useState } from 'react';

/**
 * 2つの値を相互変換するhooks
 * @param value0 値0
 * @param value1 値1
 * @param toValue0 値1を値0に変換する関数
 * @param toValue1 値0を値1に変換する関数
 * @returns [value0, value1]
 */
export default function useSyncedValues<V0, V1>(
  value0: V0,
  value1: V1,
  toValue0: (value1: V1) => V0,
  toValue1: (value0: V0) => V1,
): [V0, V1] {
  const [syncedValue0, setSyncedValue0] = useState(value0);
  const [syncedValue1, setSyncedValue1] = useState(value1);
  const value0Ref = useRef(value0);
  const value1Ref = useRef(value1);

  useToOtherValue(value0, toValue1, setSyncedValue0, setSyncedValue1, value0Ref, value1Ref);
  useToOtherValue(value1, toValue0, setSyncedValue1, setSyncedValue0, value1Ref, value0Ref);

  return [syncedValue0, syncedValue1];
}

// valueを変換しotherValueを更新するhooks
function useToOtherValue<V, O>(
  value: V,
  toOtherValue: (value: V) => O,
  setValue: (value: V) => void,
  setOtherValue: (otherValue: O) => void,
  valueRef: MutableRefObject<V>,
  otherValueRef: MutableRefObject<O>,
): V {
  useEffect(() => {
    if (valueRef.current !== value) {
      const result = toOtherValue(value);
      if (result instanceof Promise) {
        result.then((asyncResult) => {
          valueRef.current = value;
          otherValueRef.current = asyncResult;
          setValue(value);
          setOtherValue(asyncResult);
        });
      } else {
        valueRef.current = value;
        otherValueRef.current = result;
        setValue(value);
        setOtherValue(result);
      }
    }
  }, [value]);

  return value;
}
