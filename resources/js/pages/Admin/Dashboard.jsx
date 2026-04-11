import { useState } from 'react';
import { router } from '@inertiajs/react';

function StatCard({ icon, label, value, sub, color }) {
    return (
        <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', padding:'1.5rem', borderLeft:`4px solid ${color}` }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
                <div style={{ width:'48px', height:'48px', borderRadius:'12px', background:`${color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', color }}>
                    <i className={`fas ${icon}`} />
                </div>
                <span style={{ color:'#444', fontSize:'0.75rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'1px', textAlign:'right' }}>{label}</span>
            </div>
            <div style={{ fontSize:'2rem', fontWeight:900, color:'#fff', marginBottom:'0.25rem' }}>{value}</div>
            {sub && <div style={{ color:'#666', fontSize:'0.8rem' }}>{sub}</div>}
        </div>
    );
}

function NavItem({ icon, label, active, onClick }) {
    return (
        <button onClick={onClick} style={{ width:'100%', padding:'0.85rem 1.5rem', display:'flex', alignItems:'center', gap:'0.75rem', background: active ? 'rgba(245,168,0,0.1)' : 'transparent', border:'none', borderLeft: active ? '3px solid #f5a800' : '3px solid transparent', color: active ? '#f5a800' : '#666', cursor:'pointer', fontSize:'0.9rem', fontWeight: active ? 700 : 500, transition:'all 0.2s', textAlign:'left', fontFamily:'inherit' }}>
            <i className={`fas ${icon}`} style={{ width:'18px' }} />{label}
        </button>
    );
}

export default function Dashboard({ stats, chartData, recentOrders, admin }) {
    const [activeNav, setActiveNav] = useState('dashboard');

    const fmt = (amount) => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR' }).format(amount || 0);
    const logout = () => router.post('/admin/logout');

    const statusColors = { pending:'#f5a800', processing:'#3b82f6', shipped:'#8b5cf6', delivered:'#22c55e', cancelled:'#ef4444' };
    const maxChart = Math.max(...(chartData?.map(d => d.total) || [1]), 1);

    return (
        <div style={{ display:'flex', minHeight:'100vh', background:'#0a0a0a', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>

            {/* Sidebar */}
            <div style={{ width:'260px', background:'#111', borderRight:'1px solid rgba(245,168,0,0.15)', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:100 }}>
                <div style={{ padding:'1.5rem', borderBottom:'1px solid rgba(245,168,0,0.15)', textAlign:'center' }}>
                    <img src="/images/amd-logo.png" alt="AMD" style={{ height:'50px', width:'auto' }} />
                    <div style={{ color:'#f5a800', fontSize:'0.7rem', fontWeight:700, letterSpacing:'2px', marginTop:'0.5rem' }}>ADMIN PANEL</div>
                </div>
                <nav style={{ flex:1, padding:'1rem 0', overflowY:'auto' }}>
                    <div style={{ color:'#333', fontSize:'0.7rem', fontWeight:700, letterSpacing:'1px', padding:'0.5rem 1.5rem', marginBottom:'0.25rem' }}>MAIN</div>
                    <NavItem icon="fa-tachometer-alt" label="Dashboard" active={activeNav==='dashboard'} onClick={() => setActiveNav('dashboard')} />
                    <NavItem icon="fa-chart-line" label="Analytics" active={activeNav==='analytics'} onClick={() => setActiveNav('analytics')} />
                    <div style={{ color:'#333', fontSize:'0.7rem', fontWeight:700, letterSpacing:'1px', padding:'1rem 1.5rem 0.25rem' }}>COMMERCE</div>
                    <NavItem icon="fa-box" label="Products" active={activeNav==='products'} onClick={() => setActiveNav('products')} />
                    <NavItem icon="fa-shopping-cart" label="Orders" active={activeNav==='orders'} onClick={() => setActiveNav('orders')} />
                    <NavItem icon="fa-truck" label="Deliveries" active={activeNav==='deliveries'} onClick={() => setActiveNav('deliveries')} />
                    <NavItem icon="fa-credit-card" label="Payments" active={activeNav==='payments'} onClick={() => setActiveNav('payments')} />
                    <NavItem icon="fa-users" label="Customers" active={activeNav==='customers'} onClick={() => setActiveNav('customers')} />
                    <div style={{ color:'#333', fontSize:'0.7rem', fontWeight:700, letterSpacing:'1px', padding:'1rem 1.5rem 0.25rem' }}>CONTENT</div>
                    <NavItem icon="fa-edit" label="CMS Manager" active={activeNav==='cms'} onClick={() => setActiveNav('cms')} />
                    <NavItem icon="fa-image" label="Media" active={activeNav==='media'} onClick={() => setActiveNav('media')} />
                    <div style={{ color:'#333', fontSize:'0.7rem', fontWeight:700, letterSpacing:'1px', padding:'1rem 1.5rem 0.25rem' }}>SYSTEM</div>
                    <NavItem icon="fa-cog" label="Settings" active={activeNav==='settings'} onClick={() => setActiveNav('settings')} />
                </nav>
                <div style={{ padding:'1rem 1.5rem', borderTop:'1px solid rgba(245,168,0,0.15)', display:'flex', alignItems:'center', gap:'0.75rem' }}>
                    <div style={{ width:'38px', height:'38px', borderRadius:'50%', background:'linear-gradient(135deg,#cc0000,#f5a800)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'1rem', flexShrink:0 }}>
                        {admin?.name?.charAt(0) || 'A'}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ color:'#fff', fontSize:'0.85rem', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{admin?.name}</div>
                        <div style={{ color:'#f5a800', fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'1px' }}>{admin?.role}</div>
                    </div>
                    <button onClick={logout} style={{ background:'none', border:'none', color:'#666', cursor:'pointer', padding:'0.25rem' }} title="Logout">
                        <i className="fas fa-sign-out-alt" />
                    </button>
                </div>
            </div>

            {/* Main */}
            <div style={{ marginLeft:'260px', flex:1, display:'flex', flexDirection:'column' }}>

                {/* Topbar */}
                <div style={{ background:'#111', borderBottom:'1px solid rgba(245,168,0,0.15)', padding:'1rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:99 }}>
                    <div>
                        <h1 style={{ color:'#fff', fontSize:'1.3rem', fontWeight:800, margin:0 }}>Dashboard</h1>
                        <p style={{ color:'#666', fontSize:'0.8rem', margin:0 }}>Welcome back, {admin?.name}! 👋</p>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                        <span style={{ color:'#666', fontSize:'0.8rem' }}>
                            <i className="fas fa-calendar" style={{ marginRight:'0.4rem', color:'#f5a800' }} />
                            {new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
                        </span>
                        <a href="/" target="_blank" style={{ padding:'0.5rem 1rem', borderRadius:'8px', background:'rgba(245,168,0,0.1)', border:'1px solid rgba(245,168,0,0.3)', color:'#f5a800', textDecoration:'none', fontSize:'0.8rem', fontWeight:600 }}>
                            <i className="fas fa-external-link-alt" style={{ marginRight:'0.4rem' }} />View Site
                        </a>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding:'2rem' }}>

                    {/* Earnings */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.5rem', marginBottom:'2rem' }}>
                        <StatCard icon="fa-rupee-sign" label="Today's Earnings" value={fmt(stats?.todayEarnings)} sub="Real-time" color="#f5a800" />
                        <StatCard icon="fa-calendar-alt" label="This Month" value={fmt(stats?.monthEarnings)} sub={new Date().toLocaleString('default',{month:'long'})} color="#cc0000" />
                        <StatCard icon="fa-chart-bar" label="This Year" value={fmt(stats?.yearEarnings)} sub={new Date().getFullYear()} color="#8b5cf6" />
                        <StatCard icon="fa-wallet" label="Total Earnings" value={fmt(stats?.totalEarnings)} sub="All time" color="#22c55e" />
                    </div>

                    {/* Orders & Customers */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.5rem', marginBottom:'2rem' }}>
                        <StatCard icon="fa-shopping-bag" label="Total Orders" value={stats?.totalOrders||0} sub={`${stats?.pendingOrders||0} pending`} color="#3b82f6" />
                        <StatCard icon="fa-clock" label="Processing" value={stats?.processingOrders||0} sub="In progress" color="#f59e0b" />
                        <StatCard icon="fa-check-circle" label="Delivered" value={stats?.deliveredOrders||0} sub="Completed" color="#22c55e" />
                        <StatCard icon="fa-users" label="Customers" value={stats?.totalCustomers||0} sub={`${stats?.newCustomers||0} new this month`} color="#ec4899" />
                    </div>

                    {/* Chart + Status */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'2rem' }}>
                        <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', padding:'1.5rem' }}>
                            <h3 style={{ color:'#fff', fontSize:'1rem', fontWeight:700, marginBottom:'1.5rem', marginTop:0 }}>
                                <i className="fas fa-chart-bar" style={{ color:'#f5a800', marginRight:'0.5rem' }} />
                                Monthly Revenue {new Date().getFullYear()}
                            </h3>
                            <div style={{ display:'flex', alignItems:'flex-end', gap:'6px', height:'160px' }}>
                                {chartData?.map((d,i) => (
                                    <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', height:'100%', justifyContent:'flex-end' }}>
                                        <div style={{ width:'100%', borderRadius:'4px 4px 0 0', background: d.total>0 ? 'linear-gradient(180deg,#f5a800,#cc0000)' : '#1a1a1a', height:`${(d.total/maxChart)*140}px`, minHeight:'4px', transition:'height 0.5s ease' }} />
                                        <span style={{ color:'#444', fontSize:'0.6rem' }}>{d.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', padding:'1.5rem' }}>
                            <h3 style={{ color:'#fff', fontSize:'1rem', fontWeight:700, marginBottom:'1.5rem', marginTop:0 }}>
                                <i className="fas fa-chart-pie" style={{ color:'#f5a800', marginRight:'0.5rem' }} />
                                Order Status Overview
                            </h3>
                            {[
                                { label:'Pending', value:stats?.pendingOrders||0, color:'#f5a800' },
                                { label:'Processing', value:stats?.processingOrders||0, color:'#3b82f6' },
                                { label:'Delivered', value:stats?.deliveredOrders||0, color:'#22c55e' },
                                { label:'Cancelled', value:stats?.cancelledOrders||0, color:'#ef4444' },
                            ].map(item => {
                                const pct = Math.round((item.value / (stats?.totalOrders||1)) * 100);
                                return (
                                    <div key={item.label} style={{ marginBottom:'1rem' }}>
                                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.35rem' }}>
                                            <span style={{ color:'#aaa', fontSize:'0.85rem' }}>{item.label}</span>
                                            <span style={{ color:item.color, fontSize:'0.85rem', fontWeight:700 }}>{item.value} ({pct}%)</span>
                                        </div>
                                        <div style={{ height:'6px', background:'#1a1a1a', borderRadius:'3px', overflow:'hidden' }}>
                                            <div style={{ height:'100%', width:`${pct}%`, background:item.color, borderRadius:'3px' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', overflow:'hidden' }}>
                        <div style={{ padding:'1.5rem', borderBottom:'1px solid rgba(245,168,0,0.15)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                            <h3 style={{ color:'#fff', fontSize:'1rem', fontWeight:700, margin:0 }}>
                                <i className="fas fa-list" style={{ color:'#f5a800', marginRight:'0.5rem' }} />Recent Orders
                            </h3>
                            <button onClick={() => setActiveNav('orders')} style={{ background:'rgba(245,168,0,0.1)', border:'1px solid rgba(245,168,0,0.3)', color:'#f5a800', padding:'0.4rem 1rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.8rem', fontWeight:600, fontFamily:'inherit' }}>
                                View All
                            </button>
                        </div>
                        <div style={{ overflowX:'auto' }}>
                            <table style={{ width:'100%', borderCollapse:'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom:'1px solid #1a1a1a' }}>
                                        {['Order #','Customer','Amount','Status','Payment','Date'].map(h => (
                                            <th key={h} style={{ padding:'0.75rem 1.5rem', color:'#555', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', textAlign:'left' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders?.length > 0 ? recentOrders.map(order => (
                                        <tr key={order.id} style={{ borderBottom:'1px solid #161616' }}
                                            onMouseEnter={e => e.currentTarget.style.background='#161616'}
                                            onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                                            <td style={{ padding:'1rem 1.5rem', color:'#f5a800', fontWeight:700, fontSize:'0.85rem' }}>#{order.order_number}</td>
                                            <td style={{ padding:'1rem 1.5rem', color:'#fff', fontSize:'0.85rem' }}>{order.user?.name||'N/A'}</td>
                                            <td style={{ padding:'1rem 1.5rem', color:'#fff', fontWeight:700, fontSize:'0.85rem' }}>{fmt(order.total)}</td>
                                            <td style={{ padding:'1rem 1.5rem' }}>
                                                <span style={{ padding:'0.25rem 0.75rem', borderRadius:'50px', background:`${statusColors[order.status]}22`, color:statusColors[order.status], fontSize:'0.75rem', fontWeight:700, textTransform:'capitalize' }}>{order.status}</span>
                                            </td>
                                            <td style={{ padding:'1rem 1.5rem' }}>
                                                <span style={{ padding:'0.25rem 0.75rem', borderRadius:'50px', background: order.payment_status==='paid' ? '#22c55e22' : '#ef444422', color: order.payment_status==='paid' ? '#22c55e' : '#ef4444', fontSize:'0.75rem', fontWeight:700, textTransform:'capitalize' }}>{order.payment_status}</span>
                                            </td>
                                            <td style={{ padding:'1rem 1.5rem', color:'#666', fontSize:'0.8rem' }}>{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} style={{ padding:'3rem', textAlign:'center', color:'#333' }}>
                                                <i className="fas fa-inbox" style={{ fontSize:'2rem', display:'block', marginBottom:'0.5rem', color:'#f5a800' }} />
                                                No orders yet — they will appear here once customers start purchasing.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
