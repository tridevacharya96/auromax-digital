import { router } from '@inertiajs/react';

function NavItem({ icon, label, active, onClick }) {
    return (
        <button onClick={onClick} style={{ width:'100%', padding:'0.85rem 1.5rem', display:'flex', alignItems:'center', gap:'0.75rem', background: active ? 'rgba(245,168,0,0.1)' : 'transparent', border:'none', borderLeft: active ? '3px solid #f5a800' : '3px solid transparent', color: active ? '#f5a800' : '#666', cursor:'pointer', fontSize:'0.9rem', fontWeight: active ? 700 : 500, transition:'all 0.2s', textAlign:'left', fontFamily:'inherit' }}>
            <i className={`fas ${icon}`} style={{ width:'18px' }} />{label}
        </button>
    );
}

export default function AdminLayout({ children, admin, active }) {
    const logout = () => router.post('/admin/logout');
    const nav = (path) => router.visit(path);

    const sections = [
        { title: 'MAIN', items: [
            { key:'dashboard', icon:'fa-tachometer-alt', label:'Dashboard', path:'/admin' },
            { key:'analytics', icon:'fa-chart-line', label:'Analytics', path:'/admin' },
        ]},
        { title: 'COMMERCE', items: [
            { key:'products', icon:'fa-box', label:'Products', path:'/admin/products' },
            { key:'orders', icon:'fa-shopping-cart', label:'Orders', path:'/admin/orders' },
            { key:'deliveries', icon:'fa-truck', label:'Deliveries', path:'/admin/orders' },
            { key:'payments', icon:'fa-credit-card', label:'Payments', path:'/admin/payments' },
            { key:'customers', icon:'fa-users', label:'Customers', path:'/admin/customers' },
        ]},
        { title: 'CONTENT', items: [
            { key:'videos', icon:'fa-play-circle', label:'Podcast Videos', path:'/admin/videos' },
            { key:'celebrities', icon:'fa-star', label:'Celebrity Guests', path:'/admin/celebrities' },
            { key:'cms', icon:'fa-edit', label:'CMS Manager', path:'/admin/cms' },
            { key:'media', icon:'fa-image', label:'Media', path:'/admin' },
        ]},
        { title: 'SYSTEM', items: [
            { key:'settings', icon:'fa-cog', label:'Settings', path:'/admin/settings' },
        ]},
    ];

    return (
        <div style={{ display:'flex', minHeight:'100vh', background:'#0a0a0a', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
            <div style={{ width:'260px', background:'#111', borderRight:'1px solid rgba(245,168,0,0.15)', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:100 }}>
                <div style={{ padding:'1.5rem', borderBottom:'1px solid rgba(245,168,0,0.15)', textAlign:'center' }}>
                    <img src="/images/amd-logo.png" alt="AMD" style={{ height:'50px', width:'auto' }} />
                    <div style={{ color:'#f5a800', fontSize:'0.7rem', fontWeight:700, letterSpacing:'2px', marginTop:'0.5rem' }}>ADMIN PANEL</div>
                </div>
                <nav style={{ flex:1, padding:'1rem 0', overflowY:'auto' }}>
                    {sections.map(section => (
                        <div key={section.title}>
                            <div style={{ color:'#333', fontSize:'0.7rem', fontWeight:700, letterSpacing:'1px', padding:'1rem 1.5rem 0.25rem' }}>{section.title}</div>
                            {section.items.map(i => <NavItem key={i.key} icon={i.icon} label={i.label} active={active===i.key} onClick={() => nav(i.path)} />)}
                        </div>
                    ))}
                </nav>
                <div style={{ padding:'1rem 1.5rem', borderTop:'1px solid rgba(245,168,0,0.15)', display:'flex', alignItems:'center', gap:'0.75rem' }}>
                    <div style={{ width:'38px', height:'38px', borderRadius:'50%', background:'linear-gradient(135deg,#cc0000,#f5a800)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'1rem', flexShrink:0 }}>
                        {admin?.name?.charAt(0)||'A'}
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

            <div style={{ marginLeft:'260px', flex:1, display:'flex', flexDirection:'column' }}>
                <div style={{ background:'#111', borderBottom:'1px solid rgba(245,168,0,0.15)', padding:'1rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:99 }}>
                    <div style={{ color:'#666', fontSize:'0.8rem' }}>
                        <i className="fas fa-calendar" style={{ marginRight:'0.4rem', color:'#f5a800' }} />
                        {new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
                    </div>
                    <div style={{ display:'flex', gap:'1rem' }}>
                        <button onClick={() => nav('/admin')} style={{ padding:'0.5rem 1rem', borderRadius:'8px', background:'rgba(245,168,0,0.1)', border:'1px solid rgba(245,168,0,0.3)', color:'#f5a800', cursor:'pointer', fontSize:'0.8rem', fontWeight:600, fontFamily:'inherit' }}>
                            <i className="fas fa-tachometer-alt" style={{ marginRight:'0.4rem' }} />Dashboard
                        </button>
                        <a href="/" target="_blank" style={{ padding:'0.5rem 1rem', borderRadius:'8px', background:'rgba(255,255,255,0.05)', border:'1px solid #2a2a2a', color:'#aaa', textDecoration:'none', fontSize:'0.8rem', fontWeight:600 }}>
                            <i className="fas fa-external-link-alt" style={{ marginRight:'0.4rem' }} />View Site
                        </a>
                    </div>
                </div>
                <div style={{ padding:'2rem', flex:1 }}>{children}</div>
            </div>
        </div>
    );
}
