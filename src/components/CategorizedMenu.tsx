'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'

interface MenuItem {
    ITEM_ID: number
    ITEM_NAME: string
    ITEM_DESC: string | null
    ITEM_STATUS: string
    ITEM_PRICE: number
    ITEM_TAX: string | null
    ITEM_PHOTO_PATH: string[] | null
    TAG_NAME: string | null
    TAG_COLOUR: string | null
}

interface Category {
    CAT_ID: number
    CAT_NAME: string
    CAT_STATUS: string
    ITEMS: MenuItem[]
}

interface CategorizedMenuProps {
    categories: Category[]
    onAddItem: (item: MenuItem) => void
    cartItems: any[]
    onUpdateQuantity: (itemId: number, newQty: number) => void
    onRemoveItem: (itemId: number) => void
}

const IMAGE_BASE_URL = 'https://www.misrut.com/assets/img/'

export const CategorizedMenu: React.FC<CategorizedMenuProps> = ({
    categories,
    onAddItem,
    cartItems,
    onUpdateQuantity,
    onRemoveItem
}) => {
    const [activeCategory, setActiveCategory] = useState<number>(categories[0]?.CAT_ID)
    const categoryRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

    const scrollToCategory = (id: number) => {
        const element = categoryRefs.current[id]
        if (element) {
            const offset = 100 // Height of header + nav
            const bodyRect = document.body.getBoundingClientRect().top
            const elementRect = element.getBoundingClientRect().top
            const elementPosition = elementRect - bodyRect
            const offsetPosition = elementPosition - offset

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            })
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            let current = categories[0]?.CAT_ID
            for (const category of categories) {
                const element = categoryRefs.current[category.CAT_ID]
                if (element) {
                    const rect = element.getBoundingClientRect()
                    if (rect.top <= 150) {
                        current = category.CAT_ID
                    }
                }
            }
            setActiveCategory(current)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [categories])

    const getCartItem = (itemId: number) => {
        return cartItems.find(i => Number(i.id) === Number(itemId))
    }

    const allItems = categories.flatMap(category => category.ITEMS || [])

    return (
        <div className="categorized-menu" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
                gap: '20px'
            }}>
                {allItems.map(item => {
                            const cartItem = getCartItem(item.ITEM_ID)
                            const imageUrl = item.ITEM_PHOTO_PATH?.[0] ? `${IMAGE_BASE_URL}${item.ITEM_PHOTO_PATH[0]}` : 'https://via.placeholder.com/560x560?text=Product'
                            return (
                                <div
                                    key={item.ITEM_ID}
                                    style={{
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '0',
                                        overflow: 'hidden',
                                        background: '#fff',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minHeight: '420px'
                                    }}
                                    className="item-card"
                                >
                                    <a href={`/menu/${item.ITEM_ID}`} style={{ display: 'block', overflow: 'hidden', flex: 1 }}>
                                        <img
                                            src={imageUrl}
                                            alt={item.ITEM_NAME}
                                            style={{ width: '100%', height: '300px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/560x560?text=No+Image'
                                            }}
                                            onMouseOver={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)' }}
                                            onMouseOut={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1)' }}
                                        />
                                    </a>

                                    <div style={{ padding: '16px', display:'flex', flexDirection:'column', gap:'8px', textAlign: 'center' }}>
                                        <a href={`/menu/${item.ITEM_ID}`} style={{ textDecoration: 'none', color: '#111827' }}>
                                            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, lineHeight: 1.3, minHeight:'46px' }}>{item.ITEM_NAME}</h3>
                                        </a>
                                        <p style={{ fontSize: '18px', fontWeight: 400, color: '#111827', margin: '0' }}>₹{item.ITEM_PRICE}</p>
                                    </div>
                                </div>
                            )
                        })}
            </div>
        </div>
    )
}
