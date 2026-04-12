import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';

const STATUS_COLORS = { pending:'#f5a800', processing:'#3b82f6', shipped:'#8b5cf6', delivered:'#22c55e', cancelled:'#ef4444' };
const PAYMENT_COLORS = { paid:'#22c55e', pending:'#f5a800', failed:'#ef4444', refunded:'#8b5cf6' };

export default function Profile({ user, orders, stats }) {
    const [tab, setTab] = useState('orders');
    const [form, setForm] = useState({ name:user.name, phone:user.phone||'', address:user.address||'', city:user.city||'', state:user.state||'', pincode:user.pincode||'', country:user.country||'India' });
    const [passForm, setPassForm] = useState({ current_password:'', password:'', password_confirmation:'' });
    const [preview, setPreview] = useState(user.avatar ? `/storage/${user.avatar}` : null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const fileRef = useRef(null);
    const fmt = (amount) => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR' }).format(amount||0);

    const updateProfile = (e) => {
        e.preventDefault();
        setSaving(true);
        const data = new FormData();
        Object.entries(form).forEach(([k,v]) => data.append(k,v));
        if (fileRef.current?.files[0]) data.append('avatar', fileRef.current.files[0]);
        router.post('/profile/update', data, {
            onSuccess: () => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); },
            onFinish: () => setSaving(false),
            forceFormData: true,
        });
    };

    const updatePassword = (e) => {
        e.preventDefault();
        router.post('/profile/password', passForm, {
            onSuccess: () => setPassForm({ current_password:'', password:'', password_confirmation:'' }),
        });
    };

    const inp = { width:'100%', padding:'0.75rem 1rem', background:'#f8f8f8', border:'1.5px solid #e5e5e5', borderRadius:'10px', color:'#1a1a1a', fontSize:'0.9rem', outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

    const tabs = [
        { key:'orders', label:'My Orders', icon:'fa-shopping-bag' },
        { key:'profile', label:'Edit Profile', icon:'fa-user-edit' },
        { key:'password', label:'Change Password', icon:'fa-lock' },
    ];

    return (
        <div style={{ minHeight:'100vh', background:'#f8f8f8', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
            {/* Header */}
            <div style={{ background:'#fff', borderBottom:'1px solid #e5e5e5', padding:'1rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
                <a href="/"><img src="/images/amd-logo.png" alt="AMD" style={{ height:'45px' }} /></a>
                <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                    <a href="/" style={{ color:'#666', textDecoration:'none', fontSize:'0.85rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                        <i className="fas fa-home" /> Home
                    </a>
                    <form method="POST" action="/logout" style={{ margin:0 }} onSubmit={e => { e.preventDefault(); router.post('/logout'); }}>
                        <button type="submit" style={{ padding:'0.5rem 1rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'50px', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'0.82rem', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                            <i className="fas fa-sign-out-alt" /> Logout
                        </button>
                    </form>
                </div>
            </div>

            <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2rem' }}>
                {/* Profile Hero */}
                <div style={{ background:'linear-gradient(135deg,#cc0000,#f5a800)', borderRadius:'20px', padding:'2rem', marginBottom:'2rem', display:'flex', alignItems:'center', gap:'2rem', flexWrap:'wrap' }}>
                    <div style={{ width:'90px', height:'90px', borderRadius:'50%', border:'3px solid rgba(255,255,255,0.5)', overflow:'hidden', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        {preview ? (
                            <img src={preview} alt={user.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        ) : (
                            <span style={{ color:'#fff', fontSize:'2.5rem', fontWeight:900 }}>{user.name?.charAt(0)}</span>
                        )}
                    </div>
                    <div style={{ flex:1 }}>
                        <h1 style={{ color:'#fff', fontSize:'1.8rem', fontWeight:900, margin:'0 0 0.25rem' }}>{user.name}</h1>
                        <p style={{ color:'rgba(255,255,255,0.8)', margin:'0 0 0.5rem', fontSize:'0.9rem' }}>{user.email}</p>
                        {user.phone && <p style={{ color:'rgba(255,255,255,0.7)', margin:0, fontSize:'0.85rem' }}><i className="fas fa-phone" style={{ marginRight:'0.4rem' }} />{user.phone}</p>}
                    </div>
                    {/* Stats */}
                    <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
                        {[
                            { label:'Total Spent', value:fmt(stats.totalSpent), icon:'fa-rupee-sign' },
                            { label:'Orders', value:stats.totalOrders, icon:'fa-shopping-bag' },
                            { label:'Delivered', value:stats.delivered, icon:'fa-check-circle' },
                            { label:'Pending', value:stats.pendingOrders, icon:'fa-clock' },
                        ].map(s => (
                            <div key={s.label} style={{ background:'rgba(255,255,255,0.15)', borderRadius:'12px', padding:'1rem 1.25rem', textAlign:'center', minWidth:'80px' }}>
                                <i className={`fas ${s.icon}`} style={{ color:'rgba(255,255,255,0.8)', fontSize:'1.1rem', display:'block', marginBottom:'0.3rem' }} />
                                <div style={{ color:'#fff', fontSize:'1.2rem', fontWeight:900 }}>{s.value}</div>
                                <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.7rem', fontWeight:600 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', background:'#fff', padding:'0.5rem', borderRadius:'12px', border:'1px solid #e5e5e5' }}>
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)} style={{ flex:1, padding:'0.75rem', background: tab===t.key ? 'linear-gradient(135deg,#cc0000,#f5a800)' : 'transparent', border:'none', borderRadius:'8px', color: tab===t.key ? '#fff' : '#666', fontWeight:700, cursor:'pointer', fontSize:'0.85rem', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', transition:'all 0.2s' }}>
                            <i className={`fas ${t.icon}`} />{t.label}
                        </button>
                    ))}
                </div>

                {/* Orders Tab */}
                {tab === 'orders' && (
                    <div style={{ background:'#fff', borderRadius:'16px', border:'1px solid #e5e5e5', overflow:'hidden' }}>
                        <div style={{ padding:'1.5rem', borderBottom:'1px solid #f0f0f0' }}>
                            <h2 style={{ margin:0, fontSize:'1.1rem', fontWeight:800, color:'#1a1a1a' }}>
                                <i className="fas fa-shopping-bag" style={{ color:'#f5a800', marginRight:'0.5rem' }} />My Orders
                            </h2>
                        </div>
                        {orders?.length > 0 ? (
                            <div>
                                {orders.map(order => (
                                    <div key={order.id} style={{ padding:'1.5rem', borderBottom:'1px solid #f8f8f8', transition:'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' }}>
                                            <div>
                                                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem' }}>
                                                    <span style={{ color:'#f5a800', fontWeight:800, fontSize:'0.9rem' }}>#{order.order_number}</span>
                                                    <span style={{ padding:'0.2rem 0.6rem', borderRadius:'50px', background:`${STATUS_COLORS[order.status]}15`, color:STATUS_COLORS[order.status], fontSize:'0.75rem', fontWeight:700, textTransform:'capitalize' }}>{order.status}</span>
                                                    <span style={{ padding:'0.2rem 0.6rem', borderRadius:'50px', background:`${PAYMENT_COLORS[order.payment_status]}15`, color:PAYMENT_COLORS[order.payment_status], fontSize:'0.75rem', fontWeight:700, textTransform:'capitalize' }}>{order.payment_status}</span>
                                                </div>
                                                <div style={{ color:'#888', fontSize:'0.82rem' }}>
                                                    <i className="fas fa-calendar" style={{ marginRight:'0.3rem' }} />
                                                    {new Date(order.created_at).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })}
                                                </div>
                                                {/* Items */}
                                                {order.items?.length > 0 && (
                                                    <div style={{ marginTop:'0.75rem', display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                                                        {order.items.map(item => (
                                                            <span key={item.id} style={{ fontSize:'0.8rem', background:'#f5f5f5', padding:'0.25rem 0.6rem', borderRadius:'50px', color:'#555' }}>
                                                                {item.product?.name} x{item.quantity}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                {/* Delivery */}
                                                {order.delivery && (
                                                    <div style={{ marginTop:'0.75rem', padding:'0.75rem', background:'#f8f8f8', borderRadius:'8px', fontSize:'0.82rem' }}>
                                                        <i className="fas fa-truck" style={{ color:'#f5a800', marginRight:'0.4rem' }} />
                                                        <strong>Delivery:</strong> {order.delivery.status?.replace('_',' ')}
                                                        {order.delivery.tracking_number && <span style={{ marginLeft:'0.5rem', color:'#888' }}>— Tracking: {order.delivery.tracking_number}</span>}
                                                        {order.delivery.carrier && <span style={{ marginLeft:'0.5rem', color:'#888' }}>via {order.delivery.carrier}</span>}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ textAlign:'right' }}>
                                                <div style={{ fontSize:'1.3rem', fontWeight:900, background:'linear-gradient(135deg,#cc0000,#f5a800)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{fmt(order.total)}</div>
                                                <div style={{ color:'#aaa', fontSize:'0.78rem' }}>{order.items?.length || 0} item(s)</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding:'4rem', textAlign:'center', color:'#ccc' }}>
                                <i className="fas fa-shopping-bag" style={{ fontSize:'3rem', display:'block', marginBottom:'1rem', color:'#f5a800' }} />
                                <p style={{ margin:0, color:'#888' }}>No orders yet. Start shopping!</p>
                                <a href="/#products" style={{ display:'inline-block', marginTop:'1rem', padding:'0.75rem 2rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', color:'#fff', borderRadius:'50px', textDecoration:'none', fontWeight:700, fontSize:'0.9rem' }}>Browse Products</a>
                            </div>
                        )}
                    </div>
                )}

                {/* Edit Profile Tab */}
                {tab === 'profile' && (
                    <div style={{ background:'#fff', borderRadius:'16px', border:'1px solid #e5e5e5', padding:'2rem' }}>
                        <h2 style={{ margin:'0 0 1.5rem', fontSize:'1.1rem', fontWeight:800, color:'#1a1a1a' }}>
                            <i className="fas fa-user-edit" style={{ color:'#f5a800', marginRight:'0.5rem' }} />Edit Profile
                        </h2>

                        {saved && <div style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:'10px', padding:'0.75rem 1rem', color:'#22c55e', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem' }}><i className="fas fa-check-circle" /> Profile updated!</div>}

                        {/* Avatar */}
                        <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', marginBottom:'2rem', padding:'1.5rem', background:'#f8f8f8', borderRadius:'12px' }}>
                            <div style={{ width:'80px', height:'80px', borderRadius:'50%', overflow:'hidden', border:'3px solid #f5a800', background:'#e5e5e5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor:'pointer' }} onClick={() => fileRef.current?.click()}>
                                {preview ? <img src={preview} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span style={{ fontSize:'2rem', fontWeight:900, color:'#f5a800' }}>{user.name?.charAt(0)}</span>}
                            </div>
                            <div>
                                <p style={{ margin:'0 0 0.5rem', fontWeight:600, color:'#1a1a1a' }}>Profile Photo</p>
                                <button type="button" onClick={() => fileRef.current?.click()} style={{ padding:'0.5rem 1rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'8px', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'0.82rem', fontFamily:'inherit' }}>
                                    <i className="fas fa-camera" style={{ marginRight:'0.4rem' }} />Change Photo
                                </button>
                                <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { const f=e.target.files[0]; if(f) setPreview(URL.createObjectURL(f)); }} />
                            </div>
                        </div>

                        <form onSubmit={updateProfile}>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                                {[
                                    { name:'name', label:'Full Name', placeholder:'Your name' },
                                    { name:'phone', label:'Phone Number', placeholder:'+91 98765 43210' },
                                    { name:'city', label:'City', placeholder:'Bangalore' },
                                    { name:'state', label:'State', placeholder:'Karnataka' },
                                    { name:'pincode', label:'Pincode', placeholder:'560001' },
                                    { name:'country', label:'Country', placeholder:'India' },
                                ].map(field => (
                                    <div key={field.name}>
                                        <label style={{ display:'block', color:'#cc4400', fontSize:'0.8rem', fontWeight:600, marginBottom:'0.4rem' }}>{field.label}</label>
                                        <input value={form[field.name]} onChange={e => setForm(f=>({...f,[field.name]:e.target.value}))} placeholder={field.placeholder} style={inp}
                                            onFocus={e => e.target.style.borderColor='#f5a800'} onBlur={e => e.target.style.borderColor='#e5e5e5'} />
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginBottom:'1.5rem' }}>
                                <label style={{ display:'block', color:'#cc4400', fontSize:'0.8rem', fontWeight:600, marginBottom:'0.4rem' }}>Address</label>
                                <textarea value={form.address} onChange={e => setForm(f=>({...f,address:e.target.value}))} placeholder="Street address..." style={{ ...inp, minHeight:'80px', resize:'vertical' }}
                                    onFocus={e => e.target.style.borderColor='#f5a800'} onBlur={e => e.target.style.borderColor='#e5e5e5'} />
                            </div>
                            <button type="submit" disabled={saving} style={{ padding:'0.85rem 2.5rem', background: saving?'#e5e5e5':'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color: saving?'#999':'#fff', fontWeight:700, cursor: saving?'not-allowed':'pointer', fontSize:'0.95rem', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                                {saving ? <><i className="fas fa-spinner fa-spin" /> Saving...</> : <><i className="fas fa-save" /> Save Changes</>}
                            </button>
                        </form>
                    </div>
                )}

                {/* Change Password Tab */}
                {tab === 'password' && (
                    <div style={{ background:'#fff', borderRadius:'16px', border:'1px solid #e5e5e5', padding:'2rem', maxWidth:'500px' }}>
                        <h2 style={{ margin:'0 0 1.5rem', fontSize:'1.1rem', fontWeight:800, color:'#1a1a1a' }}>
                            <i className="fas fa-lock" style={{ color:'#f5a800', marginRight:'0.5rem' }} />Change Password
                        </h2>
                        <form onSubmit={updatePassword}>
                            {[
                                { name:'current_password', label:'Current Password', placeholder:'Your current password' },
                                { name:'password', label:'New Password', placeholder:'Min 8 characters' },
                                { name:'password_confirmation', label:'Confirm New Password', placeholder:'Re-enter new password' },
                            ].map(field => (
                                <div key={field.name} style={{ marginBottom:'1rem' }}>
                                    <label style={{ display:'block', color:'#cc4400', fontSize:'0.8rem', fontWeight:600, marginBottom:'0.4rem' }}>{field.label}</label>
                                    <div style={{ position:'relative' }}>
                                        <i className="fas fa-lock" style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'#ccc', fontSize:'0.85rem' }} />
                                        <input type="password" value={passForm[field.name]} onChange={e => setPassForm(f=>({...f,[field.name]:e.target.value}))} placeholder={field.placeholder}
                                            style={{ ...inp, paddingLeft:'2.75rem' }}
                                            onFocus={e => e.target.style.borderColor='#f5a800'} onBlur={e => e.target.style.borderColor='#e5e5e5'} />
                                    </div>
                                </div>
                            ))}
                            <button type="submit" style={{ padding:'0.85rem 2.5rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'0.95rem', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'0.5rem', marginTop:'0.5rem' }}>
                                <i className="fas fa-key" /> Update Password
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
