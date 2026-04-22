import AdminLayout from './Layout';

const fmt = (amount) => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(amount||0);

function MetricCard({ icon, label, value, sub, color, trend }) {
    return (
        <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', padding:'1.5rem', borderLeft:`4px solid ${color}` }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
                <div style={{ width:'46px', height:'46px', borderRadius:'12px', background:`${color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', color }}>
                    <i className={`fas ${icon}`} />
                </div>
                {trend !== undefined && (
                    <span style={{ fontSize:'0.75rem', fontWeight:700, color: trend >= 0 ? '#22c55e' : '#ef4444', background: trend >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', padding:'0.2rem 0.6rem', borderRadius:'50px' }}>
                        <i className={`fas fa-arrow-${trend >= 0 ? 'up' : 'down'}`} style={{ marginRight:'0.2rem' }} />{Math.abs(trend)}%
                    </span>
                )}
            </div>
            <div style={{ fontSize:'1.8rem', fontWeight:900, color:'#fff', marginBottom:'0.25rem' }}>{value}</div>
            <div style={{ color:'#666', fontSize:'0.8rem' }}>{label}</div>
            {sub && <div style={{ color:'#444', fontSize:'0.75rem', marginTop:'0.2rem' }}>{sub}</div>}
        </div>
    );
}

export default function Analytics({ admin, revenueChart, dailyRevenue, ordersByStatus, topProducts, customerGrowth, paymentMethods, metrics }) {
    const maxRevenue = Math.max(...(revenueChart?.map(d => Math.max(d.thisYear, d.lastYear)) || [1]), 1);
    const maxDaily   = Math.max(...(dailyRevenue?.map(d => d.total) || [1]), 1);

    const statusColors = { pending:'#f5a800', processing:'#3b82f6', shipped:'#8b5cf6', delivered:'#22c55e', cancelled:'#ef4444' };
    const totalOrders  = Object.values(ordersByStatus || {}).reduce((a,b) => a+b, 0);

    return (
        <AdminLayout admin={admin} active="analytics">
            <div style={{ marginBottom:'2rem' }}>
                <h1 style={{ color:'#fff', fontSize:'1.5rem', fontWeight:800, margin:0 }}>Analytics</h1>
                <p style={{ color:'#666', margin:0, fontSize:'0.85rem' }}>Business performance overview</p>
            </div>

            {/* Key Metrics */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.5rem', marginBottom:'2rem' }}>
                <MetricCard icon="fa-rupee-sign"    label="Total Revenue"      value={fmt(metrics?.totalRevenue)}    color="#f5a800" trend={metrics?.revenueGrowth} />
                <MetricCard icon="fa-shopping-bag"  label="Total Orders"       value={metrics?.totalOrders||0}       color="#3b82f6" sub="All time" />
                <MetricCard icon="fa-users"          label="Total Customers"    value={metrics?.totalCustomers||0}    color="#ec4899" sub="Registered users" />
                <MetricCard icon="fa-receipt"        label="Avg Order Value"    value={fmt(metrics?.avgOrderValue)}   color="#22c55e" sub="Per transaction" />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem', marginBottom:'2rem' }}>
                <MetricCard icon="fa-calendar-alt"  label="This Month"         value={fmt(metrics?.thisMonthRevenue)} color="#cc0000" trend={metrics?.revenueGrowth} />
                <MetricCard icon="fa-percent"        label="Conversion Rate"    value={`${metrics?.conversionRate||0}%`} color="#8b5cf6" sub="Orders per customer" />
                <MetricCard icon="fa-chart-line"     label="Last Month"         value={fmt(metrics?.lastMonthRevenue)} color="#f59e0b" sub="Previous month" />
            </div>

            {/* Revenue Chart */}
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem', marginBottom:'2rem' }}>
                <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', padding:'1.5rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                        <h3 style={{ color:'#fff', fontSize:'1rem', fontWeight:700, margin:0 }}>
                            <i className="fas fa-chart-bar" style={{ color:'#f5a800', marginRight:'0.5rem' }} />
                            Revenue Comparison
                        </h3>
                        <div style={{ display:'flex', gap:'1rem', fontSize:'0.75rem' }}>
                            <span style={{ display:'flex', alignItems:'center', gap:'0.3rem', color:'#f5a800' }}><span style={{ width:'10px', height:'10px', borderRadius:'2px', background:'#f5a800', display:'inline-block' }} />This Year</span>
                            <span style={{ display:'flex', alignItems:'center', gap:'0.3rem', color:'#444' }}><span style={{ width:'10px', height:'10px', borderRadius:'2px', background:'#333', display:'inline-block' }} />Last Year</span>
                        </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'flex-end', gap:'4px', height:'180px' }}>
                        {revenueChart?.map((d,i) => (
                            <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'3px', height:'100%', justifyContent:'flex-end' }}>
                                <div style={{ width:'100%', display:'flex', gap:'2px', alignItems:'flex-end', justifyContent:'center', height:'160px' }}>
                                    <div style={{ flex:1, borderRadius:'3px 3px 0 0', background:'linear-gradient(180deg,#f5a800,#cc0000)', height:`${(d.thisYear/maxRevenue)*155}px`, minHeight:'3px' }} title={`This: ${fmt(d.thisYear)}`} />
                                    <div style={{ flex:1, borderRadius:'3px 3px 0 0', background:'#2a2a2a', height:`${(d.lastYear/maxRevenue)*155}px`, minHeight:'3px' }} title={`Last: ${fmt(d.lastYear)}`} />
                                </div>
                                <span style={{ color:'#444', fontSize:'0.6rem' }}>{d.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Orders by Status */}
                <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', padding:'1.5rem' }}>
                    <h3 style={{ color:'#fff', fontSize:'1rem', fontWeight:700, marginTop:0, marginBottom:'1.5rem' }}>
                        <i className="fas fa-chart-pie" style={{ color:'#f5a800', marginRight:'0.5rem' }} />
                        Orders by Status
                    </h3>
                    {Object.entries(ordersByStatus || {}).map(([status, count]) => {
                        const pct = totalOrders > 0 ? Math.round((count/totalOrders)*100) : 0;
                        return (
                            <div key={status} style={{ marginBottom:'1rem' }}>
                                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem' }}>
                                    <span style={{ color:'#aaa', fontSize:'0.82rem', textTransform:'capitalize' }}>{status}</span>
                                    <span style={{ color:statusColors[status]||'#f5a800', fontSize:'0.82rem', fontWeight:700 }}>{count} ({pct}%)</span>
                                </div>
                                <div style={{ height:'6px', background:'#1a1a1a', borderRadius:'3px', overflow:'hidden' }}>
                                    <div style={{ height:'100%', width:`${pct}%`, background:statusColors[status]||'#f5a800', borderRadius:'3px' }} />
                                </div>
                            </div>
                        );
                    })}
                    {Object.keys(ordersByStatus||{}).length === 0 && (
                        <p style={{ color:'#444', textAlign:'center', fontSize:'0.85rem' }}>No orders yet</p>
                    )}
                </div>
            </div>

            {/* Daily Revenue + Top Products */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'2rem' }}>
                {/* Daily Revenue */}
                <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', padding:'1.5rem' }}>
                    <h3 style={{ color:'#fff', fontSize:'1rem', fontWeight:700, marginTop:0, marginBottom:'1.5rem' }}>
                        <i className="fas fa-chart-area" style={{ color:'#f5a800', marginRight:'0.5rem' }} />
                        Daily Revenue (Last 30 Days)
                    </h3>
                    {dailyRevenue?.length > 0 ? (
                        <div style={{ display:'flex', alignItems:'flex-end', gap:'2px', height:'120px' }}>
                            {dailyRevenue.map((d,i) => (
                                <div key={i} style={{ flex:1, borderRadius:'2px 2px 0 0', background:`linear-gradient(180deg,#f5a800,#cc0000)`, height:`${(d.total/maxDaily)*115}px`, minHeight:'3px' }} title={`${d.date}: ${fmt(d.total)}`} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ height:'120px', display:'flex', alignItems:'center', justifyContent:'center', color:'#333' }}>
                            <div style={{ textAlign:'center' }}>
                                <i className="fas fa-chart-area" style={{ fontSize:'2rem', display:'block', marginBottom:'0.5rem', color:'#f5a800' }} />
                                No revenue data yet
                            </div>
                        </div>
                    )}
                </div>

                {/* Top Products */}
                <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', padding:'1.5rem' }}>
                    <h3 style={{ color:'#fff', fontSize:'1rem', fontWeight:700, marginTop:0, marginBottom:'1.5rem' }}>
                        <i className="fas fa-trophy" style={{ color:'#f5a800', marginRight:'0.5rem' }} />
                        Top Products
                    </h3>
                    {topProducts?.length > 0 ? topProducts.map((p,i) => (
                        <div key={i} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'0.6rem 0', borderBottom:'1px solid #1a1a1a' }}>
                            <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'linear-gradient(135deg,#cc0000,#f5a800)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:'0.8rem', flexShrink:0 }}>{i+1}</div>
                            <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ color:'#fff', fontSize:'0.85rem', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                                <div style={{ color:'#555', fontSize:'0.75rem' }}>{p.total_qty} sold</div>
                            </div>
                            <div style={{ color:'#f5a800', fontWeight:700, fontSize:'0.85rem', flexShrink:0 }}>{fmt(p.total_revenue)}</div>
                        </div>
                    )) : (
                        <div style={{ textAlign:'center', color:'#444', padding:'2rem' }}>
                            <i className="fas fa-trophy" style={{ fontSize:'2rem', display:'block', marginBottom:'0.5rem', color:'#f5a800' }} />
                            No sales data yet
                        </div>
                    )}
                </div>
            </div>

            {/* Customer Growth + Payment Methods */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
                {/* Customer Growth */}
                <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', padding:'1.5rem' }}>
                    <h3 style={{ color:'#fff', fontSize:'1rem', fontWeight:700, marginTop:0, marginBottom:'1.5rem' }}>
                        <i className="fas fa-user-plus" style={{ color:'#f5a800', marginRight:'0.5rem' }} />
                        Customer Growth (12 Months)
                    </h3>
                    {customerGrowth?.length > 0 ? (
                        <div>
                            {customerGrowth.map((d,i) => (
                                <div key={i} style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'0.6rem' }}>
                                    <span style={{ color:'#666', fontSize:'0.78rem', width:'60px', flexShrink:0 }}>{d.month}</span>
                                    <div style={{ flex:1, height:'8px', background:'#1a1a1a', borderRadius:'4px', overflow:'hidden' }}>
                                        <div style={{ height:'100%', width:`${Math.min((d.count / Math.max(...customerGrowth.map(x=>x.count))) * 100, 100)}%`, background:'linear-gradient(90deg,#cc0000,#f5a800)', borderRadius:'4px' }} />
                                    </div>
                                    <span style={{ color:'#f5a800', fontSize:'0.78rem', fontWeight:700, width:'30px', textAlign:'right', flexShrink:0 }}>{d.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign:'center', color:'#444', padding:'2rem' }}>
                            <i className="fas fa-users" style={{ fontSize:'2rem', display:'block', marginBottom:'0.5rem', color:'#f5a800' }} />
                            No customer data yet
                        </div>
                    )}
                </div>

                {/* Payment Methods */}
                <div style={{ background:'#111', border:'1px solid rgba(245,168,0,0.15)', borderRadius:'16px', padding:'1.5rem' }}>
                    <h3 style={{ color:'#fff', fontSize:'1rem', fontWeight:700, marginTop:0, marginBottom:'1.5rem' }}>
                        <i className="fas fa-credit-card" style={{ color:'#f5a800', marginRight:'0.5rem' }} />
                        Payment Methods
                    </h3>
                    {paymentMethods?.length > 0 ? paymentMethods.map((p,i) => (
                        <div key={i} style={{ background:'#1a1a1a', borderRadius:'10px', padding:'1rem', marginBottom:'0.75rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                                <div style={{ width:'36px', height:'36px', borderRadius:'8px', background: p.gateway==='razorpay'?'rgba(59,130,246,0.15)':'rgba(99,102,241,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                    <i className="fas fa-credit-card" style={{ color: p.gateway==='razorpay'?'#3b82f6':'#6366f1', fontSize:'0.9rem' }} />
                                </div>
                                <div>
                                    <div style={{ color:'#fff', fontSize:'0.85rem', fontWeight:700, textTransform:'capitalize' }}>{p.gateway || 'Unknown'}</div>
                                    <div style={{ color:'#666', fontSize:'0.75rem' }}>{p.count} transactions</div>
                                </div>
                            </div>
                            <div style={{ color:'#f5a800', fontWeight:700 }}>{fmt(p.total)}</div>
                        </div>
                    )) : (
                        <div style={{ textAlign:'center', color:'#444', padding:'2rem' }}>
                            <i className="fas fa-credit-card" style={{ fontSize:'2rem', display:'block', marginBottom:'0.5rem', color:'#f5a800' }} />
                            No payment data yet
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
