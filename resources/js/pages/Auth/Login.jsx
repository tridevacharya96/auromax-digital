import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Login({ errors }) {
    const [form, setForm] = useState({ email:'', password:'', remember:false });
    const [loading, setLoading] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        router.post('/login', form, { onFinish: () => setLoading(false) });
    };

    const inp = { width:'100%', padding:'0.85rem 1rem 0.85rem 2.75rem', background:'#f8f8f8', border:'1.5px solid #e5e5e5', borderRadius:'10px', color:'#1a1a1a', fontSize:'0.95rem', outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

    return (
        <div style={{ minHeight:'100vh', background:'#f8f8f8', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Segoe UI',system-ui,sans-serif", padding:'2rem' }}>
            <div style={{ width:'100%', maxWidth:'440px', background:'#fff', border:'1.5px solid rgba(245,168,0,0.2)', borderRadius:'20px', padding:'3rem', boxShadow:'0 20px 60px rgba(245,168,0,0.08)' }}>
                <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                    <a href="/"><img src="/images/amd-logo.png" alt="AMD" style={{ height:'55px', marginBottom:'1rem' }} /></a>
                    <h1 style={{ fontSize:'1.5rem', fontWeight:800, background:'linear-gradient(135deg,#cc0000,#f5a800)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', margin:0 }}>Welcome Back</h1>
                    <p style={{ color:'#888', fontSize:'0.85rem', marginTop:'0.5rem' }}>Sign in to your account</p>
                </div>

                {errors?.email && (
                    <div style={{ background:'rgba(204,0,0,0.05)', border:'1px solid rgba(204,0,0,0.2)', borderRadius:'10px', padding:'0.75rem 1rem', color:'#cc0000', fontSize:'0.85rem', marginBottom:'1.5rem' }}>
                        <i className="fas fa-exclamation-circle" style={{ marginRight:'0.5rem' }} />{errors.email}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div style={{ marginBottom:'1rem' }}>
                        <label style={{ display:'block', color:'#cc4400', fontSize:'0.82rem', fontWeight:600, marginBottom:'0.4rem' }}>Email Address</label>
                        <div style={{ position:'relative' }}>
                            <i className="fas fa-envelope" style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'#ccc', fontSize:'0.85rem' }} />
                            <input type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="john@example.com" required style={inp}
                                onFocus={e => e.target.style.borderColor='#f5a800'} onBlur={e => e.target.style.borderColor='#e5e5e5'} />
                        </div>
                    </div>
                    <div style={{ marginBottom:'1rem' }}>
                        <label style={{ display:'block', color:'#cc4400', fontSize:'0.82rem', fontWeight:600, marginBottom:'0.4rem' }}>Password</label>
                        <div style={{ position:'relative' }}>
                            <i className="fas fa-lock" style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'#ccc', fontSize:'0.85rem' }} />
                            <input type="password" value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} placeholder="Enter your password" required style={inp}
                                onFocus={e => e.target.style.borderColor='#f5a800'} onBlur={e => e.target.style.borderColor='#e5e5e5'} />
                        </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
                        <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer' }}>
                            <input type="checkbox" checked={form.remember} onChange={e => setForm(f=>({...f,remember:e.target.checked}))} style={{ accentColor:'#f5a800' }} />
                            <span style={{ color:'#888', fontSize:'0.85rem' }}>Remember me</span>
                        </label>
                        <a href="#" style={{ color:'#cc4400', fontSize:'0.82rem', textDecoration:'none', fontWeight:600 }}>Forgot password?</a>
                    </div>
                    <button type="submit" disabled={loading} style={{ width:'100%', padding:'0.95rem', background: loading?'#e5e5e5':'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color: loading?'#999':'#fff', fontSize:'1rem', fontWeight:700, cursor: loading?'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                        {loading ? <><i className="fas fa-spinner fa-spin" /> Signing in...</> : <><i className="fas fa-sign-in-alt" /> Sign In</>}
                    </button>
                </form>

                <p style={{ textAlign:'center', color:'#888', fontSize:'0.85rem', marginTop:'1.5rem' }}>
                    Don't have an account?{' '}
                    <a href="/register" style={{ color:'#cc4400', fontWeight:700, textDecoration:'none' }}>Sign Up Free</a>
                </p>
                <p style={{ textAlign:'center', marginTop:'0.75rem' }}>
                    <a href="/" style={{ color:'#aaa', fontSize:'0.8rem', textDecoration:'none' }}>
                        <i className="fas fa-arrow-left" style={{ marginRight:'0.3rem' }} />Back to Home
                    </a>
                </p>
            </div>
        </div>
    );
}
