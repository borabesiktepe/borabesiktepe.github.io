import React from 'react';

import contactImage from '../../assets/contact-image.png'
const imageUrl = `url(${contactImage})`;

const bgArtStyle = {
    position: 'absolute',
    top: '40px',
    right: '0',
    height: '800px',
    width: '100%',
    backgroundImage: imageUrl,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'left',
    opacity: '0.5',
    zIndex: '-1',
  };

function Contact() {
    return (
        <>
            <section className="contact">
                <form action="https://formspree.io/f/xjvdwklo" method="POST">
                    <h1>Feel free to reach me out.</h1>
                    <div class="form-group">
                        <label for="name">Your name</label>
                        <input type="text" id="name" name="name" required></input>
                    </div>
                    <div class="form-group">
                        <label for="email">Your email</label>
                        <input type="text" id="email" name="email" required></input>
                    </div>
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" name="message" rows="4" required></textarea>
                    </div>
                    <input type="submit" value="Submit"></input>
                </form>
            </section>
            <div className='bgArt' style={bgArtStyle}></div>
        </>
    )
}

export default Contact;