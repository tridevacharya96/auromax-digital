import { useState, useEffect, useRef, useCallback } from 'react';

function VideoCard({ v, playing, setPlaying, width }) {
    return (
        <div
            style={{
                background: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                transition: 'all 0.3s',
                flexShrink: 0,
                width: width ? `${width}px` : '100%',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#f5a800'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = '#e5e5e5'; }}
        >
            {/* Thumbnail / Player */}
            <div
                style={{ position: 'relative', aspectRatio: '16/9', background: '#000', cursor: 'pointer' }}
                onClick={() => setPlaying(playing === v.id ? null : v.id)}
            >
                {playing === v.id ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${v.youtube_id}?autoplay=1`}
                        title={v.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: 'absolute', inset: 0 }}
                    />
                ) : (
                    <>
                        <img
                            src={`https://img.youtube.com/vi/${v.youtube_id}/maxresdefault.jpg`}
                            alt={v.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => { e.target.src = `https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`; }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div
                                style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg,#cc0000,#f5a800)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                                <i className="fas fa-play" style={{ color: '#fff', fontSize: '1.3rem', marginLeft: '3px' }} />
                            </div>
                        </div>
                        {v.category && (
                            <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', padding: '0.25rem 0.75rem', background: 'rgba(245,168,0,0.95)', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, color: '#000', textTransform: 'uppercase' }}>
                                {v.category}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Info */}
            <div style={{ padding: '1.25rem' }}>
                <h3 style={{ color: '#1a1a1a', fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {v.title}
                </h3>
                {v.description && (
                    <p style={{ color: '#666', fontSize: '0.82rem', margin: '0 0 1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {v.description}
                    </p>
                )}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={() => setPlaying(playing === v.id ? null : v.id)}
                        style={{ flex: 1, padding: '0.6rem', background: 'linear-gradient(135deg,#cc0000,#f5a800)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    >
                        <i className={`fas fa-${playing === v.id ? 'stop' : 'play'}`} />
                        {playing === v.id ? 'Stop' : 'Watch Now'}
                    </button>
                    <a
                        href={v.youtube_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ padding: '0.6rem 0.75rem', background: 'rgba(204,0,0,0.08)', border: '1px solid rgba(204,0,0,0.2)', borderRadius: '8px', color: '#cc0000', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <i className="fab fa-youtube" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function Podcasts({ videos }) {
    const [playing, setPlaying]         = useState(null);
    const [current, setCurrent]         = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const autoPlayRef                   = useRef(null);

    const VISIBLE     = 3;
    const useCarousel = videos && videos.length > VISIBLE;
    const total       = videos?.length || 0;
    const maxIndex    = Math.max(0, total - VISIBLE);

    const goTo = useCallback((idx) => {
        if (isAnimating) return;
        const clamped = Math.max(0, Math.min(idx, maxIndex));
        setIsAnimating(true);
        setCurrent(clamped);
        setTimeout(() => setIsAnimating(false), 400);
    }, [isAnimating, maxIndex]);

    const prev = () => goTo(current - 1);
    const next = () => goTo(current + 1);

    const startAutoPlay = useCallback(() => {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = setInterval(() => {
            setCurrent(c => (c >= maxIndex ? 0 : c + 1));
        }, 5000);
    }, [maxIndex]);

    useEffect(() => {
        if (!useCarousel) return;
        startAutoPlay();
        return () => clearInterval(autoPlayRef.current);
    }, [useCarousel, startAutoPlay]);

    if (!videos || videos.length === 0) return null;

    const CardWidth  = 360;
    const CardGap    = 24;
    const translateX = current * (CardWidth + CardGap);

    const arrowStyle = (disabled) => ({
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: disabled ? '#ddd' : 'linear-gradient(135deg,#cc0000,#f5a800)',
        border: 'none',
        color: '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.2s',
    });

    return (
        <section id="podcasts" style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-header">
                <span className="section-tag">🎙️ Podcasts</span>
                <h2>Latest <span className="gradient-text">Episodes</span></h2>
                <p style={{ color: '#555' }}>Watch our latest podcast episodes and celebrity interviews</p>
            </div>

            {useCarousel ? (
                <div
                    onMouseEnter={() => clearInterval(autoPlayRef.current)}
                    onMouseLeave={startAutoPlay}
                >
                    {/* Carousel track */}
                    <div style={{ position: 'relative' }}>
                        {/* Prev */}
                        <button
                            onClick={prev}
                            disabled={current === 0}
                            style={{ ...arrowStyle(current === 0), left: '-20px' }}
                        >
                            <i className="fas fa-chevron-left" />
                        </button>

                        {/* Sliding window */}
                        <div style={{ overflow: 'hidden', borderRadius: '16px', padding: '4px 0' }}>
                            <div style={{
                                display: 'flex',
                                gap: `${CardGap}px`,
                                transform: `translateX(-${translateX}px)`,
                                transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                                willChange: 'transform',
                            }}>
                                {videos.map(v => (
                                    <VideoCard
                                        key={v.id}
                                        v={v}
                                        playing={playing}
                                        setPlaying={setPlaying}
                                        width={CardWidth}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Next */}
                        <button
                            onClick={next}
                            disabled={current >= maxIndex}
                            style={{ ...arrowStyle(current >= maxIndex), right: '-20px' }}
                        >
                            <i className="fas fa-chevron-right" />
                        </button>
                    </div>

                    {/* Dots */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2rem' }}>
                        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                style={{
                                    width: i === current ? '28px' : '8px',
                                    height: '8px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: i === current ? 'linear-gradient(135deg,#cc0000,#f5a800)' : '#e5e5e5',
                                    transition: 'all 0.3s ease',
                                    padding: 0,
                                }}
                            />
                        ))}
                    </div>

                    {/* Counter */}
                    <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.8rem', marginTop: '0.75rem' }}>
                        {current + 1} – {Math.min(current + VISIBLE, total)} of {total} episodes
                    </p>
                </div>
            ) : (
                /* Grid mode for 3 or fewer videos */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.5rem' }}>
                    {videos.map(v => (
                        <VideoCard
                            key={v.id}
                            v={v}
                            playing={playing}
                            setPlaying={setPlaying}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
