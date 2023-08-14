import { motion } from "framer-motion";

import Artworks from '../artworks';
import Menu from '../menu';
import {DarkModeToggle} from '../darkmode';

function home() {
    return (        
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="title">
                    <h1>BORA BEŞİKTEPE</h1>
                    <Menu />
                </div>
                <div className="content">
                    <DarkModeToggle></DarkModeToggle>
                    <Artworks></Artworks>
                    <span class="desc">Based in İstanbul.</span>
                </div>
            </motion.main>        
    )
}

export default home;