import AdminLayout from './Layout';
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

export default function Dashboard({ stats, chartData, recentOrders, admin }) {
    const fmt = (amount) => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR' }).format(amount || 0);
    const statusColors = { pending:'#f5a800', processing:'#3b82f6', shipped:'#8b5cf6', delivered:'#22c55e', cancelled:'#ef4444' };
    const maxChart = Math.max(...(chartData?.map(d => d.total) || [1]), 1);

    return (
        <AdminLayout admin={admin} active="dashboard">
            <div style={{ marginBottom:'2rem' }}>
                <h1 style={{ color:'#fff', fontSize:'1.5rem', fontWeight:800, margin:0 }}>Dashboard</h1>
                <p style={{ color:'#666', margin:0, fontSize:'0.85rem' }}>Welcome back, {admin?.name}! 👋</p>
            </div>

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
                                <div style={{ width:'100%', borderRadius:'4px 4px 0 0', background: d.total>0?'linear-gradient(180deg,#f5a800,#cc0000)':'#1a1a1a', height:`${(d.total/maxChart)*140}px`, minHeight:'4px' }} />
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
                        { label:'Pending',    value:stats?.pendingOrders||0,    color:'#f5a800' },
                        { label:'Processing', value:stats?.processingOrders||0, color:'#3b82f6' },
                        { label:'Delivered',  value:stats?.deliveredOrders||0,  color:'#22c55e' },
                        { label:'Cancelled',  value:stats?.cancelledOrders||0,  color:'#ef4444' },
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
                    <button onClick={() => router.visit('/admin/orders')} style={{ background:'rgba(245,168,0,0.1)', border:'1px solid rgba(245,168,0,0.3)', color:'#f5a800', padding:'0.4rem 1rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.8rem', fontWeight:600, fontFamily:'inherit' }}>
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
                                        <span style={{ padding:'0.25rem 0.75rem', borderRadius:'50px', background: order.payment_status==='paid'?'#22c55e22':'#ef444422', color: order.payment_status==='paid'?'#22c55e':'#ef4444', fontSize:'0.75rem', fontWeight:700, textTransform:'capitalize' }}>{order.payment_status}</span>
                                    </td>
                                    <td style={{ padding:'1rem 1.5rem', color:'#666', fontSize:'0.8rem' }}>{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} style={{ padding:'3rem', textAlign:'center', color:'#333' }}>
                                        <i className="fas fa-inbox" style={{ fontSize:'2rem', display:'block', marginBottom:'0.5rem', color:'#f5a800' }} />
                                        No orders yet
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
