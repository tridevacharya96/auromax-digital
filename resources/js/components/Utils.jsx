import { useEffect, useState } from 'react';

export function ProgressBar() {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setWidth((scrollTop / docHeight) * 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return <div className="progress-bar" style={{ width: `${width}%` }} />;
}

export function ScrollToTop() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <button
            className={`scroll-top${visible ? ' visible' : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
        >
            <i className="fas fa-arrow-up" />
        </button>
    );
}

export function Loader() {
    const [hidden, setHidden] = useState(false);
    const [removed, setRemoved] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Animate progress bar
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) { clearInterval(interval); return 100; }
                return p + 2;
            });
        }, 20);

        const t1 = setTimeout(() => setHidden(true), 1800);
        const t2 = setTimeout(() => setRemoved(true), 2300);
        return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(interval); };
    }, []);

    if (removed) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#ffffff',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '2rem',
            opacity: hidden ? 0 : 1,
            transition: 'opacity 0.5s ease',
        }}>
            {/* Glowing ring around logo */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Outer spinning ring */}
                <div style={{
                    position: 'absolute',
                    width: '140px', height: '140px',
                    borderRadius: '50%',
                    border: '3px solid transparent',
                    borderTopColor: '#f5a800',
                    borderRightColor: '#cc0000',
                    animation: 'loaderSpin 1.2s linear infinite',
                }} />
                {/* Inner spinning ring */}
                <div style={{
                    position: 'absolute',
                    width: '115px', height: '115px',
                    borderRadius: '50%',
                    border: '2px solid transparent',
                    borderTopColor: '#cc0000',
                    borderLeftColor: '#f5a800',
                    animation: 'loaderSpin 0.8s linear infinite reverse',
                }} />
                {/* Logo */}
                <div style={{
                    width: '90px', height: '90px',
                    borderRadius: '50%',
                    background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 24px rgba(245,168,0,0.25)',
                    padding: '10px',
                }}>
                    <img
                        src="/images/amd-logo.png"
                        alt="Auromax Digital"
                        style={{ width: '70px', height: 'auto', objectFit: 'contain' }}
                    />
                </div>
            </div>

            {/* Brand name */}
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    fontSize: '1.3rem', fontWeight: 800,
                    background: 'linear-gradient(135deg, #cc0000, #f5a800)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text', letterSpacing: '2px',
                    marginBottom: '0.5rem',
                }}>
                    AUROMAX DIGITAL
                </div>
                <div style={{ color: '#8a4a00', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>
                    Loading Experience...
                </div>
            </div>

            {/* Progress bar */}
            <div style={{
                width: '200px', height: '3px',
                background: '#f0e8e0', borderRadius: '3px', overflow: 'hidden',
            }}>
                <div style={{
                    height: '100%', borderRadius: '3px',
                    background: 'linear-gradient(90deg, #cc0000, #f5a800)',
                    width: `${progress}%`,
                    transition: 'width 0.02s linear',
                    boxShadow: '0 0 8px rgba(245,168,0,0.6)',
                }} />
            </div>

            {/* Spinner keyframes */}
            <style>{`
                @keyframes loaderSpin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
