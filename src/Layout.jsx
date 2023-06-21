import React, { Suspense } from "react";

import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
    <Suspense fallback={<></>}>
      <Outlet></Outlet>
    </Suspense>
    </>
  );
}

export default Layout;
