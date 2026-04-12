import { useState, useEffect } from 'react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            const sections = document.querySelectorAll('section[id]');
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + section.offsetHeight) {
                    current = section.getAttribute('id');
                }
            });
            if (current) setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
    }, [menuOpen]);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) { window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' }); setMenuOpen(false); }
    };

    const navItems = [
        { id:'home', label:'Home' },
        { id:'products', label:'Products' },
        { id:'podcasts', label:'Podcasts' },
        { id:'celebrities', label:'Celebrities' },
        { id:'features', label:'Features' },
        { id:'pricing', label:'Pricing' },
        { id:'team', label:'Team' },
        { id:'contact', label:'Contact' },
    ];

    const btnSignUp = { padding:'0.5rem 1.1rem', borderRadius:'50px', background:'linear-gradient(135deg,#cc0000,#f5a800)', color:'#fff', fontWeight:700, fontSize:'0.82rem', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.4rem', whiteSpace:'nowrap', border:'none' };
    const btnAdmin  = { padding:'0.5rem 1.1rem', borderRadius:'50px', background:'#0a0a0a', color:'#f5a800', fontWeight:700, fontSize:'0.82rem', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.4rem', whiteSpace:'nowrap', border:'1.5px solid rgba(245,168,0,0.4)' };

    return (
        <>
            <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
                <a href="#home" className="logo" onClick={e => { e.preventDefault(); scrollTo('home'); }}>
                    <img src="/images/amd-logo.png" alt="Auromax Digital" />
                </a>

                <ul className="nav-links">
                    {navItems.map(item => (
                        <li key={item.id}>
                            <a href={`#${item.id}`} className={activeSection === item.id ? 'active' : ''} onClick={e => { e.preventDefault(); scrollTo(item.id); }}>
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <a href="/register" style={btnSignUp}>
                        <i className="fas fa-user-plus" /> Sign Up
                    </a>
                    <a href="/admin" style={btnAdmin}>
                        <i className="fas fa-lock" /> Admin
                    </a>
                    <button className={`hamburger${menuOpen ? ' active' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
                        <span /><span /><span />
                    </button>
                </div>
            </nav>

            <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
                <ul>
                    {navItems.map(item => (
                        <li key={item.id}>
                            <a href={`#${item.id}`} onClick={e => { e.preventDefault(); scrollTo(item.id); }}>
                                {item.label}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a href="/register" style={{ ...btnSignUp, justifyContent:'center', padding:'0.75rem 2rem' }}>
                            <i className="fas fa-user-plus" /> Sign Up
                        </a>
                    </li>
                    <li>
                        <a href="/admin" style={{ ...btnAdmin, justifyContent:'center', padding:'0.75rem 2rem' }}>
                            <i className="fas fa-lock" /> Admin
                        </a>
                    </li>
                </ul>
            </div>
        </>
    );
}
