import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Login({ errors }) {
    const [form, setForm] = useState({ email: '', password: '', remember: false });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        router.post('/admin/login', form, { onFinish: () => setLoading(false) });
    };

    return (
        <div style={{ minHeight:'100vh', background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Segoe UI',system-ui,sans-serif", position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', width:'600px', height:'600px', background:'radial-gradient(circle,rgba(245,168,0,0.08) 0%,transparent 70%)', top:'-200px', right:'-200px', borderRadius:'50%' }} />
            <div style={{ position:'absolute', width:'500px', height:'500px', background:'radial-gradient(circle,rgba(204,0,0,0.06) 0%,transparent 70%)', bottom:'-150px', left:'-150px', borderRadius:'50%' }} />
            <div style={{ width:'100%', maxWidth:'440px', margin:'2rem', background:'#111', border:'1px solid rgba(245,168,0,0.2)', borderRadius:'20px', padding:'3rem', boxShadow:'0 25px 60px rgba(0,0,0,0.5)', position:'relative', zIndex:1 }}>
                <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
                    <img src="/images/amd-logo.png" alt="Auromax Digital" style={{ height:'60px', width:'auto', marginBottom:'1rem' }} />
                    <h1 style={{ fontSize:'1.5rem', fontWeight:800, background:'linear-gradient(135deg,#cc0000,#f5a800)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:'0.25rem' }}>Admin Portal</h1>
                    <p style={{ color:'#666', fontSize:'0.85rem' }}>Sign in to manage Auromax Digital</p>
                </div>
                {errors?.email && (
                    <div style={{ background:'rgba(204,0,0,0.1)', border:'1px solid rgba(204,0,0,0.3)', borderRadius:'10px', padding:'0.75rem 1rem', color:'#ff4444', fontSize:'0.85rem', marginBottom:'1.5rem' }}>
                        <i className="fas fa-exclamation-circle" style={{ marginRight:'0.5rem' }} />{errors.email}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom:'1.25rem' }}>
                        <label style={{ display:'block', color:'#f5a800', fontSize:'0.85rem', fontWeight:600, marginBottom:'0.5rem' }}>Email Address</label>
                        <div style={{ position:'relative' }}>
                            <i className="fas fa-envelope" style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'#444' }} />
                            <input type="email" value={form.email} required onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="admin@auromaxdigital.com"
                                style={{ width:'100%', padding:'0.85rem 1rem 0.85rem 2.75rem', background:'#1a1a1a', border:'1.5px solid #2a2a2a', borderRadius:'10px', color:'#fff', fontSize:'0.95rem', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}
                                onFocus={e => e.target.style.borderColor='#f5a800'} onBlur={e => e.target.style.borderColor='#2a2a2a'} />
                        </div>
                    </div>
                    <div style={{ marginBottom:'1.25rem' }}>
                        <label style={{ display:'block', color:'#f5a800', fontSize:'0.85rem', fontWeight:600, marginBottom:'0.5rem' }}>Password</label>
                        <div style={{ position:'relative' }}>
                            <i className="fas fa-lock" style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'#444' }} />
                            <input type="password" value={form.password} required onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Enter your password"
                                style={{ width:'100%', padding:'0.85rem 1rem 0.85rem 2.75rem', background:'#1a1a1a', border:'1.5px solid #2a2a2a', borderRadius:'10px', color:'#fff', fontSize:'0.95rem', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}
                                onFocus={e => e.target.style.borderColor='#f5a800'} onBlur={e => e.target.style.borderColor='#2a2a2a'} />
                        </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'2rem' }}>
                        <input type="checkbox" id="remember" checked={form.remember} onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))} style={{ accentColor:'#f5a800', width:'16px', height:'16px', cursor:'pointer' }} />
                        <label htmlFor="remember" style={{ color:'#888', fontSize:'0.85rem', cursor:'pointer' }}>Remember me</label>
                    </div>
                    <button type="submit" disabled={loading} style={{ width:'100%', padding:'0.95rem', background: loading ? '#333' : 'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color:'#fff', fontSize:'1rem', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', boxShadow: loading ? 'none' : '0 4px 20px rgba(245,168,0,0.3)' }}>
                        {loading ? <><i className="fas fa-spinner fa-spin" /> Signing in...</> : <><i className="fas fa-sign-in-alt" /> Sign In to Dashboard</>}
                    </button>
                </form>
                <div style={{ textAlign:'center', marginTop:'2rem', paddingTop:'1.5rem', borderTop:'1px solid #1a1a1a' }}>
                    <a href="/" style={{ color:'#666', fontSize:'0.8rem', textDecoration:'none' }}><i className="fas fa-arrow-left" style={{ marginRight:'0.4rem' }} />Back to Website</a>
                </div>
            </div>
        </div>
    );
}
