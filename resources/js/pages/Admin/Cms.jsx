import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from './Layout';

const SECTIONS = [
    {
        key: 'hero',
        label: '🏠 Hero Section',
        icon: 'fa-home',
        fields: [
            { key: 'badge', label: 'Badge Text', type: 'text' },
            { key: 'heading', label: 'Main Heading', type: 'text' },
            { key: 'subheading', label: 'Subheading', type: 'textarea' },
            { key: 'btn_primary', label: 'Primary Button Text', type: 'text' },
            { key: 'btn_secondary', label: 'Secondary Button Text', type: 'text' },
        ],
    },
    {
        key: 'stats',
        label: '📊 Stats Section',
        icon: 'fa-chart-bar',
        fields: [
            { key: 'stat1_value', label: 'Stat 1 Value', type: 'text' },
            { key: 'stat1_label', label: 'Stat 1 Label', type: 'text' },
            { key: 'stat2_value', label: 'Stat 2 Value', type: 'text' },
            { key: 'stat2_label', label: 'Stat 2 Label', type: 'text' },
            { key: 'stat3_value', label: 'Stat 3 Value', type: 'text' },
            { key: 'stat3_label', label: 'Stat 3 Label', type: 'text' },
            { key: 'stat4_value', label: 'Stat 4 Value', type: 'text' },
            { key: 'stat4_label', label: 'Stat 4 Label', type: 'text' },
        ],
    },
    {
        key: 'features',
        label: '⚡ Features Section',
        icon: 'fa-bolt',
        fields: [
            { key: 'tag', label: 'Section Tag', type: 'text' },
            { key: 'heading', label: 'Section Heading', type: 'text' },
            { key: 'subheading', label: 'Section Subheading', type: 'text' },
        ],
    },
    {
        key: 'pricing',
        label: '💰 Pricing Section',
        icon: 'fa-tag',
        fields: [
            { key: 'tag', label: 'Section Tag', type: 'text' },
            { key: 'heading', label: 'Section Heading', type: 'text' },
            { key: 'subheading', label: 'Section Subheading', type: 'text' },
        ],
    },
    {
        key: 'team',
        label: '👥 Team Section',
        icon: 'fa-users',
        fields: [
            { key: 'tag', label: 'Section Tag', type: 'text' },
            { key: 'heading', label: 'Section Heading', type: 'text' },
            { key: 'subheading', label: 'Section Subheading', type: 'text' },
        ],
    },
    {
        key: 'contact',
        label: '📞 Contact Section',
        icon: 'fa-envelope',
        fields: [
            { key: 'email', label: 'Email Address', type: 'text' },
            { key: 'phone', label: 'Phone Number', type: 'text' },
            { key: 'location', label: 'Location', type: 'text' },
            { key: 'heading', label: 'Section Heading', type: 'text' },
            { key: 'subheading', label: 'Section Subheading', type: 'textarea' },
        ],
    },
    {
        key: 'footer',
        label: '🦶 Footer',
        icon: 'fa-grip-lines',
        fields: [
            { key: 'description', label: 'Footer Description', type: 'textarea' },
            { key: 'twitter', label: 'Twitter URL', type: 'text' },
            { key: 'linkedin', label: 'LinkedIn URL', type: 'text' },
            { key: 'github', label: 'GitHub URL', type: 'text' },
            { key: 'instagram', label: 'Instagram URL', type: 'text' },
        ],
    },
];

export default function Cms({ cms, admin }) {
    const [activeSection, setActiveSection] = useState('hero');
    const [values, setValues] = useState(cms || {});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const section = SECTIONS.find(s => s.key === activeSection);

    const getValue = (section, key) => values?.[section]?.[key] || '';

    const setValue = (section, key, val) => {
        setValues(v => ({
            ...v,
            [section]: { ...(v[section] || {}), [key]: val },
        }));
    };

    const save = (field) => {
        setSaving(true);
        router.put('/admin/cms', {
            section: activeSection,
            key: field.key,
            value: getValue(activeSection, field.key),
        }, {
            onSuccess: () => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); },
            onError: () => setSaving(false),
        });
    };

    const inp = { width:'100%', padding:'0.75rem 1rem', background:'#1a1a1a', border:'1.5px solid #2a2a2a', borderRadius:'8px', color:'#fff', fontSize:'0.9rem', outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

    return (
        <AdminLayout admin={admin} active="cms">
            <div style={{ marginBottom:'2rem' }}>
                <h1 style={{ color:'#fff', fontSize:'1.5rem', fontWeight:800, margin:0 }}>CMS Manager</h1>
                <p style={{ color:'#666', margin:0, fontSize:'0.85rem' }}>Edit your website content from here</p>
            </div>

            {saved && (
                <div style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:'10px', padding:'0.75rem 1rem', color:'#22c55e', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <i className="fas fa-check-circle" /> Content saved successfully!
                </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', gap:'1.5rem' }}>
                {/* Section tabs */}
                <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', padding:'1rem', height:'fit-content' }}>
                    {SECTIONS.map(s => (
                        <button key={s.key} onClick={() => setActiveSection(s.key)} style={{ width:'100%', padding:'0.75rem 1rem', background: activeSection===s.key ? 'rgba(245,168,0,0.1)' : 'transparent', border:'none', borderLeft: activeSection===s.key ? '3px solid #f5a800' : '3px solid transparent', color: activeSection===s.key ? '#f5a800' : '#666', cursor:'pointer', textAlign:'left', borderRadius:'0 8px 8px 0', fontSize:'0.85rem', fontWeight: activeSection===s.key ? 700 : 500, fontFamily:'inherit', marginBottom:'0.25rem', transition:'all 0.2s' }}>
                            <i className={`fas ${s.icon}`} style={{ marginRight:'0.5rem', width:'16px' }} />
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Fields */}
                <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', padding:'2rem' }}>
                    <h2 style={{ color:'#fff', fontSize:'1.1rem', fontWeight:800, marginTop:0, marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                        <i className={`fas ${section?.icon}`} style={{ color:'#f5a800' }} />
                        {section?.label}
                    </h2>
                    {section?.fields.map(field => (
                        <div key={field.key} style={{ marginBottom:'1.5rem' }}>
                            <label style={{ display:'block', color:'#f5a800', fontSize:'0.8rem', fontWeight:600, marginBottom:'0.5rem', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                                {field.label}
                            </label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    value={getValue(activeSection, field.key)}
                                    onChange={e => setValue(activeSection, field.key, e.target.value)}
                                    style={{ ...inp, minHeight:'100px', resize:'vertical' }}
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={getValue(activeSection, field.key)}
                                    onChange={e => setValue(activeSection, field.key, e.target.value)}
                                    style={inp}
                                />
                            )}
                            <button onClick={() => save(field)} disabled={saving} style={{ marginTop:'0.5rem', padding:'0.5rem 1.25rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'8px', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'0.8rem', fontFamily:'inherit' }}>
                                {saving ? <><i className="fas fa-spinner fa-spin" /> Saving...</> : <><i className="fas fa-save" style={{ marginRight:'0.4rem' }} />Save</>}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
