import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from './Layout';

export default function Celebrities({ celebrities, admin }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileRef = useRef(null);
    const [form, setForm] = useState({ name:'', profession:'', bio:'', spotify_url:'', instagram_url:'', youtube_url:'', is_featured:false, is_active:true, order:0 });

    const reset = () => {
        setForm({ name:'', profession:'', bio:'', spotify_url:'', instagram_url:'', youtube_url:'', is_featured:false, is_active:true, order:0 });
        setEditing(null); setShowForm(false); setPreview(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    const submit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(form).forEach(([k,v]) => data.append(k, v));
        if (fileRef.current?.files[0]) data.append('photo', fileRef.current.files[0]);

        if (editing) {
            data.append('_method', 'PUT');
            router.post(`/admin/celebrities/${editing.id}`, data, { onSuccess: reset, forceFormData: true });
        } else {
            router.post('/admin/celebrities', data, { onSuccess: reset, forceFormData: true });
        }
    };

    const editCelebrity = (c) => {
        setEditing(c);
        setForm({ name:c.name, profession:c.profession, bio:c.bio||'', spotify_url:c.spotify_url||'', instagram_url:c.instagram_url||'', youtube_url:c.youtube_url||'', is_featured:c.is_featured, is_active:c.is_active, order:c.order||0 });
        setPreview(c.photo || null);
        setShowForm(true);
    };

    const inp = { width:'100%', padding:'0.75rem 1rem', background:'#1a1a1a', border:'1.5px solid #2a2a2a', borderRadius:'8px', color:'#fff', fontSize:'0.9rem', outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

    return (
        <AdminLayout admin={admin} active="celebrities">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
                <div>
                    <h1 style={{ color:'#fff', fontSize:'1.5rem', fontWeight:800, margin:0 }}>Celebrity Guests</h1>
                    <p style={{ color:'#666', margin:0, fontSize:'0.85rem' }}>{celebrities.total} celebrities — shown on homepage</p>
                </div>
                <button onClick={() => { reset(); setShowForm(true); }} style={{ padding:'0.75rem 1.5rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color:'#fff', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:'0.5rem', fontFamily:'inherit' }}>
                    <i className="fas fa-plus" /> Add Celebrity
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
                    <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.2)', borderRadius:'16px', padding:'2rem', width:'100%', maxWidth:'620px', maxHeight:'92vh', overflowY:'auto' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                            <h2 style={{ color:'#fff', fontWeight:800, margin:0 }}>{editing ? 'Edit Celebrity' : 'Add Celebrity Guest'}</h2>
                            <button onClick={reset} style={{ background:'none', border:'none', color:'#666', cursor:'pointer', fontSize:'1.2rem' }}><i className="fas fa-times" /></button>
                        </div>
                        <form onSubmit={submit}>
                            {/* Photo Upload */}
                            <div style={{ marginBottom:'1.5rem', textAlign:'center' }}>
                                <div style={{ width:'120px', height:'120px', borderRadius:'50%', border:'3px dashed rgba(245,168,0,0.3)', margin:'0 auto 1rem', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', background:'#1a1a1a', cursor:'pointer' }}
                                    onClick={() => fileRef.current?.click()}>
                                    {preview ? (
                                        <img src={preview} alt="Preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                                    ) : (
                                        <div style={{ textAlign:'center' }}>
                                            <i className="fas fa-camera" style={{ color:'#f5a800', fontSize:'1.5rem', display:'block', marginBottom:'0.25rem' }} />
                                            <span style={{ color:'#555', fontSize:'0.7rem' }}>Upload Photo</span>
                                        </div>
                                    )}
                                </div>
                                <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }}
                                    onChange={e => {
                                        const file = e.target.files[0];
                                        if (file) setPreview(URL.createObjectURL(file));
                                    }} />
                                <button type="button" onClick={() => fileRef.current?.click()} style={{ padding:'0.4rem 1rem', background:'rgba(245,168,0,0.1)', border:'1px solid rgba(245,168,0,0.3)', borderRadius:'8px', color:'#f5a800', cursor:'pointer', fontSize:'0.8rem', fontFamily:'inherit' }}>
                                    {preview ? 'Change Photo' : 'Upload Photo'}
                                </button>
                            </div>

                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                                <div>
                                    <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Name *</label>
                                    <input style={inp} value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} required placeholder="e.g. Arijit Singh" />
                                </div>
                                <div>
                                    <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Profession *</label>
                                    <input style={inp} value={form.profession} onChange={e => setForm(f=>({...f,profession:e.target.value}))} required placeholder="e.g. Bollywood Singer" />
                                </div>
                            </div>
                            <div style={{ marginBottom:'1rem' }}>
                                <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Bio</label>
                                <textarea style={{...inp, minHeight:'70px', resize:'vertical'}} value={form.bio} onChange={e => setForm(f=>({...f,bio:e.target.value}))} placeholder="Short bio..." />
                            </div>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                                <div>
                                    <label style={{ color:'#1db954', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>
                                        <i className="fab fa-spotify" style={{ marginRight:'0.3rem' }} />Spotify Profile URL
                                    </label>
                                    <input style={inp} value={form.spotify_url} onChange={e => setForm(f=>({...f,spotify_url:e.target.value}))} placeholder="https://open.spotify.com/artist/..." />
                                </div>
                                <div>
                                    <label style={{ color:'#e1306c', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>
                                        <i className="fab fa-instagram" style={{ marginRight:'0.3rem' }} />Instagram URL
                                    </label>
                                    <input style={inp} value={form.instagram_url} onChange={e => setForm(f=>({...f,instagram_url:e.target.value}))} placeholder="https://instagram.com/..." />
                                </div>
                            </div>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                                <div>
                                    <label style={{ color:'#cc0000', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>
                                        <i className="fab fa-youtube" style={{ marginRight:'0.3rem' }} />YouTube URL
                                    </label>
                                    <input style={inp} value={form.youtube_url} onChange={e => setForm(f=>({...f,youtube_url:e.target.value}))} placeholder="https://youtube.com/..." />
                                </div>
                                <div>
                                    <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Display Order</label>
                                    <input style={inp} type="number" value={form.order} onChange={e => setForm(f=>({...f,order:e.target.value}))} />
                                </div>
                            </div>
                            <div style={{ display:'flex', gap:'1.5rem', marginBottom:'1.5rem' }}>
                                <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer' }}>
                                    <input type="checkbox" checked={form.is_active} onChange={e => setForm(f=>({...f,is_active:e.target.checked}))} style={{ accentColor:'#f5a800', width:'16px', height:'16px' }} />
                                    <span style={{ color:'#aaa', fontSize:'0.85rem' }}>Active</span>
                                </label>
                                <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer' }}>
                                    <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f=>({...f,is_featured:e.target.checked}))} style={{ accentColor:'#f5a800', width:'16px', height:'16px' }} />
                                    <span style={{ color:'#aaa', fontSize:'0.85rem' }}>Featured</span>
                                </label>
                            </div>
                            <div style={{ display:'flex', gap:'1rem' }}>
                                <button type="submit" style={{ flex:1, padding:'0.85rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color:'#fff', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                                    <i className="fas fa-save" style={{ marginRight:'0.5rem' }} />{editing ? 'Update Celebrity' : 'Add Celebrity'}
                                </button>
                                <button type="button" onClick={reset} style={{ padding:'0.85rem 1.5rem', background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'10px', color:'#aaa', cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Celebrities Grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1.5rem' }}>
                {celebrities.data?.length > 0 ? celebrities.data.map(c => (
                    <div key={c.id} style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', overflow:'hidden', textAlign:'center', padding:'1.5rem', transition:'transform 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
                        onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                        {/* Photo */}
                        <div style={{ width:'90px', height:'90px', borderRadius:'50%', margin:'0 auto 1rem', overflow:'hidden', border:'3px solid rgba(245,168,0,0.3)', background:'#1a1a1a', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            {c.photo ? (
                                <img src={c.photo} alt={c.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                            ) : (
                                <i className="fas fa-user" style={{ color:'#f5a800', fontSize:'2rem' }} />
                            )}
                        </div>
                        <h3 style={{ color:'#fff', fontSize:'1rem', fontWeight:700, margin:'0 0 0.25rem' }}>{c.name}</h3>
                        <p style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, margin:'0 0 0.75rem' }}>{c.profession}</p>
                        {c.is_featured && <span style={{ fontSize:'0.7rem', color:'#f5a800', background:'rgba(245,168,0,0.1)', padding:'0.15rem 0.5rem', borderRadius:'50px', display:'inline-block', marginBottom:'0.75rem' }}>⭐ Featured</span>}

                        {/* Social Links */}
                        <div style={{ display:'flex', justifyContent:'center', gap:'0.5rem', marginBottom:'1rem' }}>
                            {c.spotify_url && <a href={c.spotify_url} target="_blank" rel="noreferrer" style={{ width:'30px', height:'30px', borderRadius:'50%', background:'rgba(29,185,84,0.15)', border:'1px solid rgba(29,185,84,0.3)', display:'flex', alignItems:'center', justifyContent:'center', color:'#1db954', fontSize:'0.75rem', textDecoration:'none' }}><i className="fab fa-spotify" /></a>}
                            {c.instagram_url && <a href={c.instagram_url} target="_blank" rel="noreferrer" style={{ width:'30px', height:'30px', borderRadius:'50%', background:'rgba(225,48,108,0.15)', border:'1px solid rgba(225,48,108,0.3)', display:'flex', alignItems:'center', justifyContent:'center', color:'#e1306c', fontSize:'0.75rem', textDecoration:'none' }}><i className="fab fa-instagram" /></a>}
                            {c.youtube_url && <a href={c.youtube_url} target="_blank" rel="noreferrer" style={{ width:'30px', height:'30px', borderRadius:'50%', background:'rgba(204,0,0,0.15)', border:'1px solid rgba(204,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', color:'#cc0000', fontSize:'0.75rem', textDecoration:'none' }}><i className="fab fa-youtube" /></a>}
                        </div>

                        <div style={{ display:'flex', gap:'0.5rem' }}>
                            <button onClick={() => editCelebrity(c)} style={{ flex:1, padding:'0.5rem', background:'rgba(245,168,0,0.1)', border:'1px solid rgba(245,168,0,0.3)', borderRadius:'8px', color:'#f5a800', cursor:'pointer', fontSize:'0.8rem', fontFamily:'inherit', fontWeight:600 }}>
                                <i className="fas fa-edit" style={{ marginRight:'0.3rem' }} />Edit
                            </button>
                            <button onClick={() => { if(confirm('Delete?')) router.delete(`/admin/celebrities/${c.id}`); }} style={{ padding:'0.5rem 0.75rem', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'8px', color:'#ef4444', cursor:'pointer', fontSize:'0.8rem', fontFamily:'inherit' }}>
                                <i className="fas fa-trash" />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div style={{ gridColumn:'1/-1', padding:'4rem', textAlign:'center', color:'#333', background:'#111', borderRadius:'16px', border:'1px solid rgba(245,168,0,0.15)' }}>
                        <i className="fas fa-star" style={{ fontSize:'3rem', display:'block', marginBottom:'1rem', color:'#f5a800' }} />
                        <p style={{ margin:0, fontSize:'1rem', color:'#555' }}>No celebrity guests yet. Add your first one!</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
