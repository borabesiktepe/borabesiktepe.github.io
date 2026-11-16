import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "../components/home";
import Artworks from "../components/artworks-page";
import About from "../components/about";

import NoPage from "./NoPage";
import Layout from "../Layout";

const TITLES = {
    "/": "Bora Beşiktepe",
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
                {/* The build writes index.html, about.html and artworks.html, and
                    GitHub Pages answers 200 for them. Send those addresses to the
                    clean URL instead of showing a 404 page with a 200 status,
                    which Google reports as a soft 404. /contact was an old page. */}
                <Route path="index.html" element={<Navigate to="/" replace />} />
                <Route path="about.html" element={<Navigate to="/about" replace />} />
                <Route path="artworks.html" element={<Navigate to="/artworks" replace />} />
                <Route path="contact" element={<Navigate to="/about" replace />} />
                <Route path="*" element={<NoPage />} />
            </Routes>
        </AnimatePresence>
    );
}

export default AppRoutes;
