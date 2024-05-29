import { MutableRefObject, useEffect, useRef, useState } from 'react';

/**
 * 2つの値を相互変換するhooks
 * @param value1 値1
 * @param value2 値2
 * @param toValue1 値2を値1に変換する関数
 * @param toValue2 値1を値2に変換する関数
 * @returns [value1, value2]
 */
export default function useSyncedValues<V1, V2>(
  value1: V1,
  value2: V2,
  toValue1: (value2: V2) => V1,
  toValue2: (value1: V1) => V2,
): [V1, V2] {
  const [syncedValue1, setSyncedValue1] = useState(value1);
  const [syncedValue2, setSyncedValue2] = useState(value2);
  const value1Ref = useRef(value1);
  const value2Ref = useRef(value2);

  useToOtherValue(value1, toValue2, setSyncedValue1, setSyncedValue2, value1Ref, value2Ref);
  useToOtherValue(value2, toValue1, setSyncedValue2, setSyncedValue1, value2Ref, value1Ref);

  return [syncedValue1, syncedValue2];
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
