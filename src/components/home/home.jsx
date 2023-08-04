import Artworks from '../artworks'
import DarkModeToggle from '../darkmode';

function home() {
    return (
        <>
            <div className="title">
                <h1>BORA BEŞİKTEPE</h1>
                <div className="menu-button">
                    <svg width="24" height="8" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0H24V1.77778H0V0Z" fill="white" />
                        <path d="M0 6.22222H16V8H0V6.22222Z" fill="white" />
                    </svg>
                    <span>Menu</span>
                </div>
            </div>
            <div className="content">
                <DarkModeToggle></DarkModeToggle>
                <Artworks></Artworks>
                <span class="desc">Based in İstanbul.</span>
            </div>
        </>
    )
}

export default home;