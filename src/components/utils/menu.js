// utils/getNavMenu.js
export const getNavMenu = user => [{ name: "Home", link: "/" }, user ? { name: "Dashboard", link: "/dashboard" } : { name: "Login", link: "/login" }, user && { name: "Logout", action: "logout" }].filter(Boolean);
