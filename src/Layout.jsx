import React, { Suspense } from "react";

import { Outlet } from "react-router-dom";

const Navbar = React.lazy(() => import("./components/navbar/"));
const Footer = React.lazy(() => import("./components/footer/"));

function Layout() {
  return (
    <>
    <Suspense fallback={<div></div>}>
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </Suspense>
    </>
  );
}

export default Layout;
