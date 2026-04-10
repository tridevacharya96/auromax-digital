const TEAM = [
    {
        initial: 'A',
        gradient: 'linear-gradient(135deg, #6c63ff, #00d4ff)',
        name: 'Alex Johnson',
        role: 'Lead Developer',
        bio: '10+ years of experience building modern web applications.',
        socials: [
            { icon: 'fa-twitter', href: '#' },
            { icon: 'fa-github', href: '#' },
            { icon: 'fa-linkedin', href: '#' },
        ],
    },
    {
        initial: 'S',
        gradient: 'linear-gradient(135deg, #f50057, #ff9800)',
        name: 'Sara Williams',
        role: 'UI/UX Designer',
        bio: 'Passionate about creating beautiful and intuitive interfaces.',
        socials: [
            { icon: 'fa-twitter', href: '#' },
            { icon: 'fa-dribbble', href: '#' },
            { icon: 'fa-linkedin', href: '#' },
        ],
    },
    {
        initial: 'M',
        gradient: 'linear-gradient(135deg, #4caf50, #00d4ff)',
        name: 'Mike Chen',
        role: 'Backend Engineer',
        bio: 'Expert in scalable systems and cloud architecture.',
        socials: [
            { icon: 'fa-twitter', href: '#' },
            { icon: 'fa-github', href: '#' },
            { icon: 'fa-linkedin', href: '#' },
        ],
    },
];

export default function Team() {
    return (
        <section id="team">
            <div className="section-header">
                <span className="section-tag">✦ Team</span>
                <h2>Meet the <span className="gradient-text">Creators</span></h2>
                <p>The talented people behind Auromax Digital.</p>
            </div>
            <div className="team-grid">
                {TEAM.map(member => (
                    <div className="team-card" key={member.name}>
                        <div className="team-avatar" style={{ background: member.gradient }}>
                            {member.initial}
                        </div>
                        <h3>{member.name}</h3>
                        <p className="team-role">{member.role}</p>
                        <p className="team-bio">{member.bio}</p>
                        <div className="team-socials">
                            {member.socials.map(s => (
                                <a href={s.href} key={s.icon}>
                                    <i className={`fab ${s.icon}`} />
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
