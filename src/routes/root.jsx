import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";

function Root() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--textColor)]">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}

export default Root;
