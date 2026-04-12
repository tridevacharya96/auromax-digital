import { useEffect, useRef } from 'react';

function FeatureCard({ icon, gradient, title, desc, index }) {
    const ref = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        const rotX = ((e.clientY - rect.top - rect.height/2) / (rect.height/2)) * -6;
        const rotY = ((e.clientX - rect.left - rect.width/2) / (rect.width/2)) * 6;
        ref.current.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    };

    return (
        <div className="feature-card reveal" ref={ref}
            style={{ transitionDelay:`${(index % 3) * 0.1}s` }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { ref.current.style.transform = ''; }}>
            <div className="feature-icon" style={{ background: gradient }}>
                <i className={`fas ${icon}`} />
            </div>
            <h3>{title}</h3>
            <p>{desc}</p>
            <a href="#" className="feature-link">Learn more <i className="fas fa-arrow-right" /></a>
        </div>
    );
}

export default function Features({ cms }) {
    const features = [
        { icon: cms?.f1_icon || 'fa-bolt',       gradient: cms?.f1_color || 'linear-gradient(135deg,#6c63ff,#8b5cf6)', title: cms?.f1_title || 'Lightning Fast',     desc: cms?.f1_desc || 'Optimized for performance.' },
        { icon: cms?.f2_icon || 'fa-mobile-alt', gradient: cms?.f2_color || 'linear-gradient(135deg,#00d4ff,#0099cc)', title: cms?.f2_title || 'Fully Responsive',    desc: cms?.f2_desc || 'Looks stunning on every device.' },
        { icon: cms?.f3_icon || 'fa-palette',    gradient: cms?.f3_color || 'linear-gradient(135deg,#f50057,#ff4081)', title: cms?.f3_title || 'Customizable',        desc: cms?.f3_desc || 'Make it yours easily.' },
        { icon: cms?.f4_icon || 'fa-shield-alt', gradient: cms?.f4_color || 'linear-gradient(135deg,#ff9800,#f57c00)', title: cms?.f4_title || 'Secure & Reliable',   desc: cms?.f4_desc || 'Built with best practices.' },
        { icon: cms?.f5_icon || 'fa-code',       gradient: cms?.f5_color || 'linear-gradient(135deg,#4caf50,#2e7d32)', title: cms?.f5_title || 'Clean Code',          desc: cms?.f5_desc || 'Developer-friendly by design.' },
        { icon: cms?.f6_icon || 'fa-magic',      gradient: cms?.f6_color || 'linear-gradient(135deg,#9c27b0,#6a1b9a)', title: cms?.f6_title || 'Smooth Animations',   desc: cms?.f6_desc || 'Delightful micro-interactions.' },
    ];

    return (
        <section id="features">
            <div className="section-header">
                <span className="section-tag">{cms?.tag || '✦ Features'}</span>
                <h2>Everything You <span className="gradient-text">Need</span></h2>
                <p>{cms?.subheading || 'Packed with powerful features.'}</p>
            </div>
            <div className="features-grid">
                {features.map((f, i) => <FeatureCard key={i} {...f} index={i} />)}
            </div>
        </section>
    );
}
