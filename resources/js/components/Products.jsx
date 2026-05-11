import { useState } from 'react';

function loadRazorpay() {
    return new Promise(resolve => {
        if (window.Razorpay) return resolve(true);
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
    });
}

function WishModal({ product, onClose }) {
    const [step, setStep]       = useState(1); // 1=form, 2=samples, 3=success
    const [loading, setLoading] = useState(false);
    const [msg, setMsg]         = useState('');
    const [orderNum, setOrderNum] = useState('');
    const [form, setForm]       = useState({
        recipient_name: '', occasion: '', custom_message: '',
        from_name: '', contact_email: '', contact_phone: '',
    });
    const [showSamples, setShowSamples] = useState(false);

    const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const handlePay = async (e) => {
        e.preventDefault();
        setLoading(true); setMsg('');

        const loaded = await loadRazorpay();
        if (!loaded) { setMsg('Failed to load payment gateway.'); setLoading(false); return; }

        try {
            const res = await fetch('/celebrity-wish/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, 'Accept': 'application/json' },
                body: JSON.stringify({ product_id: product.id, ...form }),
            });
            const data = await res.json();
            if (!res.ok) { setMsg(data.error || 'Something went wrong.'); setLoading(false); return; }

            const options = {
                key: data.key_id, amount: data.amount, currency: data.currency,
                name: data.name, description: data.description,
                order_id: data.rzp_order_id,
                prefill: { name: data.user_name, email: data.user_email, contact: data.user_phone },
                theme: { color: '#ff5722' },
                modal: { ondismiss: () => { setLoading(false); setMsg('Payment cancelled.'); } },
                handler: async (response) => {
                    const vRes = await fetch('/celebrity-wish/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, 'Accept': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id:   response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature:  response.razorpay_signature,
                            booking_id:          data.booking_id,
                        }),
                    });
                    const vData = await vRes.json();
                    if (vData.success) { setOrderNum(vData.order_number); setStep(3); }
                    else setMsg('❌ ' + (vData.message || 'Verification failed.'));
                    setLoading(false);
                },
            };
            new window.Razorpay(options).open();
        } catch { setMsg('Network error. Please try again.'); setLoading(false); }
    };

    const occasions = ['Birthday', 'Anniversary', 'Wedding', 'Graduation', 'Get Well Soon', 'Congratulations', 'Festival Wishes', 'Other'];
    const price = product.sale_price || product.price;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg,#cc0000,#ff5722)', padding: '1.5rem', borderRadius: '20px 20px 0 0', position: 'relative' }}>
                    <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {product.celebrity_photo_url && (
                            <img src={product.celebrity_photo_url} alt={product.celebrity_name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.5)' }} />
                        )}
                        <div>
                            <h3 style={{ color: '#fff', margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Book a Wish from {product.celebrity_name}</h3>
                            <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.85rem' }}>Delivered in {product.delivery_days || 3} days • ₹{Number(price).toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    {step === 1 && (
                        <>
                            {/* Sample videos toggle */}
                            {product.sample_videos?.length > 0 && (
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <button onClick={() => setShowSamples(s => !s)} style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,87,34,0.08)', border: '1px solid rgba(255,87,34,0.3)', borderRadius: '10px', color: '#ff5722', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' }}>
                                        <i className="fas fa-play-circle" style={{ marginRight: '0.5rem' }} />
                                        {showSamples ? 'Hide' : 'View'} Sample Videos ({product.sample_videos.length})
                                    </button>
                                    {showSamples && (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
                                            {product.sample_videos.map((vid, i) => (
                                                <a key={i} href={`https://youtube.com/watch?v=${vid}`} target="_blank" rel="noreferrer" style={{ display: 'block', borderRadius: '10px', overflow: 'hidden', position: 'relative', aspectRatio: '16/9', textDecoration: 'none' }}>
                                                    <img src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`} alt={`Sample ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <i className="fas fa-play" style={{ color: '#fff', fontSize: '1.5rem' }} />
                                                    </div>
                                                    <span style={{ position: 'absolute', bottom: '0.4rem', left: '0.4rem', color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>Sample {i+1}</span>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <form onSubmit={handlePay}>
                                {[
                                    { label: "Recipient's Name *", key: 'recipient_name', placeholder: "Who is this wish for?" },
                                    { label: "Your Name *",        key: 'from_name',       placeholder: "Your name" },
                                    { label: "Your Email *",       key: 'contact_email',   placeholder: "your@email.com", type: 'email' },
                                    { label: "Phone (optional)",   key: 'contact_phone',   placeholder: "+91 9876543210" },
                                ].map(f => (
                                    <div key={f.key} style={{ marginBottom: '1rem' }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#444', display: 'block', marginBottom: '0.3rem' }}>{f.label}</label>
                                        <input
                                            type={f.type || 'text'}
                                            value={form[f.key]}
                                            onChange={e => setForm(fm => ({ ...fm, [f.key]: e.target.value }))}
                                            required={!f.label.includes('optional')}
                                            placeholder={f.placeholder}
                                            style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e5e5e5', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                ))}

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#444', display: 'block', marginBottom: '0.3rem' }}>Occasion *</label>
                                    <select value={form.occasion} onChange={e => setForm(f => ({ ...f, occasion: e.target.value }))} required style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e5e5e5', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', background: '#fff' }}>
                                        <option value="">Select occasion...</option>
                                        {occasions.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>

                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#444', display: 'block', marginBottom: '0.3rem' }}>
                                        Custom Message * <span style={{ color: '#aaa', fontWeight: 400 }}>({form.custom_message.length}/1000)</span>
                                    </label>
                                    <textarea
                                        value={form.custom_message}
                                        onChange={e => setForm(f => ({ ...f, custom_message: e.target.value }))}
                                        required maxLength={1000} rows={4}
                                        placeholder="Write what you'd like the celebrity to say — be specific! Include names, memories, or special wishes..."
                                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e5e5e5', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                                    />
                                </div>

                                {msg && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{msg}</p>}

                                <button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', background: loading ? '#ccc' : 'linear-gradient(135deg,#cc0000,#ff5722)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                                    {loading
                                        ? <><i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }} />Processing...</>
                                        : <><i className="fas fa-heart" style={{ marginRight: '0.5rem' }} />Pay ₹{Number(price).toLocaleString('en-IN')} & Book Now</>
                                    }
                                </button>
                                <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.75rem', marginTop: '0.75rem' }}>
                                    <i className="fas fa-lock" style={{ marginRight: '0.3rem' }} />Secured by Razorpay • Delivered in {product.delivery_days || 3} working days
                                </p>
                            </form>
                        </>
                    )}

                    {step === 3 && (
                        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem', color: '#fff' }}>✓</div>
                            <h3 style={{ color: '#1a1a1a', fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Booking Confirmed! 🎉</h3>
                            <p style={{ color: '#666', marginBottom: '0.5rem' }}>Order: <strong style={{ color: '#ff5722' }}>{orderNum}</strong></p>
                            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                Your celebrity wish from <strong>{product.celebrity_name}</strong> is being processed.<br />
                                You'll receive it within <strong>{product.delivery_days || 3} working days</strong> on your email.
                            </p>
                            <button onClick={onClose} style={{ padding: '0.85rem 2rem', background: 'linear-gradient(135deg,#cc0000,#ff5722)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Done</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Products({ products }) {
    const [filter, setFilter]       = useState('all');
    const [wishProduct, setWishProduct] = useState(null);

    if (!products || products.length === 0) return null;

    const filtered = filter === 'all' ? products : filter === 'wish'
        ? products.filter(p => p.is_celebrity_wish)
        : products.filter(p => p.type === filter);

    return (
        <section id="products" style={{ padding: '5rem 2rem', background: '#f8f8f8' }}>
            {wishProduct && <WishModal product={wishProduct} onClose={() => setWishProduct(null)} />}

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="section-header">
                    <span className="section-tag">🛒 Our Products</span>
                    <h2>Explore Our <span className="gradient-text">Collection</span></h2>
                    <p style={{ color: '#555' }}>Digital & physical products crafted for your needs</p>
                </div>

                {/* Filter tabs */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                    {[
                        { key: 'all',      label: 'All Products' },
                        { key: 'digital',  label: 'Digital' },
                        { key: 'physical', label: 'Physical' },
                        { key: 'wish',     label: '⭐ Celebrity Wishes' },
                    ].map(tab => (
                        <button key={tab.key} onClick={() => setFilter(tab.key)} style={{ padding: '0.6rem 1.5rem', borderRadius: '50px', border: filter === tab.key ? 'none' : '1px solid #e5e5e5', background: filter === tab.key ? 'linear-gradient(135deg,#cc0000,#ff5722)' : '#fff', color: filter === tab.key ? '#fff' : '#666', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Product grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.5rem' }}>
                    {filtered.map(p => {
                        const isWish = p.is_celebrity_wish;
                        const price  = p.sale_price || p.price;

                        return (
                            <div key={p.id}
                                style={{ background: '#fff', border: `1px solid ${isWish ? 'rgba(255,87,34,0.3)' : '#e5e5e5'}`, borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s', boxShadow: isWish ? '0 4px 24px rgba(255,87,34,0.12)' : '0 4px 16px rgba(0,0,0,0.06)' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = isWish ? '#ff5722' : '#f5a800'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = isWish ? 'rgba(255,87,34,0.3)' : '#e5e5e5'; }}
                            >
                                {/* Celebrity photo */}
                                {isWish && p.celebrity_photo_url && (
                                    <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                                        <img src={p.celebrity_photo_url} alt={p.celebrity_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
                                        <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem' }}>
                                            <span style={{ background: 'linear-gradient(135deg,#cc0000,#ff5722)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '50px' }}>⭐ Celebrity Wish</span>
                                        </div>
                                        {p.sample_videos?.length > 0 && (
                                            <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '50px' }}>
                                                <i className="fas fa-play" style={{ marginRight: '0.3rem' }} />{p.sample_videos.length} Samples
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Product image for non-wish */}
                                {!isWish && p.image_url && (
                                    <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                                        <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}

                                <div style={{ padding: '1.25rem' }}>
                                    {/* Tags */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '50px', background: p.type === 'digital' ? 'rgba(59,130,246,0.1)' : 'rgba(245,168,0,0.1)', color: p.type === 'digital' ? '#3b82f6' : '#cc4400', textTransform: 'uppercase' }}>{p.type}</span>
                                        {p.category && <span style={{ fontSize: '0.7rem', color: '#999', background: '#f5f5f5', padding: '0.2rem 0.5rem', borderRadius: '50px' }}>{p.category}</span>}
                                    </div>

                                    {isWish && p.celebrity_name && (
                                        <p style={{ color: '#ff5722', fontSize: '0.8rem', fontWeight: 700, margin: '0 0 0.25rem' }}>by {p.celebrity_name}</p>
                                    )}

                                    <h3 style={{ color: '#1a1a1a', fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>{p.name}</h3>

                                    {p.description && (
                                        <p style={{ color: '#666', fontSize: '0.82rem', margin: '0 0 0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
                                    )}

                                    {isWish && (
                                        <p style={{ color: '#888', fontSize: '0.78rem', margin: '0 0 0.75rem' }}>
                                            <i className="fas fa-clock" style={{ marginRight: '0.3rem', color: '#ff5722' }} />
                                            Delivered in {p.delivery_days || 3} working days
                                        </p>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                                        <div>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 900, background: 'linear-gradient(135deg,#cc0000,#ff5722)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                                ₹{Number(price).toLocaleString('en-IN')}
                                            </span>
                                            {p.sale_price && p.price > p.sale_price && (
                                                <span style={{ fontSize: '0.8rem', color: '#aaa', textDecoration: 'line-through', marginLeft: '0.4rem' }}>₹{Number(p.price).toLocaleString('en-IN')}</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => isWish && setWishProduct(p)}
                                            style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg,#cc0000,#ff5722)', border: 'none', borderRadius: '50px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                                        >
                                            {isWish ? '🎬 Book Now' : p.type === 'digital' ? '⬇ Download' : '🛒 Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}