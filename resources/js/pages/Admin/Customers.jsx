import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from './Layout';

export default function Customers({ customers, filters, admin }) {
    const [search, setSearch] = useState(filters?.search || '');

    const filter = () => router.get('/admin/customers', { search }, { preserveState:true });
    const deleteCustomer = (id) => { if (confirm('Delete this customer?')) router.delete(`/admin/customers/${id}`); };

    return (
        <AdminLayout admin={admin} active="customers">
            <div style={{ marginBottom:'2rem' }}>
                <h1 style={{ color:'#fff', fontSize:'1.5rem', fontWeight:800, margin:0 }}>Customers</h1>
                <p style={{ color:'#666', margin:0, fontSize:'0.85rem' }}>{customers.total} total customers</p>
            </div>

            <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem' }}>
                <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==='Enter' && filter()} placeholder="Search by name or email..." style={{ flex:1, padding:'0.75rem 1rem', background:'#111', border:'1px solid rgba(245,168,0,0.2)', borderRadius:'10px', color:'#fff', fontSize:'0.9rem', outline:'none', fontFamily:'inherit' }} />
                <button onClick={filter} style={{ padding:'0.75rem 1.5rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color:'#fff', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                    <i className="fas fa-search" style={{ marginRight:'0.4rem' }} />Search
                </button>
            </div>

            <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', overflow:'hidden' }}>
                <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom:'1px solid #1a1a1a' }}>
                                {['Customer','Email','Orders','Joined','Action'].map(h => (
                                    <th key={h} style={{ padding:'0.75rem 1.5rem', color:'#555', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', textAlign:'left' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {customers.data?.length > 0 ? customers.data.map(c => (
                                <tr key={c.id} style={{ borderBottom:'1px solid #161616' }}
                                    onMouseEnter={e => e.currentTarget.style.background='#161616'}
                                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                                    <td style={{ padding:'1rem 1.5rem' }}>
                                        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                                            <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'linear-gradient(135deg,#cc0000,#f5a800)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'0.9rem', flexShrink:0 }}>
                                                {c.name?.charAt(0)||'?'}
                                            </div>
                                            <span style={{ color:'#fff', fontWeight:600, fontSize:'0.9rem' }}>{c.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem', color:'#888', fontSize:'0.85rem' }}>{c.email}</td>
                                    <td style={{ padding:'1rem 1.5rem' }}>
                                        <span style={{ padding:'0.25rem 0.75rem', borderRadius:'50px', background:'rgba(245,168,0,0.1)', color:'#f5a800', fontSize:'0.8rem', fontWeight:700 }}>{c.orders_count} orders</span>
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem', color:'#666', fontSize:'0.8rem' }}>{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                                    <td style={{ padding:'1rem 1.5rem' }}>
                                        <button onClick={() => deleteCustomer(c.id)} style={{ padding:'0.4rem 0.75rem', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'6px', color:'#ef4444', cursor:'pointer', fontSize:'0.8rem', fontFamily:'inherit' }}>
                                            <i className="fas fa-trash" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} style={{ padding:'3rem', textAlign:'center', color:'#333' }}>
                                    <i className="fas fa-users" style={{ fontSize:'2rem', display:'block', marginBottom:'0.5rem', color:'#f5a800' }} />
                                    No customers yet
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
