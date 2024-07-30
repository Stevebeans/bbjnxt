import React, { useContext } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AuthContext from "@/utils/AuthContext";
import { getNavMenu } from "@/components/utils/menu";

const NavMenu = ({ classInfo = "" }) => {
  const { user, logout } = useContext(AuthContext);
  const pathName = usePathname();
  const navMenu = getNavMenu(user);

  const handleLogout = event => {
    event.preventDefault();
    logout();
  };

  return (
    <nav className={classInfo}>
      {navMenu.map(item => (
        <div key={item.name}>
          {item.link ? (
            <Link href={item.link} className={`${pathName == item.link ? "active" : "inactive"} mx-2`}>
              {item.name}
            </Link>
          ) : (
            <a href="#" onClick={handleLogout} className="mx-2 inactive">
              {item.name}
            </a>
          )}
        </div>
      ))}
    </nav>
  );
};

export default NavMenu;
