import { useCartStore } from '@/store';
import { useEffect, useState } from 'react';




export const useHydratedCart = () => {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const unsub = useCartStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // Ya se rehidrató antes del efecto
    if (useCartStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }

    return unsub;
  }, []);

  return hasHydrated;
};
