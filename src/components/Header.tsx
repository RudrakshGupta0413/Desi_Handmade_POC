import Link from 'next/link'
import * as React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import '@/styles/Header.css'

export const Header = async () => {
    const payload = await getPayload({ config })

    // Get nav items from the Header global
    const headerGlobal = await payload.findGlobal({ slug: 'header' })
    const navItems = (headerGlobal as any)?.navItems || []

    return (
        <header className="header-container">
            <div className="header-left">
                <Link href="#" className="header-nav-link">
                    <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                    <span>Menu</span>
                </Link>
                <Link href="#" className="header-nav-link">
                    <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <span>Search</span>
                </Link>
            </div>

            <div className="header-center">
                <Link href="/" className="header-logo">
                    <img src="/logo.png" alt="Desi Logo" style={{ height: '28px', width: 'auto' }} />
                    <span style={{ fontSize: '20px', fontWeight: '500', fontFamily: "'Times New Roman', serif", color: '#1a1a1a' }}>Desi</span>
                </Link>
            </div>



            <div className="header-right">
                <Link href="/login" className="header-icon-link">
                    <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>Login</span>
                </Link>
                <Link href="#" className="header-icon-link">
                    <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l9.78-9.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>Wishlist</span>
                </Link>
                <Link href="/cart" className="header-icon-link">
                    <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    <span>Bag</span>
                </Link>
            </div>
        </header>
    )
}
