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
        <div style={{ minHeight:'100vh', background:'#ffffff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Segoe UI',system-ui,sans-serif", position:'relative', overflow:'hidden' }}>
            {/* Background glow */}
            <div style={{ position:'absolute', width:'600px', height:'600px', background:'radial-gradient(circle,rgba(245,168,0,0.06) 0%,transparent 70%)', top:'-200px', right:'-200px', borderRadius:'50%' }} />
            <div style={{ position:'absolute', width:'500px', height:'500px', background:'radial-gradient(circle,rgba(204,0,0,0.04) 0%,transparent 70%)', bottom:'-150px', left:'-150px', borderRadius:'50%' }} />

            <div style={{ width:'100%', maxWidth:'440px', margin:'2rem', background:'#ffffff', border:'1.5px solid rgba(245,168,0,0.25)', borderRadius:'20px', padding:'3rem', boxShadow:'0 25px 60px rgba(245,168,0,0.1)', position:'relative', zIndex:1 }}>
                {/* Logo */}
                <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
                    <img src="/images/amd-logo.png" alt="Auromax Digital" style={{ height:'65px', width:'auto', marginBottom:'1rem' }} />
                    <h1 style={{ fontSize:'1.5rem', fontWeight:800, background:'linear-gradient(135deg,#cc0000,#f5a800)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:'0.25rem', margin:0 }}>Admin Portal</h1>
                    <p style={{ color:'#888', fontSize:'0.85rem', marginTop:'0.5rem' }}>Sign in to manage Auromax Digital</p>
                </div>

                {/* Error */}
                {errors?.email && (
                    <div style={{ background:'rgba(204,0,0,0.06)', border:'1px solid rgba(204,0,0,0.2)', borderRadius:'10px', padding:'0.75rem 1rem', color:'#cc0000', fontSize:'0.85rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                        <i className="fas fa-exclamation-circle" />{errors.email}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div style={{ marginBottom:'1.25rem' }}>
                        <label style={{ display:'block', color:'#cc4400', fontSize:'0.85rem', fontWeight:600, marginBottom:'0.5rem' }}>Email Address</label>
                        <div style={{ position:'relative' }}>
                            <i className="fas fa-envelope" style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'#ccc' }} />
                            <input type="email" value={form.email} required onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="admin@auromaxdigital.com"
                                style={{ width:'100%', padding:'0.85rem 1rem 0.85rem 2.75rem', background:'#f8f8f8', border:'1.5px solid #e5e5e5', borderRadius:'10px', color:'#1a1a1a', fontSize:'0.95rem', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}
                                onFocus={e => e.target.style.borderColor='#f5a800'}
                                onBlur={e => e.target.style.borderColor='#e5e5e5'} />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom:'1.25rem' }}>
                        <label style={{ display:'block', color:'#cc4400', fontSize:'0.85rem', fontWeight:600, marginBottom:'0.5rem' }}>Password</label>
                        <div style={{ position:'relative' }}>
                            <i className="fas fa-lock" style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'#ccc' }} />
                            <input type="password" value={form.password} required onChange={e => setForm(f=>({...f,password:e.target.value}))} placeholder="Enter your password"
                                style={{ width:'100%', padding:'0.85rem 1rem 0.85rem 2.75rem', background:'#f8f8f8', border:'1.5px solid #e5e5e5', borderRadius:'10px', color:'#1a1a1a', fontSize:'0.95rem', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}
                                onFocus={e => e.target.style.borderColor='#f5a800'}
                                onBlur={e => e.target.style.borderColor='#e5e5e5'} />
                        </div>
                    </div>

                    {/* Remember me */}
                    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'2rem' }}>
                        <input type="checkbox" id="remember" checked={form.remember} onChange={e => setForm(f=>({...f,remember:e.target.checked}))} style={{ accentColor:'#f5a800', width:'16px', height:'16px', cursor:'pointer' }} />
                        <label htmlFor="remember" style={{ color:'#888', fontSize:'0.85rem', cursor:'pointer' }}>Remember me</label>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={loading} style={{ width:'100%', padding:'0.95rem', background: loading ? '#e5e5e5' : 'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color: loading ? '#999' : '#fff', fontSize:'1rem', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', boxShadow: loading ? 'none' : '0 4px 20px rgba(245,168,0,0.3)', transition:'all 0.3s', fontFamily:'inherit' }}>
                        {loading ? <><i className="fas fa-spinner fa-spin" /> Signing in...</> : <><i className="fas fa-sign-in-alt" /> Sign In to Dashboard</>}
                    </button>
                </form>

                <div style={{ textAlign:'center', marginTop:'2rem', paddingTop:'1.5rem', borderTop:'1px solid #f0f0f0' }}>
                    <a href="/" style={{ color:'#aaa', fontSize:'0.8rem', textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem' }}>
                        <i className="fas fa-arrow-left" />Back to Website
                    </a>
                </div>
            </div>
        </div>
    );
}
