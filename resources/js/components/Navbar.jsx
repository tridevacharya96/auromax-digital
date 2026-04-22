import { useState, useEffect } from 'react';

export default function Navbar({ auth }) {
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
        { id:'home',        label:'Home' },
        { id:'products',    label:'Products' },
        { id:'podcasts',    label:'Podcasts' },
        { id:'celebrities', label:'Celebrities' },
        { id:'features',    label:'Features' },
        { id:'pricing',     label:'Pricing' },
        { id:'team',        label:'Team' },
        { id:'contact',     label:'Contact' },
    ];

    return (
        <>
            <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
                {/* Logo */}
                <a href="#home" className="logo" onClick={e => { e.preventDefault(); scrollTo('home'); }}>
                    <img src="/images/amd-logo.png" alt="Auromax Digital" />
                </a>

                {/* Desktop Nav Links */}
                <ul className="nav-links">
                    {navItems.map(item => (
                        <li key={item.id}>
                            <a href={`#${item.id}`} className={activeSection === item.id ? 'active' : ''} onClick={e => { e.preventDefault(); scrollTo(item.id); }}>
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Action Buttons */}
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    {auth?.user ? (
                        /* Logged in — show profile button */
                        <a href="/profile" style={{ padding:'0.5rem 1.1rem', borderRadius:'50px', background:'linear-gradient(135deg,#cc0000,#f5a800)', color:'#fff', fontWeight:700, fontSize:'0.82rem', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.4rem', whiteSpace:'nowrap', boxShadow:'0 4px 12px rgba(245,168,0,0.3)' }}>
                            <i className="fas fa-user-circle" />
                            {auth.user.name.split(' ')[0]}
                        </a>
                    ) : (
                        /* Not logged in — show Login + Sign Up */
                        <>
                            <a href="/login" style={{ padding:'0.5rem 1.1rem', borderRadius:'50px', background:'transparent', color:'#cc4400', fontWeight:700, fontSize:'0.82rem', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.4rem', whiteSpace:'nowrap', border:'1.5px solid rgba(204,68,0,0.3)', transition:'all 0.3s' }}
                                onMouseEnter={e => { e.currentTarget.style.background='rgba(204,68,0,0.08)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}>
                                <i className="fas fa-sign-in-alt" /> Login
                            </a>
                            <a href="/register" style={{ padding:'0.5rem 1.1rem', borderRadius:'50px', background:'linear-gradient(135deg,#cc0000,#f5a800)', color:'#fff', fontWeight:700, fontSize:'0.82rem', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.4rem', whiteSpace:'nowrap', boxShadow:'0 4px 12px rgba(245,168,0,0.3)', transition:'all 0.3s' }}
                                onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                                onMouseLeave={e => e.currentTarget.style.transform=''}>
                                <i className="fas fa-user-plus" /> Sign Up
                            </a>
                        </>
                    )}

                    {/* Admin Button */}
                    <a href="/admin" style={{ padding:'0.5rem 1.1rem', borderRadius:'50px', background:'#0a0a0a', color:'#f5a800', fontWeight:700, fontSize:'0.82rem', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.4rem', whiteSpace:'nowrap', border:'1.5px solid rgba(245,168,0,0.4)', transition:'all 0.3s' }}
                        onMouseEnter={e => { e.currentTarget.style.background='#f5a800'; e.currentTarget.style.color='#000'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='#0a0a0a'; e.currentTarget.style.color='#f5a800'; }}>
                        <i className="fas fa-lock" /> Admin
                    </a>

                    {/* Hamburger */}
                    <button className={`hamburger${menuOpen ? ' active' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
                        <span /><span /><span />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
                <ul>
                    {navItems.map(item => (
                        <li key={item.id}>
                            <a href={`#${item.id}`} onClick={e => { e.preventDefault(); scrollTo(item.id); }}>
                                {item.label}
                            </a>
                        </li>
                    ))}
                    <li style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginTop:'1rem', alignItems:'center' }}>
                        {auth?.user ? (
                            <a href="/profile" style={{ padding:'0.75rem 2rem', borderRadius:'50px', background:'linear-gradient(135deg,#cc0000,#f5a800)', color:'#fff', fontWeight:700, fontSize:'0.9rem', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                                <i className="fas fa-user-circle" /> My Profile
                            </a>
                        ) : (
                            <>
                                <a href="/login" style={{ padding:'0.75rem 2rem', borderRadius:'50px', background:'transparent', color:'#cc4400', fontWeight:700, fontSize:'0.9rem', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.5rem', border:'1.5px solid rgba(204,68,0,0.4)' }}>
                                    <i className="fas fa-sign-in-alt" /> Login
                                </a>
                                <a href="/register" style={{ padding:'0.75rem 2rem', borderRadius:'50px', background:'linear-gradient(135deg,#cc0000,#f5a800)', color:'#fff', fontWeight:700, fontSize:'0.9rem', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                                    <i className="fas fa-user-plus" /> Sign Up
                                </a>
                            </>
                        )}
                        <a href="/admin" style={{ padding:'0.75rem 2rem', borderRadius:'50px', background:'#0a0a0a', color:'#f5a800', fontWeight:700, fontSize:'0.9rem', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.5rem', border:'1.5px solid rgba(245,168,0,0.4)' }}>
                            <i className="fas fa-lock" /> Admin
                        </a>
                    </li>
                </ul>
            </div>
        </>
    );
}
