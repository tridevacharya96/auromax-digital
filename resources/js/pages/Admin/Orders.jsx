import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from './Layout';

const STATUS_COLORS = { pending:'#f5a800', processing:'#3b82f6', shipped:'#8b5cf6', delivered:'#22c55e', cancelled:'#ef4444' };
const PAYMENT_COLORS = { pending:'#f5a800', paid:'#22c55e', failed:'#ef4444', refunded:'#8b5cf6' };

export default function Orders({ orders, filters, admin }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [selected, setSelected] = useState(null);

    const filter = () => router.get('/admin/orders', { search, status }, { preserveState:true });
    const updateStatus = (orderId, newStatus) => {
        router.put(`/admin/orders/${orderId}`, { status: newStatus }, { onSuccess: () => setSelected(null) });
    };

    const fmt = (amount) => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR' }).format(amount||0);

    return (
        <AdminLayout admin={admin} active="orders">
            <div style={{ marginBottom:'2rem' }}>
                <h1 style={{ color:'#fff', fontSize:'1.5rem', fontWeight:800, margin:0 }}>Orders</h1>
                <p style={{ color:'#666', margin:0, fontSize:'0.85rem' }}>{orders.total} total orders</p>
            </div>

            {/* Filters */}
            <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
                <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==='Enter' && filter()} placeholder="Search order # or customer..." style={{ flex:1, minWidth:'200px', padding:'0.75rem 1rem', background:'#111', border:'1px solid rgba(245,168,0,0.2)', borderRadius:'10px', color:'#fff', fontSize:'0.9rem', outline:'none', fontFamily:'inherit' }} />
                <select value={status} onChange={e => { setStatus(e.target.value); setTimeout(filter, 100); }} style={{ padding:'0.75rem 1rem', background:'#111', border:'1px solid rgba(245,168,0,0.2)', borderRadius:'10px', color:'#fff', fontSize:'0.9rem', outline:'none', fontFamily:'inherit' }}>
                    <option value="">All Status</option>
                    {['pending','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                </select>
                <button onClick={filter} style={{ padding:'0.75rem 1.5rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color:'#fff', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                    <i className="fas fa-search" style={{ marginRight:'0.4rem' }} />Search
                </button>
            </div>

            {/* Orders Table */}
            <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', overflow:'hidden' }}>
                <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom:'1px solid #1a1a1a' }}>
                                {['Order #','Customer','Total','Status','Payment','Date','Action'].map(h => (
                                    <th key={h} style={{ padding:'0.75rem 1.5rem', color:'#555', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', textAlign:'left' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data?.length > 0 ? orders.data.map(order => (
                                <tr key={order.id} style={{ borderBottom:'1px solid #161616' }}
                                    onMouseEnter={e => e.currentTarget.style.background='#161616'}
                                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                                    <td style={{ padding:'1rem 1.5rem', color:'#f5a800', fontWeight:700, fontSize:'0.85rem' }}>#{order.order_number}</td>
                                    <td style={{ padding:'1rem 1.5rem' }}>
                                        <div style={{ color:'#fff', fontSize:'0.85rem', fontWeight:600 }}>{order.user?.name||'N/A'}</div>
                                        <div style={{ color:'#666', fontSize:'0.75rem' }}>{order.user?.email}</div>
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem', color:'#fff', fontWeight:700 }}>{fmt(order.total)}</td>
                                    <td style={{ padding:'1rem 1.5rem' }}>
                                        <span style={{ padding:'0.25rem 0.75rem', borderRadius:'50px', background:`${STATUS_COLORS[order.status]}22`, color:STATUS_COLORS[order.status], fontSize:'0.75rem', fontWeight:700, textTransform:'capitalize' }}>{order.status}</span>
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem' }}>
                                        <span style={{ padding:'0.25rem 0.75rem', borderRadius:'50px', background:`${PAYMENT_COLORS[order.payment_status]}22`, color:PAYMENT_COLORS[order.payment_status], fontSize:'0.75rem', fontWeight:700, textTransform:'capitalize' }}>{order.payment_status}</span>
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem', color:'#666', fontSize:'0.8rem' }}>{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                                    <td style={{ padding:'1rem 1.5rem' }}>
                                        <button onClick={() => setSelected(order)} style={{ padding:'0.4rem 0.75rem', background:'rgba(245,168,0,0.1)', border:'1px solid rgba(245,168,0,0.3)', borderRadius:'6px', color:'#f5a800', cursor:'pointer', fontSize:'0.8rem', fontFamily:'inherit' }}>
                                            <i className="fas fa-edit" style={{ marginRight:'0.3rem' }} />Update
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={7} style={{ padding:'3rem', textAlign:'center', color:'#333' }}>
                                    <i className="fas fa-shopping-cart" style={{ fontSize:'2rem', display:'block', marginBottom:'0.5rem', color:'#f5a800' }} />
                                    No orders found
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Update Status Modal */}
            {selected && (
                <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.2)', borderRadius:'16px', padding:'2rem', width:'100%', maxWidth:'400px', margin:'1rem' }}>
                        <h3 style={{ color:'#fff', fontWeight:800, marginTop:0, marginBottom:'1rem' }}>Update Order #{selected.order_number}</h3>
                        <p style={{ color:'#888', fontSize:'0.85rem', marginBottom:'1.5rem' }}>Customer: {selected.user?.name} | Total: {fmt(selected.total)}</p>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'1.5rem' }}>
                            {['pending','processing','shipped','delivered','cancelled'].map(s => (
                                <button key={s} onClick={() => updateStatus(selected.id, s)} style={{ padding:'0.75rem', background: selected.status===s ? `${STATUS_COLORS[s]}33` : '#1a1a1a', border:`1px solid ${selected.status===s ? STATUS_COLORS[s] : '#2a2a2a'}`, borderRadius:'8px', color: selected.status===s ? STATUS_COLORS[s] : '#666', cursor:'pointer', fontWeight:600, textTransform:'capitalize', fontFamily:'inherit', fontSize:'0.85rem' }}>
                                    {s}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setSelected(null)} style={{ width:'100%', padding:'0.75rem', background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'10px', color:'#aaa', cursor:'pointer', fontFamily:'inherit' }}>Close</button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
