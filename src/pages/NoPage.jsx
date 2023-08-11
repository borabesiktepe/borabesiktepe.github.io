import React from 'react';
import { NavLink } from "react-router-dom";

function NoPage() {
    return (
        <div>
           <h1> 404 Page Not Found</h1> 
           <p> Go back to {" "}
           <NavLink
              to="/"
            >
              Homepage
            </NavLink>
            .
           </p>
        </div>
    )
}

export default NoPage;