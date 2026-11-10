import { Suspense } from "react";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <div style={{ position: "relative" }}>
        <Suspense fallback={<></>}>
          <Outlet></Outlet>
        </Suspense>
      </div>
    </>
  );
}

export default Layout;
