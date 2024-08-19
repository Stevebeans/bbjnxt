export const feedUpdater = user => {
  if (!user || !user.user_roles) {
    return false;
  }

  const user_roles = user.user_roles;

  if (Array.isArray(user_roles)) {
    const hasRole = user_roles.some(role => ["administrator", "editor", "updater"].includes(role));

    return hasRole;
  }

  return false;
};

export const Supporter = user => {
  console.log("Supporter function");
  console.log("USER", user);

  // scan user.user_roles for 'supporter'
};
