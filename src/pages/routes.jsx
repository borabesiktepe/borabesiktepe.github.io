import React from "react";
import {Routes, Route, useLocation} from "react-router-dom";
import { AnimatePresence } from "framer-motion";


import Home from "../components/home";
import About from "../components/about";
import Contact from "../components/contact";

import NoPage from "./NoPage";

import Layout from "../Layout";

function routes() {
    const location = useLocation();

    return (
        <AnimatePresence>
        <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>}></Route>
                <Route path="about" element={<About/>}></Route>
                <Route path="contact" element={<Contact/>}></Route>
            </Route>
            <Route path="*" element={<NoPage />} />            
        </Routes>
        </AnimatePresence>
    )
}

export default routes;