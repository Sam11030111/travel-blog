import { Outlet, useLocation } from "react-router-dom";

import Cards from "../components/cards/Cards";

const Explore = () => {
  const location = useLocation();
  const isRootExplore = location.pathname === "/explore";

  return (
    <>
      {isRootExplore && <Cards />}
      <Outlet />
    </>
  );
};

export default Explore;
