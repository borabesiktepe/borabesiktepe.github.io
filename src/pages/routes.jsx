import React from "react";
import {Routes, Route, useLocation} from "react-router-dom";

import Home from "../components/home";
import Layout from "../Layout";

function routes() {
    const location = useLocation;

    return (
        <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>}></Route>
            </Route>
            <Route path="*">

            </Route>
        </Routes>
    )
}

export default routes;