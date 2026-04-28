export default function Celebrities({ celebrities }) {
    if (!celebrities || celebrities.length === 0) return null;

    return (
        <section id="celebrities" style={{ padding: '5rem 2rem', background: '#f8f8f8' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="section-header">
                    <span className="section-tag">⭐ Celebrity Guests</span>
                    <h2>Our <span className="gradient-text">Star Guests</span></h2>
                    <p style={{ color: '#555' }}>Renowned personalities who have graced our platform</p>
                </div>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    justifyContent: 'center',
                }}>
                    {celebrities.map(c => (
                        <div
                            key={c.id}
                            style={{
                                background: '#fff',
                                border: '1px solid #e5e5e5',
                                borderRadius: '20px',
                                padding: '1.75rem 1.25rem',
                                textAlign: 'center',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                                position: 'relative',
                                width: '200px',
                                flexShrink: 0,
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.borderColor = '#f5a800';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(245,168,0,0.15)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = '';
                                e.currentTarget.style.borderColor = '#e5e5e5';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
                            }}
                        >
                            {c.is_featured && (
                                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'linear-gradient(135deg,#cc0000,#f5a800)', borderRadius: '50px', padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>
                                    ⭐ Featured
                                </div>
                            )}

                            {/* Avatar */}
                            <div style={{ width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 1rem', overflow: 'hidden', border: '3px solid #f5a800', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {c.photo ? (
                                    <img src={c.photo} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#f5a800,#cc0000)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: 700 }}>
                                        {c.name?.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Name */}
                            <h3 style={{ color: '#1a1a1a', fontSize: '1rem', fontWeight: 800, margin: '0 0 0.3rem' }}>{c.name}</h3>

                            {/* Profession */}
                            <p style={{ background: 'linear-gradient(135deg,#cc0000,#f5a800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '0.8rem', fontWeight: 700, margin: '0 0 0.75rem' }}>
                                {c.profession}
                            </p>

                            {/* Bio */}
                            {c.bio && (
                                <p style={{ color: '#888', fontSize: '0.78rem', lineHeight: '1.5', margin: '0 0 1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {c.bio}
                                </p>
                            )}

                            {/* Socials */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                {c.spotify_url && (
                                    <a href={c.spotify_url} target="_blank" rel="noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(29,185,84,0.1)', border: '1px solid rgba(29,185,84,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1db954', textDecoration: 'none', fontSize: '0.85rem' }}>
                                        <i className="fab fa-spotify" />
                                    </a>
                                )}
                                {c.instagram_url && (
                                    <a href={c.instagram_url} target="_blank" rel="noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(225,48,108,0.1)', border: '1px solid rgba(225,48,108,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e1306c', textDecoration: 'none', fontSize: '0.85rem' }}>
                                        <i className="fab fa-instagram" />
                                    </a>
                                )}
                                {c.youtube_url && (
                                    <a href={c.youtube_url} target="_blank" rel="noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(204,0,0,0.1)', border: '1px solid rgba(204,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cc0000', textDecoration: 'none', fontSize: '0.85rem' }}>
                                        <i className="fab fa-youtube" />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}