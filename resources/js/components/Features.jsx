import { useEffect, useRef } from 'react';

const FEATURES = [
    {
        icon: 'fa-bolt',
        gradient: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
        title: 'Lightning Fast',
        desc: 'Optimized for performance with Laravel caching & Vite. Load times under 1 second guaranteed.',
    },
    {
        icon: 'fa-mobile-alt',
        gradient: 'linear-gradient(135deg, #00d4ff, #0099cc)',
        title: 'Fully Responsive',
        desc: 'Looks stunning on every device — from mobile phones to ultra-wide monitors.',
    },
    {
        icon: 'fa-palette',
        gradient: 'linear-gradient(135deg, #f50057, #ff4081)',
        title: 'Customizable',
        desc: 'Easily change colors, fonts, and layouts using CSS variables. Make it yours.',
    },
    {
        icon: 'fa-shield-alt',
        gradient: 'linear-gradient(135deg, #ff9800, #f57c00)',
        title: 'Secure & Reliable',
        desc: 'Built on Laravel\'s battle-tested security: CSRF, XSS protection, and more.',
    },
    {
        icon: 'fa-code',
        gradient: 'linear-gradient(135deg, #4caf50, #2e7d32)',
        title: 'Clean Code',
        desc: 'Well-structured React components and Laravel controllers. Developer-friendly by design.',
    },
    {
        icon: 'fa-magic',
        gradient: 'linear-gradient(135deg, #9c27b0, #6a1b9a)',
        title: 'Smooth Animations',
        desc: 'Delightful micro-interactions and animations that enhance user experience.',
    },
];

function FeatureCard({ feature, index }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('visible');
                    observer.unobserve(el);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -6;
        const rotY = ((x - cx) / cx) * 6;
        ref.current.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    };

    const handleMouseLeave = () => {
        ref.current.style.transform = '';
        ref.current.style.transition = 'transform 0.5s ease';
        setTimeout(() => { if (ref.current) ref.current.style.transition = ''; }, 500);
    };

    return (
        <div
            className="feature-card reveal"
            ref={ref}
            style={{ transitionDelay: `${(index % 3) * 0.1}s` }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="feature-icon" style={{ background: feature.gradient }}>
                <i className={`fas ${feature.icon}`} />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
            <a href="#" className="feature-link">
                Learn more <i className="fas fa-arrow-right" />
            </a>
        </div>
    );
}

export default function Features() {
    return (
        <section id="features">
            <div className="section-header">
                <span className="section-tag">✦ Features</span>
                <h2>Everything You <span className="gradient-text">Need</span></h2>
                <p>Packed with powerful features to help you build faster and smarter.</p>
            </div>
            <div className="features-grid">
                {FEATURES.map((f, i) => (
                    <FeatureCard key={f.title} feature={f} index={i} />
                ))}
            </div>
        </section>
    );
}
