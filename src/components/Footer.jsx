import React from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ padding: '40px 10%', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '30px', backgroundColor: 'var(--bg-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '30px' }}>

        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Centre for Extended Reality</h3>
          <p style={{ color: 'var(--text-muted)' }}>Shaping the future of immersive computing through AR, VR, and mixed environments.</p>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <h4 style={{ marginBottom: '15px' }}>Contact Details</h4>
          <p style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', marginBottom: '10px' }}>
            <Phone size={18} /> +91 9876543210
          </p>
          <Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gradient" style={{ fontWeight: '600', textDecoration: 'none' }}>
            &rarr; Go to Contact Us page
          </Link>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <h4 style={{ marginBottom: '15px' }}>Socials</h4>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="https://www.instagram.com/cxr_gitam/?hl=en" target="_blank" rel="noreferrer" style={{ color: '#009988', transition: 'color 0.3s' }}>
              Instagram
            </a>
            <a href="https://www.linkedin.com/company/cxr-gitam/posts/?feedView=all" target="_blank" rel="noreferrer" style={{ color: '#009988', transition: 'color 0.3s' }}>
              LinkedIn
            </a>
            <a href="https://www.whatsapp.com/channel/0029Va4ST5X6WaKkW7QDrI0v" target="_blank" rel="noreferrer" style={{ color: '#009988', transition: 'color 0.3s' }}>
              Whatsapp
            </a>
          </div>
        </div>

      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        © 2026 Centre for Extended Reality. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
