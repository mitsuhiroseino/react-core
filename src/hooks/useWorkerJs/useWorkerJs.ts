import { useEffect, useRef, useState } from 'react';

// サービスワーカーを登録する
export default function useWorkerJs(sourcePath: string) {
  const [regist, setRegist] = useState(null as any),
    ref = useRef(
      {} as {
        registration?: ServiceWorkerRegistration;
        path?: string;
      },
    );

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const { registration, path } = ref.current;
      if (registration) {
        unregister(registration, path);
      }
      if (sourcePath) {
        navigator.serviceWorker
          .register(sourcePath)
          .then((reg) => {
            ref.current = { registration: reg, path: sourcePath };
            setRegist(reg);
            console.info(`${sourcePath} was registered.`);
          })
          .catch(() => {
            console.error(`${sourcePath} cannot be registered.`);
          });
        return () => {
          unregister(ref.current.registration, ref.current.path);
          setRegist(null);
        };
      }
    }
  }, [sourcePath]);

  return regist as ServiceWorkerRegistration;
}

function unregister(registration?: ServiceWorkerRegistration, sourcePath?: string) {
  if (registration) {
    registration.unregister().then(function (result: boolean) {
      if (result) {
        console.info(`${sourcePath} was unregistered.`);
      } else {
        console.error(`${sourcePath} cannot be unregistered.`);
      }
    });
  }
}
