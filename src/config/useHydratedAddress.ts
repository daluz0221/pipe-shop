import { useAddressStore } from '@/store';
import { useEffect, useState } from 'react';




export const useHydratedAddress = () => {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAddressStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // Ya se rehidrató antes del efecto
    if (useAddressStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }

    return unsub;
  }, []);

  return hasHydrated;
};
