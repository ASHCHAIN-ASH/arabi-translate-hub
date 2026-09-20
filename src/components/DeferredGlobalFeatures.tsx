import { lazy, Suspense, useEffect, useState } from "react";

const BonusDropBanner = lazy(() => import("@/components/bonus/BonusDropBanner"));
const NationalDayPromoPopup = lazy(() => import("@/components/NationalDayPromoPopup"));
const InstallPwaPrompt = lazy(() => import("@/components/InstallPwaPrompt"));

const DeferredGlobalFeatures = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const id = idleWindow.requestIdleCallback(() => setReady(true), { timeout: 1800 });
      return () => idleWindow.cancelIdleCallback?.(id);
    }

    const timer = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <BonusDropBanner />
      <NationalDayPromoPopup />
      <InstallPwaPrompt />
    </Suspense>
  );
};

export default DeferredGlobalFeatures;