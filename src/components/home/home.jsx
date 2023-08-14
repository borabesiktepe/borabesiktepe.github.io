import Artworks from '../artworks';
import Menu from '../menu';
import {DarkModeToggle} from '../darkmode';

function home() {
    return (
        <>
            <main>
                <div className="title">
                    <h1>BORA BEŞİKTEPE</h1>
                    <Menu />
                </div>
                <div className="content">
                    <DarkModeToggle></DarkModeToggle>
                    <Artworks></Artworks>
                    <span class="desc">Based in İstanbul.</span>
                </div>
            </main>
        </>
    )
}

export default home;