export const ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  HR: 3,
  MANAGER: 4,
  EMPLOYEE: 5,
};

export const hasPermission = (user, module, action) => {
 //console.log("CHECK:", module, action, user?.permissions);

  if (!user || !user.permissions) return false;

  return user.permissions.some(
    (p) => p.module === module && p.action === action
  );
};