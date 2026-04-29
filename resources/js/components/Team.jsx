export default function Team({ members, cms }) {
    const colors = [
        'linear-gradient(135deg,#6c63ff,#00d4ff)',
        'linear-gradient(135deg,#f50057,#ff9800)',
        'linear-gradient(135deg,#4caf50,#00d4ff)',
        'linear-gradient(135deg,#cc0000,#f5a800)',
        'linear-gradient(135deg,#8b5cf6,#ec4899)',
        'linear-gradient(135deg,#f59e0b,#ef4444)',
    ];

    const team = members?.length > 0 ? members : [
        { id: 1, name: cms?.m1_name || 'Alex Johnson',  role: cms?.m1_role || 'Lead Developer',  bio: cms?.m1_bio || '10+ years of experience building modern web applications.' },
        { id: 2, name: cms?.m2_name || 'Sara Williams', role: cms?.m2_role || 'UI/UX Designer',   bio: cms?.m2_bio || 'Passionate about creating beautiful and intuitive interfaces.' },
        { id: 3, name: cms?.m3_name || 'Mike Chen',     role: cms?.m3_role || 'Backend Engineer', bio: cms?.m3_bio || 'Expert in scalable systems and cloud architecture.' },
    ];

    if (!team || team.length === 0) return null;

    return (
        <section id="team">
            <div className="section-header">
                <span className="section-tag">{cms?.tag || '✦ Team'}</span>
                <h2>Meet the <span className="gradient-text">Creators</span></h2>
                <p>{cms?.subheading || 'The talented people behind Auromax Digital.'}</p>
            </div>
            <div className="team-grid">
                {team.map((member, idx) => (
                    <div className="team-card" key={member.id}>
                        <div className="team-avatar" style={{ background: colors[idx % colors.length], overflow: 'hidden' }}>
                            {member.photo
                                ? <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                : member.name?.charAt(0)
                            }
                        </div>
                        <h3>{member.name}</h3>
                        <p className="team-role">{member.role}</p>
                        {member.bio && <p className="team-bio">{member.bio}</p>}
                        <div className="team-socials">
                            {member.twitter_url   && <a href={member.twitter_url}   target="_blank" rel="noreferrer"><i className="fab fa-twitter" /></a>}
                            {member.instagram_url && <a href={member.instagram_url} target="_blank" rel="noreferrer"><i className="fab fa-instagram" /></a>}
                            {member.linkedin_url  && <a href={member.linkedin_url}  target="_blank" rel="noreferrer"><i className="fab fa-linkedin" /></a>}
                            {member.youtube_url   && <a href={member.youtube_url}   target="_blank" rel="noreferrer"><i className="fab fa-youtube" /></a>}
                            {!member.twitter_url && !member.instagram_url && !member.linkedin_url && !member.youtube_url && (
                                <>
                                    <a href="#"><i className="fab fa-twitter" /></a>
                                    <a href="#"><i className="fab fa-github" /></a>
                                    <a href="#"><i className="fab fa-linkedin" /></a>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}