import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ progress }) => {
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
            <div style={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{
                            fontFamily: '"Libre Bodoni", serif',
                            fontSize: 'clamp(1.5rem, 5vw, 3rem)',
                            color: 'var(--dark-color)',
                            letterSpacing: '0.1em',
                            margin: 0,
                            lineHeight: 1.2,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        BORA BEŞİKTEPE
                    </motion.h1>
                </div>

                <div style={{
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'rgba(128, 128, 128, 0.2)',
                    marginTop: '12px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "easeOut" }}
                        style={{
                            height: '100%',
                            backgroundColor: 'var(--dark-color)',
                            position: 'absolute',
                            left: 0,
                            top: 0
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default Loader;
