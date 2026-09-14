import { getCurrentUser } from "@/service/getCurrentUser";
import NavbarClient from "./NavbarClient";

const Navbar = async () => {
  const result = await getCurrentUser();

  const user = result && "id" in result ? result : null;

  return <NavbarClient user={user} />;
};

export default Navbar;
