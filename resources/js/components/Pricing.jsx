import { useState } from 'react';

export default function Pricing({ cms }) {
    const [yearly, setYearly] = useState(false);

    const plans = [
        {
            name:     cms?.p1_name   || 'Starter',
            monthly:  cms?.p1_price  || '9',
            yearly:   cms?.p1_yearly || '7',
            features: [cms?.p1_f1||'5 Projects', cms?.p1_f2||'10GB Storage', cms?.p1_f3||'Basic Analytics', cms?.p1_f4||'Email Support'],
            featured: false,
        },
        {
            name:     cms?.p2_name   || 'Pro',
            monthly:  cms?.p2_price  || '29',
            yearly:   cms?.p2_yearly || '23',
            features: [cms?.p2_f1||'Unlimited Projects', cms?.p2_f2||'100GB Storage', cms?.p2_f3||'Advanced Analytics', cms?.p2_f4||'Priority Support'],
            featured: true,
            badge:    'Most Popular',
        },
        {
            name:     cms?.p3_name   || 'Enterprise',
            monthly:  cms?.p3_price  || '79',
            yearly:   cms?.p3_yearly || '63',
            features: [cms?.p3_f1||'Unlimited Projects', cms?.p3_f2||'1TB Storage', cms?.p3_f3||'Custom Analytics', cms?.p3_f4||'24/7 Support'],
            featured: false,
        },
    ];

    return (
        <section id="pricing">
            <div className="section-header">
                <span className="section-tag">{cms?.tag || '✦ Pricing'}</span>
                <h2>{cms?.heading || 'Simple'} <span className="gradient-text">Pricing</span></h2>
                <p>{cms?.subheading || 'Choose the plan that works best for you.'}</p>
            </div>
            <div className="pricing-toggle">
                <span>Monthly</span>
                <label className="toggle-switch">
                    <input type="checkbox" checked={yearly} onChange={() => setYearly(y => !y)} />
                    <span className="slider" />
                </label>
                <span>Yearly <span className="save-badge">Save 20%</span></span>
            </div>
            <div className="pricing-grid">
                {plans.map(plan => (
                    <div key={plan.name} className={`pricing-card${plan.featured ? ' featured' : ''}`}>
                        {plan.badge && <div className="popular-badge">{plan.badge}</div>}
                        <div className="plan-name">{plan.name}</div>
                        <div className="plan-price">
                            <span className="currency">$</span>
                            <span className="amount">{yearly ? plan.yearly : plan.monthly}</span>
                            <span className="period">/mo</span>
                        </div>
                        <ul className="plan-features">
                            {plan.features.map((f, i) => (
                                <li key={i}><i className="fas fa-check" />{f}</li>
                            ))}
                        </ul>
                        <a href="#contact" className={`btn ${plan.featured ? 'btn-primary' : 'btn-outline'}`} style={{ width:'100%', justifyContent:'center' }}>
                            Get Started
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
}
