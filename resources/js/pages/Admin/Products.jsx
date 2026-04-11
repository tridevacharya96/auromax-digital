import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from './Layout';

export default function Products({ products, admin }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name:'', description:'', type:'digital', price:'', sale_price:'', stock:'0', category:'', is_active:true, is_featured:false });

    const reset = () => { setForm({ name:'', description:'', type:'digital', price:'', sale_price:'', stock:'0', category:'', is_active:true, is_featured:false }); setEditing(null); setShowForm(false); };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            router.put(`/admin/products/${editing.id}`, form, { onSuccess: reset });
        } else {
            router.post('/admin/products', form, { onSuccess: reset });
        }
    };

    const editProduct = (p) => {
        setEditing(p);
        setForm({ name:p.name, description:p.description||'', type:p.type, price:p.price, sale_price:p.sale_price||'', stock:p.stock||0, category:p.category||'', is_active:p.is_active, is_featured:p.is_featured });
        setShowForm(true);
    };

    const deleteProduct = (id) => {
        if (confirm('Delete this product?')) router.delete(`/admin/products/${id}`);
    };

    const inp = { width:'100%', padding:'0.75rem 1rem', background:'#1a1a1a', border:'1.5px solid #2a2a2a', borderRadius:'8px', color:'#fff', fontSize:'0.9rem', outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

    return (
        <AdminLayout admin={admin} active="products">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
                <div>
                    <h1 style={{ color:'#fff', fontSize:'1.5rem', fontWeight:800, margin:0 }}>Products</h1>
                    <p style={{ color:'#666', margin:0, fontSize:'0.85rem' }}>{products.total} total products</p>
                </div>
                <button onClick={() => { reset(); setShowForm(true); }} style={{ padding:'0.75rem 1.5rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color:'#fff', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:'0.5rem', fontFamily:'inherit' }}>
                    <i className="fas fa-plus" /> Add Product
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
                    <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.2)', borderRadius:'16px', padding:'2rem', width:'100%', maxWidth:'600px', maxHeight:'90vh', overflowY:'auto' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                            <h2 style={{ color:'#fff', fontWeight:800, margin:0 }}>{editing ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={reset} style={{ background:'none', border:'none', color:'#666', cursor:'pointer', fontSize:'1.2rem' }}><i className="fas fa-times" /></button>
                        </div>
                        <form onSubmit={submit}>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                                <div>
                                    <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Product Name *</label>
                                    <input style={inp} value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} required placeholder="e.g. Celebrity Video Wish" />
                                </div>
                                <div>
                                    <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Category</label>
                                    <input style={inp} value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} placeholder="e.g. Celebrity, Digital, Physical" />
                                </div>
                            </div>
                            <div style={{ marginBottom:'1rem' }}>
                                <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Description</label>
                                <textarea style={{...inp, minHeight:'80px', resize:'vertical'}} value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="Product description..." />
                            </div>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                                <div>
                                    <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Type *</label>
                                    <select style={inp} value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}>
                                        <option value="digital">Digital</option>
                                        <option value="physical">Physical</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Price (₹) *</label>
                                    <input style={inp} type="number" value={form.price} onChange={e => setForm(f=>({...f,price:e.target.value}))} required placeholder="999" />
                                </div>
                                <div>
                                    <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Sale Price (₹)</label>
                                    <input style={inp} type="number" value={form.sale_price} onChange={e => setForm(f=>({...f,sale_price:e.target.value}))} placeholder="799" />
                                </div>
                            </div>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem', marginBottom:'1.5rem' }}>
                                <div>
                                    <label style={{ color:'#f5a800', fontSize:'0.8rem', fontWeight:600, display:'block', marginBottom:'0.4rem' }}>Stock</label>
                                    <input style={inp} type="number" value={form.stock} onChange={e => setForm(f=>({...f,stock:e.target.value}))} />
                                </div>
                                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', paddingTop:'1.5rem' }}>
                                    <input type="checkbox" checked={form.is_active} onChange={e => setForm(f=>({...f,is_active:e.target.checked}))} style={{ accentColor:'#f5a800', width:'16px', height:'16px' }} />
                                    <label style={{ color:'#aaa', fontSize:'0.85rem' }}>Active</label>
                                </div>
                                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', paddingTop:'1.5rem' }}>
                                    <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f=>({...f,is_featured:e.target.checked}))} style={{ accentColor:'#f5a800', width:'16px', height:'16px' }} />
                                    <label style={{ color:'#aaa', fontSize:'0.85rem' }}>Featured</label>
                                </div>
                            </div>
                            <div style={{ display:'flex', gap:'1rem' }}>
                                <button type="submit" style={{ flex:1, padding:'0.85rem', background:'linear-gradient(135deg,#cc0000,#f5a800)', border:'none', borderRadius:'10px', color:'#fff', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                                    <i className="fas fa-save" style={{ marginRight:'0.5rem' }} />{editing ? 'Update Product' : 'Create Product'}
                                </button>
                                <button type="button" onClick={reset} style={{ padding:'0.85rem 1.5rem', background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'10px', color:'#aaa', cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Products Table */}
            <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', overflow:'hidden' }}>
                <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom:'1px solid #1a1a1a' }}>
                                {['Product','Category','Type','Price','Stock','Status','Actions'].map(h => (
                                    <th key={h} style={{ padding:'0.75rem 1.5rem', color:'#555', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', textAlign:'left' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {products.data?.length > 0 ? products.data.map(p => (
                                <tr key={p.id} style={{ borderBottom:'1px solid #161616' }}
                                    onMouseEnter={e => e.currentTarget.style.background='#161616'}
                                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                                    <td style={{ padding:'1rem 1.5rem' }}>
                                        <div style={{ color:'#fff', fontWeight:600, fontSize:'0.9rem' }}>{p.name}</div>
                                        {p.is_featured && <span style={{ fontSize:'0.7rem', color:'#f5a800', background:'rgba(245,168,0,0.1)', padding:'0.1rem 0.5rem', borderRadius:'50px' }}>⭐ Featured</span>}
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem', color:'#888', fontSize:'0.85rem' }}>{p.category||'—'}</td>
                                    <td style={{ padding:'1rem 1.5rem' }}>
                                        <span style={{ padding:'0.25rem 0.75rem', borderRadius:'50px', background: p.type==='digital' ? 'rgba(59,130,246,0.15)' : 'rgba(245,168,0,0.15)', color: p.type==='digital' ? '#3b82f6' : '#f5a800', fontSize:'0.75rem', fontWeight:700, textTransform:'capitalize' }}>{p.type}</span>
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem' }}>
                                        <div style={{ color:'#fff', fontWeight:700 }}>₹{p.price}</div>
                                        {p.sale_price && <div style={{ color:'#22c55e', fontSize:'0.8rem' }}>Sale: ₹{p.sale_price}</div>}
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem', color: p.stock > 0 ? '#22c55e' : '#ef4444', fontWeight:700 }}>{p.stock}</td>
                                    <td style={{ padding:'1rem 1.5rem' }}>
                                        <span style={{ padding:'0.25rem 0.75rem', borderRadius:'50px', background: p.is_active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: p.is_active ? '#22c55e' : '#ef4444', fontSize:'0.75rem', fontWeight:700 }}>
                                            {p.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem' }}>
                                        <div style={{ display:'flex', gap:'0.5rem' }}>
                                            <button onClick={() => editProduct(p)} style={{ padding:'0.4rem 0.75rem', background:'rgba(245,168,0,0.1)', border:'1px solid rgba(245,168,0,0.3)', borderRadius:'6px', color:'#f5a800', cursor:'pointer', fontSize:'0.8rem', fontFamily:'inherit' }}>
                                                <i className="fas fa-edit" />
                                            </button>
                                            <button onClick={() => deleteProduct(p.id)} style={{ padding:'0.4rem 0.75rem', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'6px', color:'#ef4444', cursor:'pointer', fontSize:'0.8rem', fontFamily:'inherit' }}>
                                                <i className="fas fa-trash" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} style={{ padding:'3rem', textAlign:'center', color:'#333' }}>
                                        <i className="fas fa-box-open" style={{ fontSize:'2rem', display:'block', marginBottom:'0.5rem', color:'#f5a800' }} />
                                        No products yet. Add your first product!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
