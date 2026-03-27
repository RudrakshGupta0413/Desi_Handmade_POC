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
                    <Link href="#" className="footer-social-link">FB</Link>
                    <Link href="#" className="footer-social-link">IG</Link>
                    <Link href="#" className="footer-social-link">TW</Link>
                    <Link href="#" className="footer-social-link">YT</Link>
                </div>
            </div>
        </footer>
    )
}
