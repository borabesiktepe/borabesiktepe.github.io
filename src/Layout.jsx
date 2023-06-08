import React, { useState } from "react";

import { Outlet } from "react-router-dom";

const Navbar = React.lazy(() => import("./components/navbar/"));
const Footer = React.lazy(() => import("./components/footer/"));

function Layout() {
  return (
    <>
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  );
}

export default Layout;
