import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <motion.div
            className="loader-container"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                backgroundColor: 'var(--dark-bg)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            >
                <h1 style={{
                    fontFamily: '"Libre Bodoni", serif',
                    fontSize: '2rem',
                    color: 'var(--dark-color)',
                    letterSpacing: '0.1em'
                }}>
                    BORA BEŞİKTEPE
                </h1>
            </motion.div>
        </motion.div>
    );
};

export default Loader;
