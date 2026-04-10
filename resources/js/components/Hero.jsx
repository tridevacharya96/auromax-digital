import { useEffect, useRef, useState } from 'react';

const TYPING_WORDS = ['Amazing', 'Beautiful', 'Powerful', 'Modern', 'Stunning'];

function useCountUp(target, duration = 2000, start = false) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!start) return;
        let current = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            setValue(Math.floor(current));
        }, 16);
        return () => clearInterval(timer);
    }, [start, target, duration]);
    return value;
}

function StatItem({ target, label }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const value = useCountUp(target, 2000, visible);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return (
        <div className="stat-item" ref={ref}>
            <div className="stat-number">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
}

export default function Hero() {
    const [typedWord, setTypedWord] = useState('Amazing');
    const wordRef = useRef(0);
    const charRef = useRef(7);
    const deletingRef = useRef(false);
    const timerRef = useRef(null);

    useEffect(() => {
        const type = () => {
            const word = TYPING_WORDS[wordRef.current];
            if (deletingRef.current) {
                charRef.current--;
                setTypedWord(word.substring(0, charRef.current));
                if (charRef.current === 0) {
                    deletingRef.current = false;
                    wordRef.current = (wordRef.current + 1) % TYPING_WORDS.length;
                    timerRef.current = setTimeout(type, 400); return;
                }
                timerRef.current = setTimeout(type, 60);
            } else {
                charRef.current++;
                setTypedWord(word.substring(0, charRef.current));
                if (charRef.current === word.length) {
                    timerRef.current = setTimeout(() => { deletingRef.current = true; type(); }, 2000); return;
                }
                timerRef.current = setTimeout(type, 120);
            }
        };
        timerRef.current = setTimeout(type, 1500);
        return () => clearTimeout(timerRef.current);
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
    };

    return (
        <section className="hero" id="home">
            <div className="hero-content">
                <div className="hero-badge">
                    <span className="dot" />
                    Now Available — Version 2.0
                </div>
                <h1 style={{ color: '#2a2a2a', fontWeight: 900 }}>
                    Build Something <span className="gradient-text">{typedWord}</span> Today
                </h1>
                <p style={{ color: '#555555' }}>
                    A powerful, modern digital experience crafted with Laravel & React.
                    Fast, responsive, and beautifully designed for Auromax Digital.
                </p>
                <div className="hero-buttons">
                    <button className="btn btn-primary" onClick={() => scrollTo('features')}>
                        <i className="fas fa-rocket" /> Explore Features
                    </button>
                    <button className="btn btn-outline" onClick={() => scrollTo('contact')}>
                        <i className="fas fa-play" /> Watch Demo
                    </button>
                </div>
                <div className="stats">
                    <StatItem target={10} label="K+ Users" />
                    <StatItem target={98} label="% Satisfaction" />
                    <StatItem target={50} label="+ Components" />
                    <StatItem target={24} label="/7 Support" />
                </div>
            </div>
        </section>
    );
}
