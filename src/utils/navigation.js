// utils/navigation.js

export const redirectToLogin = router => {
  const currentPath = router.asPath;
  router.push(`/login?referrer=${encodeURIComponent(currentPath)}`);
};
