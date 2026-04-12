import { useEffect, useRef, useState } from 'react';

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
    const value = useCountUp(parseInt(target) || 0, 2000, visible);
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

export default function Hero({ cms }) {
    const typingWords = cms?.typing_words
        ? cms.typing_words.split(',')
        : ['Converge.', 'Connect.', 'Inspire.', 'Innovate.', 'Transform.'];

    const [typedWord, setTypedWord] = useState(typingWords[0]);
    const wordRef = useRef(0);
    const charRef = useRef(typingWords[0]?.length || 0);
    const deletingRef = useRef(false);
    const timerRef = useRef(null);

    useEffect(() => {
        const type = () => {
            const word = typingWords[wordRef.current];
            if (deletingRef.current) {
                charRef.current--;
                setTypedWord(word.substring(0, charRef.current));
                if (charRef.current === 0) {
                    deletingRef.current = false;
                    wordRef.current = (wordRef.current + 1) % typingWords.length;
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
                    {cms?.badge || 'Where Business Meets Innovation'}
                </div>
                <h1 style={{ color:'#b85c00', fontWeight:900 }}>
                    {cms?.heading || 'Where Business, Entertainment & Technology'}{' '}
                    <span className="gradient-text">{typedWord}</span>
                </h1>
                <p style={{ color:'#8a4a00', fontSize:'1.15rem', maxWidth:'780px', margin:'0 auto 2.5rem', lineHeight:'1.8' }}>
                    {cms?.description || 'Auromax Digital blends commerce, creativity, and technology into one powerful platform.'}
                </p>
                <div className="hero-buttons">
                    <button className="btn btn-primary" onClick={() => scrollTo('features')}>
                        <i className="fas fa-rocket" /> {cms?.btn_primary || 'Explore Features'}
                    </button>
                    <button className="btn btn-outline" onClick={() => scrollTo('contact')}>
                        <i className="fas fa-play" /> {cms?.btn_secondary || 'Watch Demo'}
                    </button>
                </div>
                <div className="stats">
                    <StatItem target={cms?.stat1_value || '10'} label={cms?.stat1_label || 'K+ Users'} />
                    <StatItem target={cms?.stat2_value || '98'} label={cms?.stat2_label || '% Satisfaction'} />
                    <StatItem target={cms?.stat3_value || '50'} label={cms?.stat3_label || '+ Components'} />
                    <StatItem target={cms?.stat4_value || '24'} label={cms?.stat4_label || '/7 Support'} />
                </div>
            </div>
        </section>
    );
}
