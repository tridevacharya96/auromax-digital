import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from './Layout';

const PRESETS = [
    { name: 'Default Black',  bg:'#0a0a0a', sidebar:'#111111', card:'#1a1a1a', border:'rgba(245,168,0,0.15)' },
    { name: 'Deep Navy',      bg:'#0a0f1e', sidebar:'#0f1729', card:'#162040', border:'rgba(99,179,237,0.2)' },
    { name: 'Dark Purple',    bg:'#0d0a1a', sidebar:'#13102a', card:'#1c1535', border:'rgba(139,92,246,0.2)' },
    { name: 'Forest Dark',    bg:'#0a140a', sidebar:'#0f1a0f', card:'#162416', border:'rgba(34,197,94,0.2)' },
    { name: 'Charcoal',       bg:'#1a1a1a', sidebar:'#222222', card:'#2a2a2a', border:'rgba(255,255,255,0.1)' },
    { name: 'Midnight Blue',  bg:'#080c14', sidebar:'#0d1220', card:'#141c30', border:'rgba(59,130,246,0.2)' },
];

export default function Theme({ settings, admin }) {
    const [colors, setColors] = useState({
        admin_bg:      settings?.admin_bg      || '#0a0a0a',
        admin_sidebar: settings?.admin_sidebar || '#111111',
        admin_card:    settings?.admin_card    || '#1a1a1a',
        admin_border:  settings?.admin_border  || 'rgba(245,168,0,0.15)',
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const applyPreset = (preset) => {
        setColors({
            admin_bg:      preset.bg,
            admin_sidebar: preset.sidebar,
            admin_card:    preset.card,
            admin_border:  preset.border,
        });
    };

    const save = () => {
        setSaving(true);
        router.put('/admin/settings', { settings: colors }, {
            onSuccess: () => {
                setSaving(false);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
                // Apply immediately
                document.documentElement.style.setProperty('--admin-bg',      colors.admin_bg);
                document.documentElement.style.setProperty('--admin-sidebar', colors.admin_sidebar);
                document.documentElement.style.setProperty('--admin-card',    colors.admin_card);
            },
            onError: () => setSaving(false),
        });
    };

    const fields = [
        { key:'admin_bg',      label:'Main Background',  hint:'Overall page background color' },
        { key:'admin_sidebar', label:'Sidebar Background', hint:'Left navigation panel color' },
        { key:'admin_card',    label:'Card Background',  hint:'Cards, tables, modals color' },
    ];

    return (
        <AdminLayout admin={admin} active="theme">
            <div style={{ marginBottom:'2rem' }}>
                <h1 style={{ color:'#fff', fontSize:'1.5rem', fontWeight:800, margin:0 }}>
                    <i className="fas fa-paint-brush" style={{ color:'#f5a800', marginRight:'0.75rem' }} />
                    Admin Theme
                </h1>
                <p style={{ color:'#666', margin:0, fontSize:'0.85rem' }}>Customize the admin dashboard background colors</p>
            </div>

            {saved && (
                <div style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:'10px', padding:'0.75rem 1rem', color:'#22c55e', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <i className="fas fa-check-circle" /> Theme saved and applied!
                </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>

                {/* Color Pickers */}
                <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', padding:'2rem' }}>
                    <h2 style={{ color:'#fff', fontSize:'1rem', fontWeight:800, marginTop:0, marginBottom:'1.5rem' }}>
                        <i className="fas fa-palette" style={{ color:'#f5a800', marginRight:'0.5rem' }} />Background Colors
                    </h2>

                    {fields.map(field => (
                        <div key={field.key} style={{ marginBottom:'1.75rem' }}>
                            <label style={{ display:'block', color:'#f5a800', fontSize:'0.8rem', fontWeight:600, marginBottom:'0.5rem', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                                {field.label}
                            </label>
                            <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                                <div style={{ position:'relative', width:'64px', height:'48px', borderRadius:'10px', overflow:'hidden', border:'2px solid rgba(255,255,255,0.15)', flexShrink:0, cursor:'pointer' }}>
                                    <input type="color" value={colors[field.key].startsWith('rgba') ? '#1a1a1a' : colors[field.key]}
                                        onChange={e => setColors(c => ({...c,[field.key]:e.target.value}))}
                                        style={{ position:'absolute', inset:'-8px', width:'calc(100% + 16px)', height:'calc(100% + 16px)', cursor:'pointer', border:'none', padding:0 }} />
                                </div>
                                <div style={{ flex:1 }}>
                                    <input type="text" value={colors[field.key]}
                                        onChange={e => setColors(c => ({...c,[field.key]:e.target.value}))}
                                        style={{ width:'100%', padding:'0.65rem 0.75rem', background:'#1a1a1a', border:'1.5px solid #2a2a2a', borderRadius:'8px', color:'#fff', fontSize:'0.85rem', outline:'none', fontFamily:'monospace', boxSizing:'border-box' }}
                                        onFocus={e => e.target.style.borderColor='#f5a800'}
                                        onBlur={e => e.target.style.borderColor='#2a2a2a'} />
                                    <p style={{ color:'#444', fontSize:'0.72rem', margin:'0.25rem 0 0' }}>{field.hint}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button onClick={save} disabled={saving} style={{ width:'100%', padding:'0.9rem', background: saving?'#333':'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color:'#fff', fontWeight:700, cursor: saving?'not-allowed':'pointer', fontSize:'1rem', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                        {saving ? <><i className="fas fa-spinner fa-spin" /> Saving...</> : <><i className="fas fa-save" /> Save & Apply</>}
                    </button>
                </div>

                {/* Right Column */}
                <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>

                    {/* Live Preview */}
                    <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', padding:'1.5rem' }}>
                        <h2 style={{ color:'#fff', fontSize:'1rem', fontWeight:800, marginTop:0, marginBottom:'1.25rem' }}>
                            <i className="fas fa-eye" style={{ color:'#f5a800', marginRight:'0.5rem' }} />Live Preview
                        </h2>
                        {/* Mini dashboard preview */}
                        <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', display:'flex', height:'220px' }}>
                            {/* Sidebar */}
                            <div style={{ width:'80px', background:colors.admin_sidebar, padding:'0.75rem 0.5rem', display:'flex', flexDirection:'column', gap:'0.4rem', borderRight:`1px solid ${colors.admin_border}` }}>
                                <div style={{ width:'40px', height:'20px', background:'linear-gradient(135deg,#cc0000,#f5a800)', borderRadius:'4px', margin:'0 auto 0.5rem' }} />
                                {['fa-tachometer-alt','fa-box','fa-users','fa-cog'].map((icon,i) => (
                                    <div key={i} style={{ padding:'0.4rem', borderRadius:'6px', background: i===0 ? 'rgba(245,168,0,0.15)' : 'transparent', borderLeft: i===0 ? '2px solid #f5a800' : '2px solid transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                        <i className={`fas ${icon}`} style={{ color: i===0 ? '#f5a800' : '#444', fontSize:'0.7rem' }} />
                                    </div>
                                ))}
                            </div>
                            {/* Main */}
                            <div style={{ flex:1, background:colors.admin_bg, padding:'0.75rem' }}>
                                {/* Topbar */}
                                <div style={{ background:colors.admin_sidebar, borderRadius:'6px', padding:'0.4rem 0.75rem', marginBottom:'0.75rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                    <span style={{ color:'#fff', fontSize:'0.7rem', fontWeight:700 }}>Dashboard</span>
                                    <span style={{ color:'#666', fontSize:'0.65rem' }}>Admin</span>
                                </div>
                                {/* Cards */}
                                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'0.5rem' }}>
                                    {['#f5a800','#cc0000','#22c55e','#3b82f6'].map((color,i) => (
                                        <div key={i} style={{ background:colors.admin_card, borderRadius:'6px', padding:'0.5rem', borderLeft:`3px solid ${color}` }}>
                                            <div style={{ color:'#fff', fontSize:'0.75rem', fontWeight:700 }}>₹0</div>
                                            <div style={{ color:'#444', fontSize:'0.6rem' }}>Stat {i+1}</div>
                                        </div>
                                    ))}
                                </div>
                                {/* Table */}
                                <div style={{ background:colors.admin_card, borderRadius:'6px', padding:'0.5rem', border:`1px solid ${colors.admin_border}` }}>
                                    <div style={{ color:'#666', fontSize:'0.6rem', marginBottom:'0.3rem', borderBottom:`1px solid ${colors.admin_border}`, paddingBottom:'0.3rem' }}>Recent Orders</div>
                                    {[1,2].map(i => (
                                        <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'0.2rem 0', borderBottom:`1px solid ${colors.admin_border}` }}>
                                            <span style={{ color:'#f5a800', fontSize:'0.6rem' }}>#ORD00{i}</span>
                                            <span style={{ color:'#fff', fontSize:'0.6rem' }}>₹999</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preset Themes */}
                    <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', padding:'1.5rem' }}>
                        <h2 style={{ color:'#fff', fontSize:'1rem', fontWeight:800, marginTop:0, marginBottom:'1.25rem' }}>
                            <i className="fas fa-swatchbook" style={{ color:'#f5a800', marginRight:'0.5rem' }} />Preset Themes
                        </h2>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                            {PRESETS.map(preset => (
                                <button key={preset.name} onClick={() => applyPreset(preset)}
                                    style={{ padding:'0.75rem', background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'10px', cursor:'pointer', textAlign:'left', fontFamily:'inherit', transition:'all 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor='#f5a800'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor='#2a2a2a'}>
                                    <div style={{ display:'flex', gap:'0.35rem', marginBottom:'0.5rem' }}>
                                        {[preset.bg, preset.sidebar, preset.card].map((c,i) => (
                                            <div key={i} style={{ width:'20px', height:'20px', borderRadius:'50%', background:c, border:'1px solid rgba(255,255,255,0.15)' }} />
                                        ))}
                                    </div>
                                    <div style={{ color:'#fff', fontSize:'0.8rem', fontWeight:600 }}>{preset.name}</div>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => applyPreset(PRESETS[0])} style={{ width:'100%', marginTop:'0.75rem', padding:'0.6rem', background:'transparent', border:'1px solid #2a2a2a', borderRadius:'8px', color:'#666', cursor:'pointer', fontSize:'0.8rem', fontFamily:'inherit' }}>
                            <i className="fas fa-undo" style={{ marginRight:'0.4rem' }} />Reset to Default
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
