import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from './Layout';

export default function Team({ members, admin }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing]   = useState(null);
    const [preview, setPreview]   = useState(null);
    const fileRef                 = useRef();

    const blank = { name: '', role: '', bio: '', twitter_url: '', instagram_url: '', linkedin_url: '', youtube_url: '', order: 0, is_active: true };
    const [form, setForm] = useState(blank);

    const reset = () => { setForm(blank); setEditing(null); setShowForm(false); setPreview(null); };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (fileRef.current?.files[0]) fd.append('photo', fileRef.current.files[0]);

        if (editing) {
            fd.append('_method', 'PUT');
            router.post(`/admin/team/${editing.id}`, fd, { onSuccess: reset });
        } else {
            router.post('/admin/team', fd, { onSuccess: reset });
        }
    };

    const editMember = (m) => {
        setEditing(m);
        setForm({
            name: m.name, role: m.role, bio: m.bio || '',
            twitter_url: m.twitter_url || '', instagram_url: m.instagram_url || '',
            linkedin_url: m.linkedin_url || '', youtube_url: m.youtube_url || '',
            order: m.order || 0, is_active: m.is_active,
        });
        setPreview(m.photo || null);
        setShowForm(true);
    };

    const inp = { width: '100%', padding: '0.75rem 1rem', background: '#1a1a1a', border: '1.5px solid #2a2a2a', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };
    const colors = ['linear-gradient(135deg,#6c63ff,#00d4ff)', 'linear-gradient(135deg,#f50057,#ff9800)', 'linear-gradient(135deg,#4caf50,#00d4ff)', 'linear-gradient(135deg,#cc0000,#f5a800)', 'linear-gradient(135deg,#8b5cf6,#ec4899)', 'linear-gradient(135deg,#f59e0b,#ef4444)'];

    return (
        <AdminLayout admin={admin} active="team">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Team Members</h1>
                    <p style={{ color: '#666', margin: 0, fontSize: '0.85rem' }}>{members.total} members — displayed on homepage</p>
                </div>
                <button onClick={() => { reset(); setShowForm(true); }} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#cc0000,#f5a800)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit' }}>
                    <i className="fas fa-plus" /> Add Member
                </button>
            </div>

            {/* Modal */}
            {showForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#111', border: '1px solid rgba(245,168,0,0.2)', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ color: '#fff', fontWeight: 800, margin: 0 }}>{editing ? 'Edit Member' : 'Add Team Member'}</h2>
                            <button onClick={reset} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '1.2rem' }}><i className="fas fa-times" /></button>
                        </div>

                        <form onSubmit={submit}>
                            {/* Photo upload */}
                            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                <div onClick={() => fileRef.current?.click()} style={{ width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 0.75rem', overflow: 'hidden', border: '3px dashed rgba(245,168,0,0.4)', background: '#1a1a1a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {preview
                                        ? <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <i className="fas fa-camera" style={{ color: '#f5a800', fontSize: '1.5rem' }} />
                                    }
                                </div>
                                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                                <p style={{ color: '#555', fontSize: '0.75rem' }}>Click to upload photo</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Name *</label>
                                    <input style={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Full name" />
                                </div>
                                <div>
                                    <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Role *</label>
                                    <input style={inp} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required placeholder="e.g. Lead Developer" />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Bio</label>
                                <textarea style={{ ...inp, minHeight: '80px', resize: 'vertical' }} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Short bio..." />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}><i className="fab fa-twitter" style={{ marginRight: '0.3rem' }} />Twitter URL</label>
                                    <input style={inp} value={form.twitter_url} onChange={e => setForm(f => ({ ...f, twitter_url: e.target.value }))} placeholder="https://twitter.com/..." />
                                </div>
                                <div>
                                    <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}><i className="fab fa-instagram" style={{ marginRight: '0.3rem' }} />Instagram URL</label>
                                    <input style={inp} value={form.instagram_url} onChange={e => setForm(f => ({ ...f, instagram_url: e.target.value }))} placeholder="https://instagram.com/..." />
                                </div>
                                <div>
                                    <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}><i className="fab fa-linkedin" style={{ marginRight: '0.3rem' }} />LinkedIn URL</label>
                                    <input style={inp} value={form.linkedin_url} onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))} placeholder="https://linkedin.com/in/..." />
                                </div>
                                <div>
                                    <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}><i className="fab fa-youtube" style={{ marginRight: '0.3rem' }} />YouTube URL</label>
                                    <input style={inp} value={form.youtube_url} onChange={e => setForm(f => ({ ...f, youtube_url: e.target.value }))} placeholder="https://youtube.com/..." />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Display Order</label>
                                    <input style={inp} type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} placeholder="0" />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                                    <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} style={{ accentColor: '#f5a800', width: '16px', height: '16px' }} />
                                    <label style={{ color: '#aaa', fontSize: '0.85rem' }}>Show on website</label>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" style={{ flex: 1, padding: '0.85rem', background: 'linear-gradient(135deg,#cc0000,#f5a800)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                    <i className="fas fa-save" style={{ marginRight: '0.5rem' }} />{editing ? 'Update Member' : 'Add Member'}
                                </button>
                                <button type="button" onClick={reset} style={{ padding: '0.85rem 1.5rem', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', color: '#aaa', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.5rem' }}>
                {members.data?.length > 0 ? members.data.map((m, idx) => (
                    <div key={m.id} style={{ background: '#111', border: '1px solid rgba(245,168,0,0.15)', borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ height: '6px', background: colors[idx % colors.length] }} />
                        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 1rem', overflow: 'hidden', background: colors[idx % colors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.8rem', fontWeight: 700 }}>
                                {m.photo
                                    ? <img src={m.photo} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : m.name?.charAt(0)
                                }
                            </div>
                            <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{m.name}</h3>
                            <p style={{ color: '#f5a800', fontSize: '0.82rem', fontWeight: 600, margin: '0 0 0.75rem' }}>{m.role}</p>
                            {m.bio && <p style={{ color: '#666', fontSize: '0.8rem', margin: '0 0 1rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.bio}</p>}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                {m.twitter_url   && <a href={m.twitter_url}   target="_blank" rel="noreferrer" style={{ color: '#1da1f2', fontSize: '0.9rem' }}><i className="fab fa-twitter" /></a>}
                                {m.instagram_url && <a href={m.instagram_url} target="_blank" rel="noreferrer" style={{ color: '#e1306c', fontSize: '0.9rem' }}><i className="fab fa-instagram" /></a>}
                                {m.linkedin_url  && <a href={m.linkedin_url}  target="_blank" rel="noreferrer" style={{ color: '#0077b5', fontSize: '0.9rem' }}><i className="fab fa-linkedin" /></a>}
                                {m.youtube_url   && <a href={m.youtube_url}   target="_blank" rel="noreferrer" style={{ color: '#cc0000', fontSize: '0.9rem' }}><i className="fab fa-youtube" /></a>}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => editMember(m)} style={{ flex: 1, padding: '0.5rem', background: 'rgba(245,168,0,0.1)', border: '1px solid rgba(245,168,0,0.3)', borderRadius: '8px', color: '#f5a800', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit', fontWeight: 600 }}>
                                    <i className="fas fa-edit" style={{ marginRight: '0.3rem' }} />Edit
                                </button>
                                <button onClick={() => { if (confirm('Delete this member?')) router.delete(`/admin/team/${m.id}`); }} style={{ padding: '0.5rem 0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit' }}>
                                    <i className="fas fa-trash" />
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div style={{ gridColumn: '1/-1', padding: '4rem', textAlign: 'center', background: '#111', borderRadius: '16px', border: '1px solid rgba(245,168,0,0.15)' }}>
                        <i className="fas fa-users" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', color: '#f5a800' }} />
                        <p style={{ margin: 0, color: '#555' }}>No team members yet. Add your first one!</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}