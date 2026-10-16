import { useState, useEffect, useMemo } from "react";

export function useCameraAvailability() {
  const [noCam, setNoCam] = useState<boolean>(false);

  const hasGetUserMedia = useMemo(
    () => typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia,
    []
  );

  useEffect(() => {
    if (!hasGetUserMedia) {
      setNoCam(true);
    }
  }, [hasGetUserMedia]);

  return { noCam, setNoCam, hasGetUserMedia };
}