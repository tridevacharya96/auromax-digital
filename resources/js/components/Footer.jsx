export default function Footer() {
    const year = new Date().getFullYear();
    const scrollTo = (id) => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' }); };
    return (
        <footer>
            <div className="footer-grid">
                <div className="footer-brand">
                    <a href="#" className="logo"><img src="/images/amd-logo.png" alt="Auromax Digital" /></a>
                    <p>A powerful modern digital experience built with Laravel & React. Fast, responsive, and beautifully designed for Auromax Digital.</p>
                    <div className="footer-socials">
                        <a href="#"><i className="fab fa-twitter" /></a>
                        <a href="#"><i className="fab fa-github" /></a>
                        <a href="#"><i className="fab fa-linkedin" /></a>
                        <a href="#"><i className="fab fa-dribbble" /></a>
                    </div>
                </div>
                <div className="footer-col"><h4>Product</h4><ul><li><a href="#features" onClick={e=>{e.preventDefault();scrollTo('features')}}>Features</a></li><li><a href="#pricing" onClick={e=>{e.preventDefault();scrollTo('pricing')}}>Pricing</a></li><li><a href="#">Changelog</a></li><li><a href="#">Roadmap</a></li></ul></div>
                <div className="footer-col"><h4>Company</h4><ul><li><a href="#team" onClick={e=>{e.preventDefault();scrollTo('team')}}>About Us</a></li><li><a href="#">Blog</a></li><li><a href="#">Careers</a></li><li><a href="#contact" onClick={e=>{e.preventDefault();scrollTo('contact')}}>Contact</a></li></ul></div>
                <div className="footer-col"><h4>Legal</h4><ul><li><a href="#">Privacy Policy</a></li><li><a href="#">Terms of Service</a></li><li><a href="#">Cookie Policy</a></li><li><a href="#">Licenses</a></li></ul></div>
            </div>
            <div className="footer-bottom">
                <p>© {year} Auromax Digital. Made with <span>♥</span> by the AMD Team.</p>
                <div className="footer-bottom-links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></div>
            </div>
        </footer>
    );
}
