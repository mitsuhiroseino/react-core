import { useEffect, useState } from 'react';

export type FilledSize = {
  width?: number | string;
  height?: number | string;
};

/**
 * iOSのブラウザーでも100vw & 100vhで表示するためのサイズをpxで取得する
 * iOSのブラウザーでは100vhにアドレスバー分の高さが含まれているため、単純に100vhを指定するとアドレスバー分はみ出してしまう。
 * @param initialSize 初期値
 * @param target 対象
 * @returns
 */
export default function useFilledSize(
  initialSize: FilledSize = { width: '100vw', height: '100vh' },
  target: EventTarget = window,
): FilledSize {
  const [size, setSize] = useState<FilledSize>(initialSize);
  useEffect(() => {
    const onResize = () => {
      setSize({
        width: getWidth(target),
        height: getHeight(target),
      });
    };
    onResize();
    target.addEventListener('resize', onResize);
    return () => {
      target.removeEventListener('resize', onResize);
    };
  }, []);
  return size;
}

function getWidth(target: any) {
  if ('innerWidth' in target) {
    return target.innerWidth;
  } else {
    return target.clientWidth;
  }
}

function getHeight(target: any) {
  if ('innerHeight' in target) {
    return target.innerHeight;
  } else {
    return target.clientHeight;
  }
}
