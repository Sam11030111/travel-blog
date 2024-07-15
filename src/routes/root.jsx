import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";

function Root() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--textColor)]">
      <Header />
      <Outlet />
    </div>
  );
}

export default Root;
