import { useState } from 'react';
import axios from 'axios';

export default function Contact({ cms }) {
    const [form, setForm] = useState({ first_name:'', last_name:'', email:'', subject:'', message:'' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setErrors(er => ({ ...er, [e.target.name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await axios.post('/api/contact', form);
            setSuccess(true);
            setForm({ first_name:'', last_name:'', email:'', subject:'', message:'' });
        } catch (err) {
            if (err.response?.status === 422) setErrors(err.response.data.errors || {});
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact">
            <div className="section-header">
                <span className="section-tag">{cms?.tag || '✦ Contact'}</span>
                <h2>Get In <span className="gradient-text">Touch</span></h2>
                <p>{cms?.subheading || "Have a question? We'd love to hear from you."}</p>
            </div>
            <div className="contact-wrapper">
                <div className="contact-info">
                    <div className="contact-item">
                        <div className="contact-icon"><i className="fas fa-envelope" /></div>
                        <div><h4>Email</h4><p>{cms?.email || 'hello@auromaxdigital.com'}</p></div>
                    </div>
                    <div className="contact-item">
                        <div className="contact-icon"><i className="fas fa-phone" /></div>
                        <div><h4>Phone</h4><p>{cms?.phone || '+1 (555) 123-4567'}</p></div>
                    </div>
                    <div className="contact-item">
                        <div className="contact-icon"><i className="fas fa-map-marker-alt" /></div>
                        <div><h4>Location</h4><p>{cms?.location || 'Bangalore, India'}</p></div>
                    </div>
                </div>
                {success ? (
                    <div className="success-message" style={{ display:'block' }}>
                        <div className="success-icon"><i className="fas fa-check" /></div>
                        <h3>Message Sent!</h3>
                        <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                        <button className="btn btn-primary" style={{ marginTop:'1.5rem' }} onClick={() => setSuccess(false)}>Send Another</button>
                    </div>
                ) : (
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-content">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" name="first_name" placeholder="John" value={form.first_name} onChange={handleChange} required />
                                    {errors.first_name && <span className="form-error">{errors.first_name[0]}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" name="last_name" placeholder="Doe" value={form.last_name} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
                                {errors.email && <span className="form-error">{errors.email[0]}</span>}
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <select name="subject" value={form.subject} onChange={handleChange} required>
                                    <option value="" disabled>Select a subject</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="support">Technical Support</option>
                                    <option value="billing">Billing Question</option>
                                    <option value="partnership">Partnership</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea name="message" placeholder="Tell us how we can help..." value={form.message} onChange={handleChange} required />
                                {errors.message && <span className="form-error">{errors.message[0]}</span>}
                            </div>
                            <button type="submit" className="btn btn-primary form-submit" disabled={loading}>
                                {loading ? <><i className="fas fa-spinner fa-spin" /> Sending...</> : <><i className="fas fa-paper-plane" /> Send Message</>}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
