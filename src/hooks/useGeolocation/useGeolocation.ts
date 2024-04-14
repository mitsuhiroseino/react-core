import { useCallback, useEffect, useMemo, useState } from 'react';

import { UseGeolocationOptions } from './types';

const OPTONS = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
};

export default function useGeolocation(options: UseGeolocationOptions = {}): GeolocationPosition {
  const { interval, ...rest } = options,
    [geolocation, setGeolocation] = useState(null as any),
    successCallback = useCallback(
      (position: GeolocationPosition) => {
        setGeolocation(position);
      },
      [setGeolocation],
    ),
    errorCallback = useCallback(
      (positionError: GeolocationPositionError) =>
        // 取得失敗
        setGeolocation({
          error: positionError,
        }),
      [setGeolocation],
    ),
    getPosition = useMemo(() => {
      if (interval == null) {
        // enableHighAccuracyに従い位置情報を取得
        return () => {
          const id = navigator.geolocation.watchPosition(successCallback, errorCallback, { ...OPTONS, ...rest });
          return () => {
            navigator.geolocation.clearWatch(id);
          };
        };
      } else {
        return () => {
          // intervalに従い位置情報を取得
          const id = setInterval(() => {
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback, { ...OPTONS, ...rest });
          }, interval);
          return () => {
            clearInterval(id);
          };
        };
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interval, successCallback, errorCallback]);

  useEffect(getPosition, [getPosition]);

  return geolocation;
}
