export default function Team({ cms }) {
    const members = [
        { initial: cms?.m1_initial || 'A', gradient: cms?.m1_color || 'linear-gradient(135deg,#6c63ff,#00d4ff)', name: cms?.m1_name || 'Alex Johnson', role: cms?.m1_role || 'Lead Developer', bio: cms?.m1_bio || '10+ years of experience.' },
        { initial: cms?.m2_initial || 'S', gradient: cms?.m2_color || 'linear-gradient(135deg,#f50057,#ff9800)', name: cms?.m2_name || 'Sara Williams', role: cms?.m2_role || 'UI/UX Designer', bio: cms?.m2_bio || 'Passionate about beautiful interfaces.' },
        { initial: cms?.m3_initial || 'M', gradient: cms?.m3_color || 'linear-gradient(135deg,#4caf50,#00d4ff)', name: cms?.m3_name || 'Mike Chen', role: cms?.m3_role || 'Backend Engineer', bio: cms?.m3_bio || 'Expert in scalable systems.' },
    ];

    return (
        <section id="team">
            <div className="section-header">
                <span className="section-tag">{cms?.tag || '✦ Team'}</span>
                <h2>Meet the <span className="gradient-text">Creators</span></h2>
                <p>{cms?.subheading || 'The talented people behind Auromax Digital.'}</p>
            </div>
            <div className="team-grid">
                {members.map(member => (
                    <div className="team-card" key={member.name}>
                        <div className="team-avatar" style={{ background: member.gradient }}>{member.initial}</div>
                        <h3>{member.name}</h3>
                        <p className="team-role">{member.role}</p>
                        <p className="team-bio">{member.bio}</p>
                        <div className="team-socials">
                            <a href="#"><i className="fab fa-twitter" /></a>
                            <a href="#"><i className="fab fa-github" /></a>
                            <a href="#"><i className="fab fa-linkedin" /></a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
