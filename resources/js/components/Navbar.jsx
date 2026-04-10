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

    const navItems = ['home', 'features', 'pricing', 'team', 'contact'];

    return (
        <>
            <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
                <a href="#home" className="logo" onClick={(e) => { e.preventDefault(); scrollTo('home'); }}>
                    <img src="/images/amd-logo.png" alt="Auromax Digital" />
                </a>
                <ul className="nav-links">
                    {navItems.map(item => (
                        <li key={item}>
                            <a href={`#${item}`} className={activeSection === item ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollTo(item); }}>
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </a>
                        </li>
                    ))}
                    <li><a href="#contact" className="nav-cta" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>Get Started</a></li>
                </ul>
                <button className={`hamburger${menuOpen ? ' active' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
                    <span /><span /><span />
                </button>
            </nav>
            <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
                <ul>
                    {navItems.map(item => (
                        <li key={item}><a href={`#${item}`} onClick={(e) => { e.preventDefault(); scrollTo(item); }}>{item.charAt(0).toUpperCase() + item.slice(1)}</a></li>
                    ))}
                    <li><a href="#contact" className="btn btn-primary" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>Get Started</a></li>
                </ul>
            </div>
        </>
    );
}
