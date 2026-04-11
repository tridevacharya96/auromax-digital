import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from './Layout';

const STATUS_COLORS = { success:'#22c55e', pending:'#f5a800', failed:'#ef4444', refunded:'#8b5cf6' };

export default function Payments({ payments, filters, totals, admin }) {
    const [status, setStatus] = useState(filters?.status || '');
    const [gateway, setGateway] = useState(filters?.gateway || '');
    const [from, setFrom] = useState(filters?.from || '');
    const [to, setTo] = useState(filters?.to || '');

    const filter = () => router.get('/admin/payments', { status, gateway, from, to }, { preserveState:true });
    const fmt = (amount) => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR' }).format(amount||0);

    return (
        <AdminLayout admin={admin} active="payments">
            <div style={{ marginBottom:'2rem' }}>
                <h1 style={{ color:'#fff', fontSize:'1.5rem', fontWeight:800, margin:0 }}>Payments</h1>
                <p style={{ color:'#666', margin:0, fontSize:'0.85rem' }}>All transactions and payment records</p>
            </div>

            {/* Totals */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.5rem', marginBottom:'2rem' }}>
                {[
                    { label:'Total Collected', value:totals?.totalSuccess, color:'#22c55e', icon:'fa-check-circle' },
                    { label:'Pending', value:totals?.totalPending, color:'#f5a800', icon:'fa-clock' },
                    { label:'Failed', value:totals?.totalFailed, color:'#ef4444', icon:'fa-times-circle' },
                    { label:'Refunded', value:totals?.totalRefunded, color:'#8b5cf6', icon:'fa-undo' },
                ].map(t => (
                    <div key={t.label} style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', padding:'1.5rem', borderLeft:`4px solid ${t.color}` }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.75rem' }}>
                            <i className={`fas ${t.icon}`} style={{ color:t.color, fontSize:'1.3rem' }} />
                            <span style={{ color:'#444', fontSize:'0.75rem', fontWeight:600, textTransform:'uppercase' }}>{t.label}</span>
                        </div>
                        <div style={{ fontSize:'1.6rem', fontWeight:900, color:'#fff' }}>{fmt(t.value)}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
                <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding:'0.75rem 1rem', background:'#111', border:'1px solid rgba(245,168,0,0.2)', borderRadius:'10px', color:'#fff', fontSize:'0.9rem', outline:'none', fontFamily:'inherit' }}>
                    <option value="">All Status</option>
                    {['success','pending','failed','refunded'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                </select>
                <select value={gateway} onChange={e => setGateway(e.target.value)} style={{ padding:'0.75rem 1rem', background:'#111', border:'1px solid rgba(245,168,0,0.2)', borderRadius:'10px', color:'#fff', fontSize:'0.9rem', outline:'none', fontFamily:'inherit' }}>
                    <option value="">All Gateways</option>
                    <option value="razorpay">Razorpay</option>
                    <option value="stripe">Stripe</option>
                </select>
                <input type="date" value={from} onChange={e => setFrom(e.target.value)} style={{ padding:'0.75rem 1rem', background:'#111', border:'1px solid rgba(245,168,0,0.2)', borderRadius:'10px', color:'#fff', fontSize:'0.9rem', outline:'none', fontFamily:'inherit' }} />
                <input type="date" value={to} onChange={e => setTo(e.target.value)} style={{ padding:'0.75rem 1rem', background:'#111', border:'1px solid rgba(245,168,0,0.2)', borderRadius:'10px', color:'#fff', fontSize:'0.9rem', outline:'none', fontFamily:'inherit' }} />
                <button onClick={filter} style={{ padding:'0.75rem 1.5rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color:'#fff', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                    <i className="fas fa-filter" style={{ marginRight:'0.4rem' }} />Filter
                </button>
            </div>

            {/* Table */}
            <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', overflow:'hidden' }}>
                <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom:'1px solid #1a1a1a' }}>
                                {['Payment ID','Customer','Order','Gateway','Amount','Status','Date'].map(h => (
                                    <th key={h} style={{ padding:'0.75rem 1.5rem', color:'#555', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', textAlign:'left' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {payments.data?.length > 0 ? payments.data.map(p => (
                                <tr key={p.id} style={{ borderBottom:'1px solid #161616' }}
                                    onMouseEnter={e => e.currentTarget.style.background='#161616'}
                                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                                    <td style={{ padding:'1rem 1.5rem', color:'#f5a800', fontWeight:700, fontSize:'0.8rem', fontFamily:'monospace' }}>{p.payment_id}</td>
                                    <td style={{ padding:'1rem 1.5rem', color:'#fff', fontSize:'0.85rem' }}>{p.order?.user?.name||'N/A'}</td>
                                    <td style={{ padding:'1rem 1.5rem', color:'#888', fontSize:'0.85rem' }}>#{p.order?.order_number||'N/A'}</td>
                                    <td style={{ padding:'1rem 1.5rem' }}>
                                        <span style={{ padding:'0.25rem 0.75rem', borderRadius:'50px', background: p.gateway==='razorpay' ? 'rgba(59,130,246,0.15)' : 'rgba(99,102,241,0.15)', color: p.gateway==='razorpay' ? '#3b82f6' : '#6366f1', fontSize:'0.75rem', fontWeight:700, textTransform:'capitalize' }}>
                                            {p.gateway||'N/A'}
                                        </span>
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem', color:'#fff', fontWeight:700 }}>{fmt(p.amount)}</td>
                                    <td style={{ padding:'1rem 1.5rem' }}>
                                        <span style={{ padding:'0.25rem 0.75rem', borderRadius:'50px', background:`${STATUS_COLORS[p.status]}22`, color:STATUS_COLORS[p.status], fontSize:'0.75rem', fontWeight:700, textTransform:'capitalize' }}>{p.status}</span>
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem', color:'#666', fontSize:'0.8rem' }}>{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={7} style={{ padding:'3rem', textAlign:'center', color:'#333' }}>
                                    <i className="fas fa-credit-card" style={{ fontSize:'2rem', display:'block', marginBottom:'0.5rem', color:'#f5a800' }} />
                                    No payments yet
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
