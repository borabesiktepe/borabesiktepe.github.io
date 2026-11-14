import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "../components/home";
import Artworks from "../components/artworks-page";
import About from "../components/about";

import NoPage from "./NoPage";
import Layout from "../Layout";

const TITLES = {
    "/": "Bora Beşiktepe | Digital Illustrator from İstanbul",
    "/artworks": "Artworks | Bora Beşiktepe",
    "/about": "About | Bora Beşiktepe",
};

function AppRoutes() {
    const location = useLocation();

    // Keep the tab title in step with the page on in-app navigation.
    useEffect(() => {
        const path = location.pathname.replace(/\/+$/, "") || "/";
        document.title = TITLES[path] || "Not found | Bora Beşiktepe";
    }, [location.pathname]);

    return (
        <AnimatePresence mode="wait">
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
