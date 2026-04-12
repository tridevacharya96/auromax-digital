export default function Bestsellers({ products }) {
    if (!products || products.length === 0) return null;
    return (
        <section id="bestsellers" style={{ padding:'5rem 2rem', maxWidth:'1200px', margin:'0 auto' }}>
            <div className="section-header">
                <span className="section-tag">🔥 Bestsellers</span>
                <h2>Our <span className="gradient-text">Top Picks</span></h2>
                <p style={{ color:'#8a4a00' }}>Most loved products by our community</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.5rem' }}>
                {products.map(p => (
                    <div key={p.id} style={{ background:'#fff', border:'1px solid #e5e5e5', borderRadius:'16px', overflow:'hidden', transition:'all 0.3s', boxShadow:'0 4px 16px rgba(0,0,0,0.06)' }}
                        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.borderColor='#f5a800'; e.currentTarget.style.boxShadow='0 20px 40px rgba(245,168,0,0.15)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='#e5e5e5'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.06)'; }}>
                        <div style={{ background:'linear-gradient(135deg,#cc0000,#f5a800)', padding:'0.3rem 0.75rem', display:'inline-block', borderRadius:'0 0 12px 0', fontSize:'0.7rem', fontWeight:700, color:'#fff' }}>🔥 BESTSELLER</div>
                        <div style={{ padding:'1.25rem' }}>
                            <span style={{ fontSize:'0.7rem', fontWeight:700, padding:'0.2rem 0.6rem', borderRadius:'50px', background: p.type==='digital'?'rgba(59,130,246,0.1)':'rgba(245,168,0,0.1)', color: p.type==='digital'?'#3b82f6':'#cc4400', textTransform:'uppercase' }}>{p.type}</span>
                            <h3 style={{ color:'#1a1a1a', fontSize:'1.05rem', fontWeight:700, margin:'0.75rem 0 0.5rem' }}>{p.name}</h3>
                            {p.description && <p style={{ color:'#666', fontSize:'0.85rem', margin:'0 0 1rem', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.description}</p>}
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                                <span style={{ fontSize:'1.3rem', fontWeight:900, background:'linear-gradient(135deg,#cc0000,#f5a800)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>₹{p.sale_price || p.price}</span>
                                <button style={{ padding:'0.5rem 1.25rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'50px', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'0.85rem', fontFamily:'inherit' }}>Buy Now</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
