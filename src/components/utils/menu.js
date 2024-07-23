export const getNavMenu = user => [{ name: "Home", link: "/" }, user ? { name: "Dashboard", link: "/dashboard" } : { name: "Login", link: "/login" }];
