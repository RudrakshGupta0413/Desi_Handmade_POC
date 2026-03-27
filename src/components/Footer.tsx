import * as React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import '../styles/Footer.css'

export const Footer = async () => {
    const payload = await getPayload({ config })
    const footerData = await payload.findGlobal({ slug: 'footer' }) as any

    const logoText = footerData?.logo?.text || 'Desi'
    const tagline = footerData?.logo?.tagline || 'Developing Ecologically Sustainable Industry'
    const quickLinks = footerData?.quickLinks || [
        { label: 'Blog', url: '#' },
        { label: 'Charaka', url: '#' },
        { label: 'Process', url: '#' },
        { label: 'About Us', url: '#' }
    ]
    const companyLinks = footerData?.companyLinks || [
        { label: 'Privacy Policy', url: '#' },
        { label: 'Terms of Use', url: '#' },
        { label: 'Terms of Sale', url: '#' },
        { label: 'Shipping & Delivery', url: '#' },
        { label: 'Returns & Cancellations', url: '#' }
    ]
    const helpLinks = footerData?.helpLinks || [
        { label: 'Customer Care', url: '#' },
        { label: 'FAQs', url: '#' },
        { label: 'International Shipping', url: '#' }
    ]
    const enquiryText = footerData?.enquiryText || 'Call us on 72922895... (dummy)'
    const copyrightText = footerData?.copyrightText || 'All rights reserved'
    
    return (
        <footer className="footer" style={{ borderTop: '1px solid #eee', marginTop: '40px' }}>
            <div className="footer-upper">
                <div className="footer-brand">
                    <div className="footer-logo" style={{ color: '#7a1f1f', fontStyle: 'italic' }}>{logoText}</div>
                    <p className="footer-tagline" style={{ fontSize: '24px', fontWeight: '500', maxWidth: '300px' }}>{tagline}</p>
                </div>

                <div className="footer-column">
                    <span className="footer-column-title">Quick Links</span>
                    {quickLinks.map((link: any, i: number) => (
                        <Link key={i} href={link.url || '/'} className="footer-link">{link.label}</Link>
                    ))}
                </div>

                <div className="footer-column">
                    <span className="footer-column-title">Company</span>
                    {companyLinks.map((link: any, i: number) => (
                        <Link key={i} href={link.url || '/'} className="footer-link">{link.label}</Link>
                    ))}
                </div>

                <div className="footer-column">
                    <span className="footer-column-title">Help</span>
                    {helpLinks.map((link: any, i: number) => (
                        <Link key={i} href={link.url || '/'} className="footer-link">{link.label}</Link>
                    ))}
                </div>

                <div className="footer-column">
                    <span className="footer-column-title">For Enquiries</span>
                    <span className="footer-enquiry-text">{enquiryText}</span>
                </div>
            </div>

            <div className="footer-bottom">
                <span className="footer-copyright">© {new Date().getFullYear()} {copyrightText}</span>
                <div className="footer-socials">
                    {/* Social icons here */}
                    <Link href="#" className="footer-social-link" aria-label="Facebook">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M12 2.04c-5.5 0-10 4.5-10 10 0 5 3.66 9.12 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.89h-2.33v6.99C18.34 21.16 22 17.04 22 12.04c0-5.5-4.5-10-10-10z"/>
                        </svg>
                    </Link>
                    <Link href="#" className="footer-social-link" aria-label="Instagram">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
                        </svg>
                    </Link>
                    <Link href="#" className="footer-social-link" aria-label="X">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                    </Link>
                    <Link href="#" className="footer-social-link" aria-label="YouTube">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M22.23 7.34c-.24-1.1-1.11-1.93-2.23-2.17C18.1 5 12 5 12 5s-6.1 0-8 1.17c-1.12.24-1.99 1.07-2.23 2.17C1 9.24 1 12 1 12s0 2.76.77 4.66c.24 1.1 1.11 1.93 2.23 2.17 1.9.17 8 .17 8 .17s6.1 0 8-.17c1.12-.24 1.99-1.07 2.23-2.17.77-1.9.77-4.66.77-4.66s0-2.76-.77-4.66zM9.54 15V9l5.04 3-5.04 3z"/>
                        </svg>
                    </Link>
                </div>
            </div>
        </footer>
    )
}
