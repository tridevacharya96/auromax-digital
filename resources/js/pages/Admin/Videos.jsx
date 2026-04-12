import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from './Layout';

export default function Videos({ videos, admin }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title:'', description:'', youtube_url:'', category:'', order:0, is_active:true });

    const reset = () => { setForm({ title:'', description:'', youtube_url:'', category:'', order:0, is_active:true }); setEditing(null); setShowForm(false); };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            router.put(`/admin/videos/${editing.id}`, form, { onSuccess: reset });
        } else {
            router.post('/admin/videos', form, { onSuccess: reset });
        }
    };

    const editVideo = (v) => {
        setEditing(v);
        setForm({ title:v.title, description:v.description||'', youtube_url:v.youtube_url, category:v.category||'', order:v.order||0, is_active:v.is_active });
        setShowForm(true);
    };

    const inp = { width:'100%', padding:'0.75rem 1rem', background:'#1a1a1a', border:'1.5px solid #2a2a2a', borderRadius:'8px', color:'#fff', fontSize:'0.9rem', outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

    const getYoutubeId = (url) => {
        const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    };

    return (
        <AdminLayout admin={admin} active="videos">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
                <div>
                    <h1 style={{ color:'#fff', fontSize:'1.5rem', fontWeight:800, margin:0 }}>Podcast Videos</h1>
                    <p style={{ color:'#666', margin:0, fontSize:'0.85rem' }}>{videos.total} videos — displayed on homepage podcast section</p>
                </div>
                <button onClick={() => { reset(); setShowForm(true); }} style={{ padding:'0.75rem 1.5rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color:'#fff', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:'0.5rem', fontFamily:'inherit' }}>
                    <i className="fas fa-plus" /> Add Video
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
                    <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.2)', borderRadius:'16px', padding:'2rem', width:'100%', maxWidth:'600px', maxHeight:'90vh', overflowY:'auto' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                            <h2 style={{ color:'#fff', fontWeight:800, margin:0 }}>{editing ? 'Edit Video' : 'Add YouTube Video'}</h2>
                            <button onClick={reset} style={{ background:'none', border:'none', color:'#666', cursor:'pointer', fontSize:'1.2rem' }}><i className="fas fa-times" /></button>
                        </div>

                        {/* Preview */}
                        {form.youtube_url && getYoutubeId(form.youtube_url) && (
                            <div style={{ marginBottom:'1.5rem', borderRadius:'12px', overflow:'hidden', aspectRatio:'16/9' }}>
                                <img
                                    src={`https://img.youtube.com/vi/${getYoutubeId(form.youtube_url)}/maxresdefault.jpg`}
                                    alt="Preview"
                                    style={{ width:'100%', height:'100%', objectFit:'cover' }}
                                    onError={e => e.target.src=`https://img.youtube.com/vi/${getYoutubeId(form.youtube_url)}/hqdefault.jpg`}
                                />
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div style={{ marginBottom:'1rem' }}>
                                <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>YouTube URL *</label>
                                <input style={inp} value={form.youtube_url} onChange={e => setForm(f=>({...f,youtube_url:e.target.value}))} required placeholder="https://www.youtube.com/watch?v=..." />
                                <p style={{ color:'#555', fontSize:'0.75rem', marginTop:'0.3rem' }}>Supports: youtube.com/watch?v=, youtu.be/, shorts/</p>
                            </div>
                            <div style={{ marginBottom:'1rem' }}>
                                <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Title *</label>
                                <input style={inp} value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} required placeholder="Episode title..." />
                            </div>
                            <div style={{ marginBottom:'1rem' }}>
                                <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Description</label>
                                <textarea style={{...inp, minHeight:'80px', resize:'vertical'}} value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="Episode description..." />
                            </div>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                                <div>
                                    <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Category</label>
                                    <select style={inp} value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}>
                                        <option value="">Select Category</option>
                                        <option value="podcast">Podcast</option>
                                        <option value="interview">Interview</option>
                                        <option value="celebrity">Celebrity</option>
                                        <option value="business">Business</option>
                                        <option value="entertainment">Entertainment</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Display Order</label>
                                    <input style={inp} type="number" value={form.order} onChange={e => setForm(f=>({...f,order:e.target.value}))} placeholder="0" />
                                </div>
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.5rem' }}>
                                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f=>({...f,is_active:e.target.checked}))} style={{ accentColor:'#f5a800', width:'16px', height:'16px' }} />
                                <label style={{ color:'#aaa', fontSize:'0.85rem' }}>Show on website</label>
                            </div>
                            <div style={{ display:'flex', gap:'1rem' }}>
                                <button type="submit" style={{ flex:1, padding:'0.85rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color:'#fff', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                                    <i className="fas fa-save" style={{ marginRight:'0.5rem' }} />{editing ? 'Update Video' : 'Add Video'}
                                </button>
                                <button type="button" onClick={reset} style={{ padding:'0.85rem 1.5rem', background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'10px', color:'#aaa', cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Videos Grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.5rem' }}>
                {videos.data?.length > 0 ? videos.data.map(v => (
                    <div key={v.id} style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', overflow:'hidden', transition:'transform 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
                        onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                        {/* Thumbnail */}
                        <div style={{ position:'relative', aspectRatio:'16/9' }}>
                            <img
                                src={`https://img.youtube.com/vi/${v.youtube_id}/maxresdefault.jpg`}
                                alt={v.title}
                                style={{ width:'100%', height:'100%', objectFit:'cover' }}
                                onError={e => e.target.src=`https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`}
                            />
                            <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <a href={v.youtube_url} target="_blank" rel="noreferrer" style={{ width:'50px', height:'50px', borderRadius:'50%', background:'rgba(204,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'1.2rem', textDecoration:'none' }}>
                                    <i className="fas fa-play" style={{ marginLeft:'3px' }} />
                                </a>
                            </div>
                            {v.category && (
                                <div style={{ position:'absolute', top:'0.5rem', left:'0.5rem', padding:'0.2rem 0.6rem', background:'rgba(245,168,0,0.9)', borderRadius:'50px', fontSize:'0.7rem', fontWeight:700, color:'#000', textTransform:'uppercase' }}>
                                    {v.category}
                                </div>
                            )}
                            {!v.is_active && (
                                <div style={{ position:'absolute', top:'0.5rem', right:'0.5rem', padding:'0.2rem 0.6rem', background:'rgba(239,68,68,0.9)', borderRadius:'50px', fontSize:'0.7rem', fontWeight:700, color:'#fff' }}>
                                    Hidden
                                </div>
                            )}
                        </div>
                        {/* Info */}
                        <div style={{ padding:'1rem' }}>
                            <h3 style={{ color:'#fff', fontSize:'0.95rem', fontWeight:700, margin:'0 0 0.5rem', lineHeight:'1.4' }}>{v.title}</h3>
                            {v.description && <p style={{ color:'#666', fontSize:'0.8rem', margin:'0 0 1rem', lineHeight:'1.5', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{v.description}</p>}
                            <div style={{ display:'flex', gap:'0.5rem' }}>
                                <button onClick={() => editVideo(v)} style={{ flex:1, padding:'0.5rem', background:'rgba(245,168,0,0.1)', border:'1px solid rgba(245,168,0,0.3)', borderRadius:'8px', color:'#f5a800', cursor:'pointer', fontSize:'0.8rem', fontFamily:'inherit', fontWeight:600 }}>
                                    <i className="fas fa-edit" style={{ marginRight:'0.3rem' }} />Edit
                                </button>
                                <button onClick={() => { if(confirm('Delete this video?')) router.delete(`/admin/videos/${v.id}`); }} style={{ padding:'0.5rem 0.75rem', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'8px', color:'#ef4444', cursor:'pointer', fontSize:'0.8rem', fontFamily:'inherit' }}>
                                    <i className="fas fa-trash" />
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div style={{ gridColumn:'1/-1', padding:'4rem', textAlign:'center', color:'#333', background:'#111', borderRadius:'16px', border:'1px solid rgba(245,168,0,0.15)' }}>
                        <i className="fab fa-youtube" style={{ fontSize:'3rem', display:'block', marginBottom:'1rem', color:'#cc0000' }} />
                        <p style={{ margin:0, fontSize:'1rem', color:'#555' }}>No videos yet. Add your first YouTube video!</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
