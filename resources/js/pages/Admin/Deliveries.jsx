import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from './Layout';

const STATUS_COLORS = {
    pending:          '#f5a800',
    packed:           '#3b82f6',
    shipped:          '#8b5cf6',
    out_for_delivery: '#f59e0b',
    delivered:        '#22c55e',
    returned:         '#ef4444',
};

const STATUS_ICONS = {
    pending:          'fa-clock',
    packed:           'fa-box',
    shipped:          'fa-shipping-fast',
    out_for_delivery: 'fa-truck',
    delivered:        'fa-check-circle',
    returned:         'fa-undo',
};

export default function Deliveries({ deliveries, filters, admin }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [selected, setSelected] = useState(null);
    const [editForm, setEditForm] = useState({});

    const filter = () => router.get('/admin/deliveries', { search, status }, { preserveState:true });

    const openEdit = (delivery) => {
        setSelected(delivery);
        setEditForm({
            status:             delivery.status,
            tracking_number:    delivery.tracking_number || '',
            carrier:            delivery.carrier || '',
            estimated_delivery: delivery.estimated_delivery || '',
        });
    };

    const save = () => {
        router.put(`/admin/deliveries/${selected.id}`, editForm, {
            onSuccess: () => setSelected(null),
        });
    };

    const inp = { width:'100%', padding:'0.75rem 1rem', background:'#1a1a1a', border:'1.5px solid #2a2a2a', borderRadius:'8px', color:'#fff', fontSize:'0.9rem', outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

    return (
        <AdminLayout admin={admin} active="deliveries">
            <div style={{ marginBottom:'2rem' }}>
                <h1 style={{ color:'#fff', fontSize:'1.5rem', fontWeight:800, margin:0 }}>Deliveries</h1>
                <p style={{ color:'#666', margin:0, fontSize:'0.85rem' }}>{deliveries.total} total deliveries</p>
            </div>

            {/* Status Summary */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'1rem', marginBottom:'2rem' }}>
                {Object.entries(STATUS_COLORS).map(([s, color]) => (
                    <button key={s} onClick={() => { setStatus(s); setTimeout(filter, 100); }}
                        style={{ background:'#111', border:`1px solid ${status===s ? color : 'rgba(245,168,0,0.15)'}`, borderRadius:'12px', padding:'1rem', cursor:'pointer', textAlign:'center', fontFamily:'inherit', transition:'all 0.2s' }}>
                        <i className={`fas ${STATUS_ICONS[s]}`} style={{ color, fontSize:'1.2rem', display:'block', marginBottom:'0.4rem' }} />
                        <div style={{ color:'#fff', fontSize:'0.7rem', fontWeight:600, textTransform:'capitalize' }}>{s.replace('_',' ')}</div>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
                <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==='Enter' && filter()}
                    placeholder="Search tracking # or customer..."
                    style={{ flex:1, minWidth:'200px', padding:'0.75rem 1rem', background:'#111', border:'1px solid rgba(245,168,0,0.2)', borderRadius:'10px', color:'#fff', fontSize:'0.9rem', outline:'none', fontFamily:'inherit' }} />
                <select value={status} onChange={e => { setStatus(e.target.value); setTimeout(filter, 100); }}
                    style={{ padding:'0.75rem 1rem', background:'#111', border:'1px solid rgba(245,168,0,0.2)', borderRadius:'10px', color:'#fff', fontSize:'0.9rem', outline:'none', fontFamily:'inherit' }}>
                    <option value="">All Status</option>
                    {Object.keys(STATUS_COLORS).map(s => (
                        <option key={s} value={s}>{s.replace('_',' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                    ))}
                </select>
                <button onClick={() => { setStatus(''); setSearch(''); router.get('/admin/deliveries'); }}
                    style={{ padding:'0.75rem 1rem', background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'10px', color:'#aaa', cursor:'pointer', fontFamily:'inherit' }}>
                    <i className="fas fa-times" style={{ marginRight:'0.4rem' }} />Clear
                </button>
            </div>

            {/* Table */}
            <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', overflow:'hidden' }}>
                <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom:'1px solid #1a1a1a' }}>
                                {['Order #','Customer','Tracking #','Carrier','Status','Est. Delivery','Action'].map(h => (
                                    <th key={h} style={{ padding:'0.75rem 1.5rem', color:'#555', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', textAlign:'left' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.data?.length > 0 ? deliveries.data.map(d => (
                                <tr key={d.id} style={{ borderBottom:'1px solid #161616' }}
                                    onMouseEnter={e => e.currentTarget.style.background='#161616'}
                                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                                    <td style={{ padding:'1rem 1.5rem', color:'#f5a800', fontWeight:700, fontSize:'0.85rem' }}>
                                        #{d.order?.order_number || 'N/A'}
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem' }}>
                                        <div style={{ color:'#fff', fontSize:'0.85rem', fontWeight:600 }}>{d.order?.user?.name || 'N/A'}</div>
                                        <div style={{ color:'#666', fontSize:'0.75rem' }}>{d.city}, {d.state}</div>
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem', color:'#aaa', fontSize:'0.82rem', fontFamily:'monospace' }}>
                                        {d.tracking_number || '—'}
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem', color:'#aaa', fontSize:'0.85rem' }}>
                                        {d.carrier || '—'}
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem' }}>
                                        <span style={{ padding:'0.25rem 0.75rem', borderRadius:'50px', background:`${STATUS_COLORS[d.status]}22`, color:STATUS_COLORS[d.status], fontSize:'0.75rem', fontWeight:700, textTransform:'capitalize', display:'inline-flex', alignItems:'center', gap:'0.3rem' }}>
                                            <i className={`fas ${STATUS_ICONS[d.status]}`} />
                                            {d.status?.replace('_',' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem', color:'#666', fontSize:'0.8rem' }}>
                                        {d.estimated_delivery ? new Date(d.estimated_delivery).toLocaleDateString('en-IN') : '—'}
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem' }}>
                                        <button onClick={() => openEdit(d)}
                                            style={{ padding:'0.4rem 0.75rem', background:'rgba(245,168,0,0.1)', border:'1px solid rgba(245,168,0,0.3)', borderRadius:'6px', color:'#f5a800', cursor:'pointer', fontSize:'0.8rem', fontFamily:'inherit' }}>
                                            <i className="fas fa-edit" style={{ marginRight:'0.3rem' }} />Update
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} style={{ padding:'3rem', textAlign:'center', color:'#333' }}>
                                        <i className="fas fa-truck" style={{ fontSize:'2rem', display:'block', marginBottom:'0.5rem', color:'#f5a800' }} />
                                        No deliveries found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Update Modal */}
            {selected && (
                <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
                    <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.2)', borderRadius:'16px', padding:'2rem', width:'100%', maxWidth:'480px' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                            <h3 style={{ color:'#fff', fontWeight:800, margin:0 }}>Update Delivery</h3>
                            <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:'#666', cursor:'pointer', fontSize:'1.2rem' }}>
                                <i className="fas fa-times" />
                            </button>
                        </div>

                        <p style={{ color:'#888', fontSize:'0.85rem', marginBottom:'1.5rem' }}>
                            Order #{selected.order?.order_number} — {selected.order?.user?.name}
                        </p>

                        {/* Status Buttons */}
                        <div style={{ marginBottom:'1.5rem' }}>
                            <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.75rem', textTransform:'uppercase' }}>Delivery Status</label>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.5rem' }}>
                                {Object.keys(STATUS_COLORS).map(s => (
                                    <button key={s} onClick={() => setEditForm(f => ({...f, status:s}))}
                                        style={{ padding:'0.6rem 0.4rem', background: editForm.status===s ? `${STATUS_COLORS[s]}22` : '#1a1a1a', border:`1px solid ${editForm.status===s ? STATUS_COLORS[s] : '#2a2a2a'}`, borderRadius:'8px', color: editForm.status===s ? STATUS_COLORS[s] : '#666', cursor:'pointer', fontWeight:600, fontSize:'0.72rem', textTransform:'capitalize', fontFamily:'inherit', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.3rem' }}>
                                        <i className={`fas ${STATUS_ICONS[s]}`} />
                                        {s.replace('_',' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                            <div>
                                <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Tracking Number</label>
                                <input style={inp} value={editForm.tracking_number} onChange={e => setEditForm(f=>({...f,tracking_number:e.target.value}))} placeholder="e.g. DTDC123456" />
                            </div>
                            <div>
                                <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Carrier</label>
                                <input style={inp} value={editForm.carrier} onChange={e => setEditForm(f=>({...f,carrier:e.target.value}))} placeholder="e.g. DTDC, Bluedart" />
                            </div>
                        </div>

                        <div style={{ marginBottom:'1.5rem' }}>
                            <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Estimated Delivery Date</label>
                            <input type="date" style={inp} value={editForm.estimated_delivery} onChange={e => setEditForm(f=>({...f,estimated_delivery:e.target.value}))} />
                        </div>

                        <div style={{ display:'flex', gap:'1rem' }}>
                            <button onClick={save} style={{ flex:1, padding:'0.85rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color:'#fff', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                                <i className="fas fa-save" style={{ marginRight:'0.5rem' }} />Save Changes
                            </button>
                            <button onClick={() => setSelected(null)} style={{ padding:'0.85rem 1.5rem', background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'10px', color:'#aaa', cursor:'pointer', fontFamily:'inherit' }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
