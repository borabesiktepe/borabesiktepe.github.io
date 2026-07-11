import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import ParticleBackground from "./components/ParticleBackground";

function Layout() {
  return (
    <>
      <ParticleBackground />
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        <Suspense fallback={<></>}>
          <Outlet></Outlet>
        </Suspense>
      </div>
    </>
  );
}

export default Layout;
