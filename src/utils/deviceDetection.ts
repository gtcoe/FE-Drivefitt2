export const getDeviceType = (
  userAgent: string
): "mobile" | "tablet" | "desktop" => {
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const tabletRegex = /(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i;

  if (tabletRegex.test(userAgent)) {
    return "tablet";
  } else if (mobileRegex.test(userAgent)) {
    return "mobile";
  }
  return "desktop";
};

export const isMobileDevice = (userAgent: string): boolean => {
  const mobileRegex =
    /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
};
