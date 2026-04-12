import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Register({ errors }) {
    const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', password_confirmation:'' });
    const [loading, setLoading] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        router.post('/register', form, { onFinish: () => setLoading(false) });
    };

    const inp = { width:'100%', padding:'0.85rem 1rem 0.85rem 2.75rem', background:'#f8f8f8', border:'1.5px solid #e5e5e5', borderRadius:'10px', color:'#1a1a1a', fontSize:'0.95rem', outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

    return (
        <div style={{ minHeight:'100vh', background:'#f8f8f8', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Segoe UI',system-ui,sans-serif", padding:'2rem' }}>
            <div style={{ width:'100%', maxWidth:'480px', background:'#fff', border:'1.5px solid rgba(245,168,0,0.2)', borderRadius:'20px', padding:'3rem', boxShadow:'0 20px 60px rgba(245,168,0,0.08)' }}>
                <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                    <a href="/"><img src="/images/amd-logo.png" alt="AMD" style={{ height:'55px', marginBottom:'1rem' }} /></a>
                    <h1 style={{ fontSize:'1.5rem', fontWeight:800, background:'linear-gradient(135deg,#cc0000,#f5a800)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', margin:0 }}>Create Account</h1>
                    <p style={{ color:'#888', fontSize:'0.85rem', marginTop:'0.5rem' }}>Join Auromax Digital today</p>
                </div>

                {errors && Object.keys(errors).length > 0 && (
                    <div style={{ background:'rgba(204,0,0,0.05)', border:'1px solid rgba(204,0,0,0.2)', borderRadius:'10px', padding:'0.75rem 1rem', marginBottom:'1.5rem' }}>
                        {Object.values(errors).map((e,i) => <p key={i} style={{ color:'#cc0000', fontSize:'0.85rem', margin:'0.2rem 0' }}>{e}</p>)}
                    </div>
                )}

                <form onSubmit={submit}>
                    {[
                        { name:'name', label:'Full Name', icon:'fa-user', type:'text', placeholder:'John Doe' },
                        { name:'email', label:'Email Address', icon:'fa-envelope', type:'email', placeholder:'john@example.com' },
                        { name:'phone', label:'Phone Number', icon:'fa-phone', type:'text', placeholder:'+91 98765 43210' },
                        { name:'password', label:'Password', icon:'fa-lock', type:'password', placeholder:'Min 8 characters' },
                        { name:'password_confirmation', label:'Confirm Password', icon:'fa-lock', type:'password', placeholder:'Re-enter password' },
                    ].map(field => (
                        <div key={field.name} style={{ marginBottom:'1rem' }}>
                            <label style={{ display:'block', color:'#cc4400', fontSize:'0.82rem', fontWeight:600, marginBottom:'0.4rem' }}>{field.label}</label>
                            <div style={{ position:'relative' }}>
                                <i className={`fas ${field.icon}`} style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'#ccc', fontSize:'0.85rem' }} />
                                <input type={field.type} value={form[field.name]} onChange={e => setForm(f=>({...f,[field.name]:e.target.value}))} placeholder={field.placeholder} style={inp}
                                    onFocus={e => e.target.style.borderColor='#f5a800'}
                                    onBlur={e => e.target.style.borderColor='#e5e5e5'} />
                            </div>
                            {errors?.[field.name] && <p style={{ color:'#cc0000', fontSize:'0.78rem', margin:'0.3rem 0 0' }}>{errors[field.name]}</p>}
                        </div>
                    ))}

                    <button type="submit" disabled={loading} style={{ width:'100%', padding:'0.95rem', background: loading?'#e5e5e5':'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color: loading?'#999':'#fff', fontSize:'1rem', fontWeight:700, cursor: loading?'not-allowed':'pointer', marginTop:'1rem', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                        {loading ? <><i className="fas fa-spinner fa-spin" /> Creating...</> : <><i className="fas fa-user-plus" /> Create Account</>}
                    </button>
                </form>

                <p style={{ textAlign:'center', color:'#888', fontSize:'0.85rem', marginTop:'1.5rem' }}>
                    Already have an account?{' '}
                    <a href="/login" style={{ color:'#cc4400', fontWeight:700, textDecoration:'none' }}>Sign In</a>
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
