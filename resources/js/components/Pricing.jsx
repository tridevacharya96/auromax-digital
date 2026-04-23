import { useState } from 'react';

function loadRazorpay() {
    return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

function PayButton({ plan, yearly, auth }) {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const amount = yearly ? plan.yearly : plan.monthly;
    const amountINR = Math.round(parseFloat(amount) * 83); // approx USD→INR if prices are in USD

    const handlePay = async () => {
        if (!auth?.user) {
            window.location.href = '/login';
            return;
        }

        setLoading(true);
        setMsg('');

        const loaded = await loadRazorpay();
        if (!loaded) {
            setMsg('Failed to load payment gateway. Check your connection.');
            setLoading(false);
            return;
        }

        try {
            const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const res = await fetch('/payment/razorpay/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    amount:      amountINR,
                    plan_name:   plan.name,
                    plan_period: yearly ? 'yearly' : 'monthly',
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMsg(data.error || 'Something went wrong.');
                setLoading(false);
                return;
            }

            const options = {
                key:         data.key_id,
                amount:      data.amount,
                currency:    data.currency,
                name:        data.name,
                description: data.description,
                order_id:    data.rzp_order_id,
                prefill: {
                    name:    data.user_name,
                    email:   data.user_email,
                    contact: data.user_phone,
                },
                theme: { color: '#f5a800' },
                modal: {
                    ondismiss: () => { setLoading(false); setMsg('Payment cancelled.'); }
                },
                handler: async (response) => {
                    try {
                        const verifyRes = await fetch('/payment/razorpay/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': csrf,
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify({
                                razorpay_order_id:   response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature:  response.razorpay_signature,
                                order_id:            data.order_id,
                            }),
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            setMsg('✅ Payment successful! Order: ' + verifyData.order_number);
                        } else {
                            setMsg('❌ ' + (verifyData.message || 'Payment verification failed.'));
                        }
                    } catch {
                        setMsg('❌ Verification error. Contact support.');
                    }
                    setLoading(false);
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch {
            setMsg('Network error. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handlePay}
                disabled={loading}
                className={`btn ${plan.featured ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
                {loading
                    ? <><i className="fas fa-spinner fa-spin" /> Processing...</>
                    : <><i className="fas fa-bolt" /> {auth?.user ? `Pay ₹${amountINR.toLocaleString('en-IN')}` : 'Get Started'}</>
                }
            </button>
            {msg && (
                <p style={{ marginTop: '0.6rem', fontSize: '0.82rem', textAlign: 'center', color: msg.startsWith('✅') ? '#22c55e' : msg.startsWith('❌') ? '#ef4444' : '#f5a800' }}>
                    {msg}
                </p>
            )}
        </div>
    );
}

export default function Pricing({ cms, auth }) {
    const [yearly, setYearly] = useState(false);

    const plans = [
        {
            name:    cms?.p1_name   || 'Starter',
            monthly: cms?.p1_price  || '9',
            yearly:  cms?.p1_yearly || '7',
            features: [cms?.p1_f1 || '5 Projects', cms?.p1_f2 || '10GB Storage', cms?.p1_f3 || 'Basic Analytics', cms?.p1_f4 || 'Email Support'],
            featured: false,
        },
        {
            name:    cms?.p2_name   || 'Pro',
            monthly: cms?.p2_price  || '29',
            yearly:  cms?.p2_yearly || '23',
            features: [cms?.p2_f1 || 'Unlimited Projects', cms?.p2_f2 || '100GB Storage', cms?.p2_f3 || 'Advanced Analytics', cms?.p2_f4 || 'Priority Support'],
            featured: true,
            badge:   'Most Popular',
        },
        {
            name:    cms?.p3_name   || 'Enterprise',
            monthly: cms?.p3_price  || '79',
            yearly:  cms?.p3_yearly || '63',
            features: [cms?.p3_f1 || 'Unlimited Projects', cms?.p3_f2 || '1TB Storage', cms?.p3_f3 || 'Custom Analytics', cms?.p3_f4 || '24/7 Support'],
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
                        <PayButton plan={plan} yearly={yearly} auth={auth} />
                    </div>
                ))}
            </div>
        </section>
    );
}