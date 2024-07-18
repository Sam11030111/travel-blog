import { Outlet, useLocation } from "react-router-dom";
import UsersTable from "../components/usersTable/UsersTable";

const Users = () => {
  const location = useLocation();
  const isRootUsers = location.pathname === "/users";

  return (
    <>
      {isRootUsers && <UsersTable />}
      <Outlet />
    </>
  );
};

export default Users;
