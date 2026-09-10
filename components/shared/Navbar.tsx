import { getCurrentUser } from "@/service/getCurrentUser";
import NavbarClient from "./NavbarClient";

const Navbar = async () => {
  const result = await getCurrentUser();

  // getCurrentUser answers with a failure object when there is no session.
  const user = result && "id" in result ? result : null;

  return <NavbarClient user={user} />;
};

export default Navbar;
