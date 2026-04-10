import { useState } from 'react';

const PLANS = [
    {
        name: 'Starter',
        monthly: 9,
        yearly: 7,
        features: [
            { label: '5 Projects', included: true },
            { label: '10GB Storage', included: true },
            { label: 'Basic Analytics', included: true },
            { label: 'Email Support', included: true },
            { label: 'Custom Domain', included: false },
            { label: 'Priority Support', included: false },
        ],
        cta: 'Get Started',
        featured: false,
    },
    {
        name: 'Pro',
        monthly: 29,
        yearly: 23,
        features: [
            { label: 'Unlimited Projects', included: true },
            { label: '100GB Storage', included: true },
            { label: 'Advanced Analytics', included: true },
            { label: 'Priority Support', included: true },
            { label: 'Custom Domain', included: true },
            { label: 'White Label', included: false },
        ],
        cta: 'Get Started',
        featured: true,
        badge: 'Most Popular',
    },
    {
        name: 'Enterprise',
        monthly: 79,
        yearly: 63,
        features: [
            { label: 'Unlimited Projects', included: true },
            { label: '1TB Storage', included: true },
            { label: 'Custom Analytics', included: true },
            { label: '24/7 Support', included: true },
            { label: 'Custom Domain', included: true },
            { label: 'White Label', included: true },
        ],
        cta: 'Get Started',
        featured: false,
    },
];

export default function Pricing() {
    const [yearly, setYearly] = useState(false);

    return (
        <section id="pricing">
            <div className="section-header">
                <span className="section-tag">✦ Pricing</span>
                <h2>Simple <span className="gradient-text">Pricing</span></h2>
                <p>Choose the plan that works best for you. No hidden fees.</p>
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
                {PLANS.map(plan => (
                    <div key={plan.name} className={`pricing-card${plan.featured ? ' featured' : ''}`}>
                        {plan.badge && <div className="popular-badge">{plan.badge}</div>}
                        <div className="plan-name">{plan.name}</div>
                        <div className="plan-price">
                            <span className="currency">$</span>
                            <span className="amount">{yearly ? plan.yearly : plan.monthly}</span>
                            <span className="period">/mo</span>
                        </div>
                        <ul className="plan-features">
                            {plan.features.map(f => (
                                <li key={f.label} className={f.included ? '' : 'disabled'}>
                                    <i className={`fas fa-${f.included ? 'check' : 'times'}`} />
                                    {f.label}
                                </li>
                            ))}
                        </ul>
                        <a
                            href="#contact"
                            className={`btn ${plan.featured ? 'btn-primary' : 'btn-outline'}`}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            {plan.cta}
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
}
