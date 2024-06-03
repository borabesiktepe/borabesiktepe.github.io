import { motion } from "framer-motion";
import { Suspense } from 'react';
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
                    <Suspense fallback={<div> Loading... </div>}>
                        <Artworks></Artworks>
                    </Suspense>
                    
                    <span class="desc">Based in İstanbul.</span>
                </div>
            </motion.main>        
    )
}

export default home;