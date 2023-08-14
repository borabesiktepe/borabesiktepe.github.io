import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "../components/home";
import Artworks from "../components/artworks-page";
import About from "../components/about";

import NoPage from "./NoPage";
import Layout from "../Layout";

function AppRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="artworks" element={<Artworks />} />
                    <Route path="about" element={<About />} />
                </Route>
                <Route path="*" element={<NoPage />} />
            </Routes>
        </AnimatePresence>
    );
}

export default AppRoutes;
