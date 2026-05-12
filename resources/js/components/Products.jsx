import { useState, useRef } from 'react';


const blank = {
    name: '', description: '', type: 'digital', price: '', sale_price: '',
    stock: '0', category: '', is_active: true, is_featured: false,
    is_celebrity_wish: false, celebrity_name: '', delivery_days: 3, sample_videos: '',
};

export default function Products({ products, bookings, admin }) {
    const [showForm, setShowForm]   = useState(false);
    const [editing, setEditing]     = useState(null);
    const [tab, setTab]             = useState('products'); // products | bookings
    const [form, setForm]           = useState(blank);
    const [imgPreview, setImgPreview]   = useState(null);
    const [celebPreview, setCelebPreview] = useState(null);
    const imgRef  = useRef();
    const celebRef = useRef();

    const reset = () => { setForm(blank); setEditing(null); setShowForm(false); setImgPreview(null); setCelebPreview(null); };

    const submit = (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''));
        if (imgRef.current?.files[0])   fd.append('image', imgRef.current.files[0]);
        if (celebRef.current?.files[0]) fd.append('celebrity_photo', celebRef.current.files[0]);

        if (editing) {
            fd.append('_method', 'PUT');
            router.post(`/admin/products/${editing.id}`, fd, { onSuccess: reset });
        } else {
            router.post('/admin/products', fd, { onSuccess: reset });
        }
    };

    const editProduct = (p) => {
        setEditing(p);
        setForm({
            name: p.name, description: p.description || '', type: p.type,
            price: p.price, sale_price: p.sale_price || '', stock: p.stock || 0,
            category: p.category || '', is_active: p.is_active, is_featured: p.is_featured,
            is_celebrity_wish: p.is_celebrity_wish || false,
            celebrity_name: p.celebrity_name || '',
            delivery_days: p.delivery_days || 3,
            sample_videos: Array.isArray(p.sample_videos) ? p.sample_videos.join(',') : '',
        });
        setImgPreview(p.image_url || null);
        setCelebPreview(p.celebrity_photo_url || null);
        setShowForm(true);
    };

    const inp = { width: '100%', padding: '0.75rem 1rem', background: '#1a1a1a', border: '1.5px solid #2a2a2a', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };
    const statusColors = { pending: '#f5a800', in_progress: '#3b82f6', completed: '#22c55e' };

    return (
        <AdminLayout admin={admin} active="products">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Products</h1>
                    <p style={{ color: '#666', margin: 0, fontSize: '0.85rem' }}>{products.total} total products</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => setTab('products')} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: tab === 'products' ? 'rgba(245,168,0,0.15)' : '#1a1a1a', color: tab === 'products' ? '#f5a800' : '#666', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        <i className="fas fa-box" style={{ marginRight: '0.4rem' }} />Products
                    </button>
                    <button onClick={() => setTab('bookings')} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: tab === 'bookings' ? 'rgba(255,87,34,0.15)' : '#1a1a1a', color: tab === 'bookings' ? '#ff5722' : '#666', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        <i className="fas fa-heart" style={{ marginRight: '0.4rem' }} />Wish Bookings {bookings?.length > 0 && `(${bookings.length})`}
                    </button>
                    {tab === 'products' && (
                        <button onClick={() => { reset(); setShowForm(true); }} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#cc0000,#f5a800)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit' }}>
                            <i className="fas fa-plus" /> Add Product
                        </button>
                    )}
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#111', border: '1px solid rgba(245,168,0,0.2)', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ color: '#fff', fontWeight: 800, margin: 0 }}>{editing ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={reset} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '1.2rem' }}><i className="fas fa-times" /></button>
                        </div>

                        <form onSubmit={submit}>
                            {/* Basic fields */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Product Name *</label>
                                    <input style={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="e.g. Celebrity Video Wish" />
                                </div>
                                <div>
                                    <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Category</label>
                                    <input style={inp} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Celebrity" />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Description</label>
                                <textarea style={{ ...inp, minHeight: '70px', resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Product description..." />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Type *</label>
                                    <select style={inp} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                                        <option value="digital">Digital</option>
                                        <option value="physical">Physical</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Price (₹) *</label>
                                    <input style={inp} type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required placeholder="999" />
                                </div>
                                <div>
                                    <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Sale Price (₹)</label>
                                    <input style={inp} type="number" value={form.sale_price} onChange={e => setForm(f => ({ ...f, sale_price: e.target.value }))} placeholder="799" />
                                </div>
                            </div>

                            {/* Product image */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Product Image</label>
                                <div onClick={() => imgRef.current?.click()} style={{ border: '2px dashed #2a2a2a', borderRadius: '10px', padding: '1rem', cursor: 'pointer', textAlign: 'center', background: '#1a1a1a' }}>
                                    {imgPreview
                                        ? <img src={imgPreview} alt="Preview" style={{ height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                                        : <><i className="fas fa-image" style={{ color: '#444', fontSize: '1.5rem', display: 'block', marginBottom: '0.3rem' }} /><span style={{ color: '#555', fontSize: '0.8rem' }}>Click to upload image</span></>
                                    }
                                </div>
                                <input ref={imgRef} type="file" accept="image/*" onChange={e => { if (e.target.files[0]) setImgPreview(URL.createObjectURL(e.target.files[0])); }} style={{ display: 'none' }} />
                            </div>

                            {/* Checkboxes */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Stock</label>
                                    <input style={inp} type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                                    <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} style={{ accentColor: '#f5a800', width: '16px', height: '16px' }} />
                                    <label style={{ color: '#aaa', fontSize: '0.85rem' }}>Active</label>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                                    <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} style={{ accentColor: '#f5a800', width: '16px', height: '16px' }} />
                                    <label style={{ color: '#aaa', fontSize: '0.85rem' }}>Featured</label>
                                </div>
                            </div>

                            {/* ── Celebrity Wish Toggle ── */}
                            <div style={{ border: '1px solid rgba(255,87,34,0.3)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem', background: 'rgba(255,87,34,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: form.is_celebrity_wish ? '1.25rem' : 0 }}>
                                    <input
                                        type="checkbox" checked={form.is_celebrity_wish}
                                        onChange={e => setForm(f => ({ ...f, is_celebrity_wish: e.target.checked }))}
                                        style={{ accentColor: '#ff5722', width: '18px', height: '18px' }}
                                    />
                                    <label style={{ color: '#ff5722', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer' }}>
                                        ⭐ This is a Celebrity Wish product
                                    </label>
                                </div>

                                {form.is_celebrity_wish && (
                                    <>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                            <div>
                                                <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Celebrity Name *</label>
                                                <input style={inp} value={form.celebrity_name} onChange={e => setForm(f => ({ ...f, celebrity_name: e.target.value }))} placeholder="e.g. Adittya Kappadia" />
                                            </div>
                                            <div>
                                                <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Delivery Days</label>
                                                <input style={inp} type="number" value={form.delivery_days} onChange={e => setForm(f => ({ ...f, delivery_days: e.target.value }))} min="1" />
                                            </div>
                                        </div>

                                        {/* Celebrity Photo */}
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Celebrity Photo</label>
                                            <div onClick={() => celebRef.current?.click()} style={{ border: '2px dashed #2a2a2a', borderRadius: '10px', padding: '1rem', cursor: 'pointer', textAlign: 'center', background: '#1a1a1a' }}>
                                                {celebPreview
                                                    ? <img src={celebPreview} alt="Celebrity" style={{ height: '80px', borderRadius: '50%', objectFit: 'cover', aspectRatio: '1' }} />
                                                    : <><i className="fas fa-user-circle" style={{ color: '#444', fontSize: '1.5rem', display: 'block', marginBottom: '0.3rem' }} /><span style={{ color: '#555', fontSize: '0.8rem' }}>Click to upload celebrity photo</span></>
                                                }
                                            </div>
                                            <input ref={celebRef} type="file" accept="image/*" onChange={e => { if (e.target.files[0]) setCelebPreview(URL.createObjectURL(e.target.files[0])); }} style={{ display: 'none' }} />
                                        </div>

                                        {/* Sample Videos */}
                                        <div>
                                            <label style={{ color: '#f5a800', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                                                Sample Video IDs <span style={{ color: '#555', fontWeight: 400 }}>(YouTube IDs, comma separated)</span>
                                            </label>
                                            <input style={inp} value={form.sample_videos} onChange={e => setForm(f => ({ ...f, sample_videos: e.target.value }))} placeholder="dQw4w9WgXcQ, abc123xyz, ..." />
                                            <p style={{ color: '#444', fontSize: '0.75rem', marginTop: '0.3rem' }}>e.g. from youtube.com/watch?v=<strong style={{ color: '#f5a800' }}>dQw4w9WgXcQ</strong></p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" style={{ flex: 1, padding: '0.85rem', background: 'linear-gradient(135deg,#cc0000,#f5a800)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                    <i className="fas fa-save" style={{ marginRight: '0.5rem' }} />{editing ? 'Update Product' : 'Create Product'}
                                </button>
                                <button type="button" onClick={reset} style={{ padding: '0.85rem 1.5rem', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', color: '#aaa', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── PRODUCTS TABLE ── */}
            {tab === 'products' && (
                <div style={{ background: '#111', border: '1px solid rgba(245,168,0,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                                    {['Product', 'Category', 'Type', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '0.75rem 1.25rem', color: '#555', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {products.data?.length > 0 ? products.data.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #161616' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#161616'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</div>
                                            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                                                {p.is_featured && <span style={{ fontSize: '0.65rem', color: '#f5a800', background: 'rgba(245,168,0,0.1)', padding: '0.1rem 0.5rem', borderRadius: '50px' }}>⭐ Featured</span>}
                                                {p.is_celebrity_wish && <span style={{ fontSize: '0.65rem', color: '#ff5722', background: 'rgba(255,87,34,0.1)', padding: '0.1rem 0.5rem', borderRadius: '50px' }}>🎬 Celebrity Wish</span>}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#888', fontSize: '0.85rem' }}>{p.category || '—'}</td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '50px', background: p.type === 'digital' ? 'rgba(59,130,246,0.15)' : 'rgba(245,168,0,0.15)', color: p.type === 'digital' ? '#3b82f6' : '#f5a800', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' }}>{p.type}</span>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ color: '#fff', fontWeight: 700 }}>₹{p.price}</div>
                                            {p.sale_price && <div style={{ color: '#22c55e', fontSize: '0.8rem' }}>Sale: ₹{p.sale_price}</div>}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: p.stock > 0 ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{p.stock}</td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '50px', background: p.is_active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: p.is_active ? '#22c55e' : '#ef4444', fontSize: '0.75rem', fontWeight: 700 }}>
                                                {p.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => editProduct(p)} style={{ padding: '0.4rem 0.75rem', background: 'rgba(245,168,0,0.1)', border: '1px solid rgba(245,168,0,0.3)', borderRadius: '6px', color: '#f5a800', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit' }}>
                                                    <i className="fas fa-edit" />
                                                </button>
                                                <button onClick={() => { if (confirm('Delete?')) router.delete(`/admin/products/${p.id}`); }} style={{ padding: '0.4rem 0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit' }}>
                                                    <i className="fas fa-trash" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#333' }}>
                                            <i className="fas fa-box-open" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', color: '#f5a800' }} />
                                            No products yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── WISH BOOKINGS TAB ── */}
            {tab === 'bookings' && (
                <div style={{ background: '#111', border: '1px solid rgba(255,87,34,0.2)', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                                    {['Order #', 'Celebrity', 'Recipient', 'Occasion', 'Amount', 'Payment', 'Status', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '0.75rem 1.25rem', color: '#555', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {bookings?.length > 0 ? bookings.map(b => (
                                    <tr key={b.id} style={{ borderBottom: '1px solid #161616' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#161616'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '1rem 1.25rem', color: '#ff5722', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{b.order_number}</td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#fff', fontSize: '0.85rem' }}>{b.product?.celebrity_name || b.product?.name}</td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{b.recipient_name}</div>
                                            <div style={{ color: '#666', fontSize: '0.75rem' }}>{b.from_name}</div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#aaa', fontSize: '0.85rem' }}>{b.occasion}</td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>₹{b.amount}</td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span style={{ padding: '0.25rem 0.65rem', borderRadius: '50px', background: b.payment_status === 'paid' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: b.payment_status === 'paid' ? '#22c55e' : '#ef4444', fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize' }}>
                                                {b.payment_status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <select
                                                value={b.fulfillment_status}
                                                onChange={e => router.patch(`/admin/products/booking/${b.id}`, { fulfillment_status: e.target.value })}
                                                style={{ background: '#1a1a1a', border: `1px solid ${statusColors[b.fulfillment_status]}44`, borderRadius: '6px', color: statusColors[b.fulfillment_status], padding: '0.3rem 0.5rem', fontSize: '0.78rem', fontFamily: 'inherit', cursor: 'pointer' }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <a href={`mailto:${b.contact_email}`} style={{ padding: '0.4rem 0.75rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#3b82f6', fontSize: '0.8rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                                                <i className="fas fa-envelope" style={{ marginRight: '0.3rem' }} />Email
                                            </a>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#333' }}>
                                            <i className="fas fa-heart" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', color: '#ff5722' }} />
                                            No wish bookings yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}