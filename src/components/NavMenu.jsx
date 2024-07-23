import React, { useContext } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AuthContext from "@/utils/AuthContext";
import { getNavMenu } from "@/components/utils/Menu";

const NavMenu = ({ classInfo = "" }) => {
  const { user } = useContext(AuthContext);
  const pathName = usePathname();
  const navMenu = getNavMenu(user);

  return (
    <nav className={classInfo}>
      {navMenu.map(item => (
        <div key={item.link}>
          <Link href={item.link} className={`${pathName == item.link ? "active" : "inactive"} mx-2`}>
            {item.name}
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default NavMenu;
