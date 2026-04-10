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

    useEffect(() => {
        const t1 = setTimeout(() => setHidden(true), 1200);
        const t2 = setTimeout(() => setRemoved(true), 1700);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    if (removed) return null;

    return (
        <div className={`loader${hidden ? ' hidden' : ''}`}>
            <div className="loader-ring" />
            <div className="loader-text">Loading...</div>
        </div>
    );
}
