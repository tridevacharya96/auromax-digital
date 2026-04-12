import { useState } from 'react';

export default function Products({ products }) {
    const [filter, setFilter] = useState('all');
    if (!products || products.length === 0) return null;
    const filtered = filter === 'all' ? products : products.filter(p => p.type === filter);

    return (
        <section id="products" style={{ padding:'5rem 2rem', background:'#f8f8f8' }}>
            <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
                <div className="section-header">
                    <span className="section-tag">🛒 Our Products</span>
                    <h2>Explore Our <span className="gradient-text">Collection</span></h2>
                    <p style={{ color:'#8a4a00' }}>Digital & physical products crafted for your needs</p>
                </div>
                <div style={{ display:'flex', justifyContent:'center', gap:'0.75rem', marginBottom:'2.5rem', flexWrap:'wrap' }}>
                    {[{key:'all',label:'All Products'},{key:'digital',label:'Digital'},{key:'physical',label:'Physical'}].map(tab => (
                        <button key={tab.key} onClick={() => setFilter(tab.key)} style={{ padding:'0.6rem 1.5rem', borderRadius:'50px', border: filter===tab.key?'none':'1px solid #e5e5e5', background: filter===tab.key?'linear-gradient(135deg,#cc0000,#f5a800)':'#fff', color: filter===tab.key?'#fff':'#666', fontWeight:700, cursor:'pointer', fontSize:'0.85rem', fontFamily:'inherit' }}>
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1.5rem' }}>
                    {filtered.map(p => (
                        <div key={p.id} style={{ background:'#fff', border:'1px solid #e5e5e5', borderRadius:'16px', padding:'1.5rem', transition:'all 0.3s', boxShadow:'0 4px 16px rgba(0,0,0,0.06)' }}
                            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='#f5a800'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='#e5e5e5'; }}>
                            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.75rem' }}>
                                <span style={{ fontSize:'0.7rem', fontWeight:700, padding:'0.2rem 0.6rem', borderRadius:'50px', background: p.type==='digital'?'rgba(59,130,246,0.1)':'rgba(245,168,0,0.1)', color: p.type==='digital'?'#3b82f6':'#cc4400', textTransform:'uppercase' }}>{p.type}</span>
                                {p.category && <span style={{ fontSize:'0.7rem', color:'#999', background:'#f5f5f5', padding:'0.2rem 0.5rem', borderRadius:'50px' }}>{p.category}</span>}
                            </div>
                            <h3 style={{ color:'#1a1a1a', fontSize:'1rem', fontWeight:700, margin:'0 0 0.5rem' }}>{p.name}</h3>
                            {p.description && <p style={{ color:'#666', fontSize:'0.82rem', margin:'0 0 1rem', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.description}</p>}
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                                <span style={{ fontSize:'1.2rem', fontWeight:900, background:'linear-gradient(135deg,#cc0000,#f5a800)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>₹{p.sale_price || p.price}</span>
                                <button style={{ padding:'0.5rem 1rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'50px', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'0.82rem', fontFamily:'inherit' }}>
                                    {p.type==='digital'?'⬇ Download':'🛒 Add to Cart'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
