import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from './Layout';

export default function Settings({ settings, admin }) {
    const [form, setForm] = useState({
        site_name:        settings?.site_name || 'Auromax Digital',
        site_email:       settings?.site_email || '',
        site_phone:       settings?.site_phone || '',
        site_address:     settings?.site_address || '',
        razorpay_key:     settings?.razorpay_key || '',
        razorpay_secret:  settings?.razorpay_secret || '',
        stripe_key:       settings?.stripe_key || '',
        stripe_secret:    settings?.stripe_secret || '',
        smtp_host:        settings?.smtp_host || '',
        smtp_port:        settings?.smtp_port || '587',
        smtp_username:    settings?.smtp_username || '',
        smtp_password:    settings?.smtp_password || '',
        mail_from:        settings?.mail_from || '',
        google_analytics: settings?.google_analytics || '',
        facebook_pixel:   settings?.facebook_pixel || '',
        maintenance_mode: settings?.maintenance_mode || '0',
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    const save = (e) => {
        e.preventDefault();
        setSaving(true);
        router.put('/admin/settings', { settings: form }, {
            onSuccess: () => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); },
            onError: () => setSaving(false),
        });
    };

    const inp = { width:'100%', padding:'0.75rem 1rem', background:'#1a1a1a', border:'1.5px solid #2a2a2a', borderRadius:'8px', color:'#fff', fontSize:'0.9rem', outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

    const Field = ({ label, name, type='text', placeholder='' }) => (
        <div style={{ marginBottom:'1.25rem' }}>
            <label style={{ display:'block', color:'#f5a800', fontSize:'0.8rem', fontWeight:600, marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</label>
            <input type={type} value={form[name]} onChange={e => setForm(f => ({...f,[name]:e.target.value}))} placeholder={placeholder} style={inp} />
        </div>
    );

    const tabs = [
        { key:'general', label:'General', icon:'fa-cog' },
        { key:'payment', label:'Payments', icon:'fa-credit-card' },
        { key:'email', label:'Email / SMTP', icon:'fa-envelope' },
        { key:'analytics', label:'Analytics', icon:'fa-chart-line' },
    ];

    return (
        <AdminLayout admin={admin} active="settings">
            <div style={{ marginBottom:'2rem' }}>
                <h1 style={{ color:'#fff', fontSize:'1.5rem', fontWeight:800, margin:0 }}>Settings</h1>
                <p style={{ color:'#666', margin:0, fontSize:'0.85rem' }}>Manage your site configuration</p>
            </div>

            {saved && (
                <div style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:'10px', padding:'0.75rem 1rem', color:'#22c55e', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <i className="fas fa-check-circle" /> Settings saved successfully!
                </div>
            )}

            {/* Tabs */}
            <div style={{ display:'flex', gap:'0.5rem', marginBottom:'2rem', borderBottom:'1px solid rgba(245,168,0,0.15)', paddingBottom:'0' }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding:'0.75rem 1.5rem', background:'transparent', border:'none', borderBottom: activeTab===t.key ? '2px solid #f5a800' : '2px solid transparent', color: activeTab===t.key ? '#f5a800' : '#666', cursor:'pointer', fontWeight: activeTab===t.key ? 700 : 500, fontSize:'0.9rem', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'0.5rem', transition:'all 0.2s' }}>
                        <i className={`fas ${t.icon}`} />{t.label}
                    </button>
                ))}
            </div>

            <form onSubmit={save}>
                <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', padding:'2rem' }}>

                    {activeTab === 'general' && (
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
                            <Field label="Site Name" name="site_name" placeholder="Auromax Digital" />
                            <Field label="Contact Email" name="site_email" type="email" placeholder="hello@auromaxdigital.com" />
                            <Field label="Phone Number" name="site_phone" placeholder="+91 98765 43210" />
                            <Field label="Address" name="site_address" placeholder="Bangalore, India" />
                            <div style={{ gridColumn:'1/-1' }}>
                                <label style={{ display:'block', color:'#f5a800', fontSize:'0.8rem', fontWeight:600, marginBottom:'0.4rem' }}>MAINTENANCE MODE</label>
                                <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                                    <input type="checkbox" checked={form.maintenance_mode==='1'} onChange={e => setForm(f=>({...f,maintenance_mode:e.target.checked?'1':'0'}))} style={{ accentColor:'#f5a800', width:'18px', height:'18px' }} />
                                    <span style={{ color:'#aaa', fontSize:'0.9rem' }}>Enable maintenance mode (site will be offline for visitors)</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payment' && (
                        <div>
                            <h3 style={{ color:'#f5a800', fontSize:'1rem', fontWeight:700, marginTop:0, marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                                <i className="fas fa-rupee-sign" /> Razorpay
                            </h3>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'2rem' }}>
                                <Field label="Razorpay Key ID" name="razorpay_key" placeholder="rzp_live_..." />
                                <Field label="Razorpay Key Secret" name="razorpay_secret" type="password" placeholder="••••••••" />
                            </div>
                            <h3 style={{ color:'#6366f1', fontSize:'1rem', fontWeight:700, marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                                <i className="fab fa-stripe" /> Stripe
                            </h3>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
                                <Field label="Stripe Publishable Key" name="stripe_key" placeholder="pk_live_..." />
                                <Field label="Stripe Secret Key" name="stripe_secret" type="password" placeholder="••••••••" />
                            </div>
                        </div>
                    )}

                    {activeTab === 'email' && (
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
                            <Field label="SMTP Host" name="smtp_host" placeholder="smtp.gmail.com" />
                            <Field label="SMTP Port" name="smtp_port" placeholder="587" />
                            <Field label="SMTP Username" name="smtp_username" placeholder="your@email.com" />
                            <Field label="SMTP Password" name="smtp_password" type="password" placeholder="••••••••" />
                            <Field label="Mail From Address" name="mail_from" placeholder="noreply@auromaxdigital.com" />
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
                            <Field label="Google Analytics ID" name="google_analytics" placeholder="G-XXXXXXXXXX" />
                            <Field label="Facebook Pixel ID" name="facebook_pixel" placeholder="XXXXXXXXXXXXXXXXXX" />
                        </div>
                    )}

                    <div style={{ marginTop:'2rem', paddingTop:'1.5rem', borderTop:'1px solid rgba(245,168,0,0.1)' }}>
                        <button type="submit" disabled={saving} style={{ padding:'0.85rem 2.5rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'1rem', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                            {saving ? <><i className="fas fa-spinner fa-spin" /> Saving...</> : <><i className="fas fa-save" /> Save Settings</>}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
