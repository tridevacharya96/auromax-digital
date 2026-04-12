import { useState } from 'react';

export default function Podcasts({ videos }) {
    const [playing, setPlaying] = useState(null);
    if (!videos || videos.length === 0) return null;

    return (
        <section id="podcasts" style={{ padding:'5rem 2rem', maxWidth:'1200px', margin:'0 auto' }}>
            <div className="section-header">
                <span className="section-tag">🎙️ Podcasts</span>
                <h2>Latest <span className="gradient-text">Episodes</span></h2>
                <p style={{ color:'#8a4a00' }}>Watch our latest podcast episodes and celebrity interviews</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:'1.5rem' }}>
                {videos.map(v => (
                    <div key={v.id} style={{ background:'#fff', border:'1px solid #e5e5e5', borderRadius:'16px', overflow:'hidden', boxShadow:'0 4px 16px rgba(0,0,0,0.06)', transition:'all 0.3s' }}
                        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='#f5a800'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='#e5e5e5'; }}>
                        <div style={{ position:'relative', aspectRatio:'16/9', background:'#000', cursor:'pointer' }} onClick={() => setPlaying(playing===v.id ? null : v.id)}>
                            {playing === v.id ? (
                                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${v.youtube_id}?autoplay=1`} title={v.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position:'absolute', inset:0 }} />
                            ) : (
                                <>
                                    <img src={`https://img.youtube.com/vi/${v.youtube_id}/maxresdefault.jpg`} alt={v.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => e.target.src=`https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`} />
                                    <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                        <div style={{ width:'60px', height:'60px', borderRadius:'50%', background:'linear-gradient(135deg,#cc0000,#f5a800)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                            <i className="fas fa-play" style={{ color:'#fff', fontSize:'1.3rem', marginLeft:'3px' }} />
                                        </div>
                                    </div>
                                    {v.category && <div style={{ position:'absolute', top:'0.75rem', left:'0.75rem', padding:'0.25rem 0.75rem', background:'rgba(245,168,0,0.95)', borderRadius:'50px', fontSize:'0.7rem', fontWeight:700, color:'#000', textTransform:'uppercase' }}>{v.category}</div>}
                                </>
                            )}
                        </div>
                        <div style={{ padding:'1.25rem' }}>
                            <h3 style={{ color:'#1a1a1a', fontSize:'0.95rem', fontWeight:700, margin:'0 0 0.5rem' }}>{v.title}</h3>
                            {v.description && <p style={{ color:'#666', fontSize:'0.82rem', margin:'0 0 1rem', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{v.description}</p>}
                            <div style={{ display:'flex', gap:'0.75rem' }}>
                                <button onClick={() => setPlaying(playing===v.id ? null : v.id)} style={{ flex:1, padding:'0.6rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'8px', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'0.82rem', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem' }}>
                                    <i className={`fas fa-${playing===v.id?'stop':'play'}`} />{playing===v.id?'Stop':'Watch Now'}
                                </button>
                                <a href={v.youtube_url} target="_blank" rel="noreferrer" style={{ padding:'0.6rem 0.75rem', background:'rgba(204,0,0,0.08)', border:'1px solid rgba(204,0,0,0.2)', borderRadius:'8px', color:'#cc0000', textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                    <i className="fab fa-youtube" />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
