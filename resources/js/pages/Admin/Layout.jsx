import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

function NavItem({ icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                width: '100%', padding: '0.85rem 1.5rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: active ? 'rgba(245,168,0,0.1)' : 'transparent',
                border: 'none', borderLeft: active ? '3px solid #f5a800' : '3px solid transparent',
                color: active ? '#f5a800' : '#666', cursor: 'pointer',
                fontSize: '0.9rem', fontWeight: active ? 700 : 500,
                transition: 'all 0.2s', textAlign: 'left', fontFamily: 'inherit',
                whiteSpace: 'nowrap',
            }}
        >
            <i className={`fas ${icon}`} style={{ width: '18px', flexShrink: 0 }} />
            {label}
        </button>
    );
}

export default function AdminLayout({ children, admin, active }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 900);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => { setSidebarOpen(false); }, [active]);

    const logout = () => router.post('/admin/logout');
    const nav = (path) => { router.visit(path); if (isMobile) setSidebarOpen(false); };

    const sections = [
        { title: 'MAIN', items: [
            { key: 'dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard', path: '/admin' },
            { key: 'analytics', icon: 'fa-chart-line', label: 'Analytics', path: '/admin/analytics' },
        ]},
        { title: 'COMMERCE', items: [
            { key: 'products',   icon: 'fa-box',          label: 'Products',    path: '/admin/products' },
            { key: 'orders',     icon: 'fa-shopping-cart', label: 'Orders',      path: '/admin/orders' },
            { key: 'deliveries', icon: 'fa-truck',         label: 'Deliveries',  path: '/admin/deliveries' },
            { key: 'payments',   icon: 'fa-credit-card',   label: 'Payments',    path: '/admin/payments' },
            { key: 'customers',  icon: 'fa-users',         label: 'Customers',   path: '/admin/customers' },
        ]},
        { title: 'CONTENT', items: [
            { key: 'videos',      icon: 'fa-play-circle', label: 'Podcast Videos',  path: '/admin/videos' },
            { key: 'celebrities', icon: 'fa-star',        label: 'Celebrity Guests', path: '/admin/celebrities' },
            { key: 'cms',         icon: 'fa-edit',        label: 'CMS Manager',     path: '/admin/cms' },
            { key: 'media',       icon: 'fa-image',       label: 'Media',           path: '/admin' },
        ]},
        { title: 'SYSTEM', items: [
            { key: 'theme',    icon: 'fa-paint-brush', label: 'Theme Manager', path: '/admin/theme' },
            { key: 'settings', icon: 'fa-cog',         label: 'Settings',      path: '/admin/settings' },
        ]},
    ];

    const SIDEBAR_W = 260;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', fontFamily: "'Century Gothic','CenturyGothic','AppleGothic','Nunito','Trebuchet MS',sans-serif" }}>

            {/* ── Sidebar ── */}
            <div style={{
                width: `${SIDEBAR_W}px`,
                background: '#111',
                borderRight: '1px solid rgba(245,168,0,0.15)',
                display: 'flex', flexDirection: 'column',
                position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 200,
                transition: 'transform 0.3s ease',
                transform: isMobile && !sidebarOpen ? `translateX(-${SIDEBAR_W}px)` : 'translateX(0)',
                overflowY: 'auto',
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(245,168,0,0.15)', textAlign: 'center', flexShrink: 0 }}>
                    <img src="/images/amd-logo.png" alt="AMD" style={{ height: '50px', width: 'auto' }} />
                    <div style={{ color: '#f5a800', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', marginTop: '0.5rem' }}>ADMIN PANEL</div>
                </div>

                <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
                    {sections.map(section => (
                        <div key={section.title}>
                            <div style={{ color: '#333', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', padding: '1rem 1.5rem 0.25rem' }}>{section.title}</div>
                            {section.items.map(i => <NavItem key={i.key} icon={i.icon} label={i.label} active={active === i.key} onClick={() => nav(i.path)} />)}
                        </div>
                    ))}
                </nav>

                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(245,168,0,0.15)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#cc0000,#f5a800)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                        {admin?.name?.charAt(0) || 'A'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{admin?.name}</div>
                        <div style={{ color: '#f5a800', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{admin?.role}</div>
                    </div>
                    <button onClick={logout} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '0.25rem' }} title="Logout">
                        <i className="fas fa-sign-out-alt" />
                    </button>
                </div>
            </div>

            {/* ── Mobile overlay ── */}
            {isMobile && sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 199 }} />
            )}

            {/* ── Main content ── */}
            <div style={{ marginLeft: isMobile ? 0 : `${SIDEBAR_W}px`, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, transition: 'margin-left 0.3s ease' }}>

                {/* Top bar */}
                <div style={{ background: '#111', borderBottom: '1px solid rgba(245,168,0,0.15)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 99, gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {isMobile && (
                            <button onClick={() => setSidebarOpen(o => !o)} style={{ background: 'none', border: 'none', color: '#f5a800', cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem', flexShrink: 0 }} aria-label="Toggle menu">
                                <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`} />
                            </button>
                        )}
                        <div style={{ color: '#666', fontSize: '0.8rem' }}>
                            <i className="fas fa-calendar" style={{ marginRight: '0.4rem', color: '#f5a800' }} />
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
                        <button onClick={() => nav('/admin')} style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', background: 'rgba(245,168,0,0.1)', border: '1px solid rgba(245,168,0,0.3)', color: '#f5a800', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                            <i className="fas fa-tachometer-alt" style={{ marginRight: '0.35rem' }} />Dashboard
                        </button>
                        <a href="/" target="_blank" style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a2a', color: '#aaa', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
                            <i className="fas fa-external-link-alt" style={{ marginRight: '0.35rem' }} />View Site
                        </a>
                    </div>
                </div>

                {/* Page content */}
                <div style={{ padding: isMobile ? '1.25rem' : '2rem', flex: 1, overflowX: 'hidden' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}