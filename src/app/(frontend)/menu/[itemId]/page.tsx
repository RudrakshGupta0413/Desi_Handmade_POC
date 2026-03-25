'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/CartContext'

const IMAGE_BASE_URL = 'https://www.misrut.com/assets/img/'

type MenuItem = {
    ITEM_ID: number
    ITEM_NAME: string
    ITEM_DESC: string | null
    ITEM_PRICE: number
    ITEM_PHOTO_PATH: string[] | null
    TAG_NAME?: string | null
    TAG_COLOUR?: string | null
}

export default function ProductDetailPage({ params }: { params: Promise<{ itemId: string }> }) {
    const { itemId } = React.use(params)
    const { addToCart } = useCart()
    const [product, setProduct] = useState<MenuItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true)
            try {
                const response = await fetch('/api/menu-proxy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        workflow: 'menu',
                        action: 'getMenuCustomer',
                        MERCH_ID: 1
                    })
                })
                const data = await response.json()
                const categories = data.DATA?.ITEMS || []
                const allItems: MenuItem[] = categories.flatMap((category: any) => category.ITEMS || [])
                const found = allItems.find((it) => String(it.ITEM_ID) === String(itemId))

                if (!found) {
                    throw new Error('Product not found')
                }

                setProduct(found)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Product fetch failed')
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [itemId])

    const onAddToCart = () => {
        if (!product) return
        addToCart({
            id: product.ITEM_ID,
            name: product.ITEM_NAME,
            price: Number(product.ITEM_PRICE),
            quantity: 1,
            image: product.ITEM_PHOTO_PATH?.[0] ? `${IMAGE_BASE_URL}${product.ITEM_PHOTO_PATH[0]}` : undefined
        })
    }

    if (loading) {
        return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading product...</div>
    }

    if (error || !product) {
        return (
            <div style={{ minHeight: '60vh', padding: '40px', textAlign: 'center' }}>
                <p style={{ color: '#DC2626', fontWeight: 700 }}>Unable to load product.</p>
                <p>{error || 'No product details available.'}</p>
                <Link href="/menu" style={{ color: '#9333EA', fontWeight: 700 }}>Back to product listing</Link>
            </div>
        )
    }

    return (
        <main style={{ minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: '#FFFFFF' }}>
            <div style={{ maxWidth: '1220px', margin: '0 auto', padding: '38px 20px' }}>
                <Link href="/menu" style={{ color: '#6B7280', fontSize: '14px', textDecoration: 'none', marginBottom: '18px', display: 'inline-block' }}>
                    ← Back to products
                </Link>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '42px', marginTop: '20px' }}>
                    <div style={{ borderRadius: '18px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)' }}>
                        {product.ITEM_PHOTO_PATH?.length ? (
                            <img
                                src={`${IMAGE_BASE_URL}${product.ITEM_PHOTO_PATH[0]}`}
                                alt={product.ITEM_NAME}
                                style={{ width: '100%', height: 'auto', maxHeight: '760px', objectFit: 'cover' }}
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/720x760?text=No+Image' }}
                            />
                        ) : (
                            <div style={{ width: '100%', minHeight: '760px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: '#9CA3AF' }}>No image available</span>
                            </div>
                        )}
                    </div>

                    <section style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <p style={{ margin: 0, color: '#A16207', fontWeight: 700, fontSize: '14px' }}>Printed Kurta</p>
                        <h1 style={{ margin: 0, fontSize: '3rem', lineHeight: 1.1, fontWeight: 800, color: '#111827' }}>{product.ITEM_NAME}</h1>
                        <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '14px' }}>incl. local tax & shipping</p>

                        <h2 style={{ margin: '10px 0 0 0', fontSize: '2.4rem', fontWeight: 800, color: '#111827' }}>₹{product.ITEM_PRICE}</h2>
                        <div style={{ marginTop: '6px', color: '#6B7280', fontSize: '14px' }}>in stock</div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                            <span style={{ fontWeight: 700, color: '#374151' }}>Select size</span>
                            {['XS','S','M','L','XL'].map(size => (
                                <button key={size} style={{ border: size === 'M' ? '1px solid #111827' : '1px solid #D1D5DB', background: size === 'M' ? '#111827' : '#fff', color: size === 'M' ? '#fff' : '#111827', borderRadius: '8px', minWidth: '44px', height: '36px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>{size}</button>
                            ))}
                        </div>

                        <button
                            onClick={onAddToCart}
                            style={{ marginTop: '24px', border: 'none', borderRadius: '12px', background: '#B91C1C', color: '#fff', padding: '16px 22px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
                            Add to bag
                        </button>

                        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', color: '#4B5563', fontSize: '14px', lineHeight: 1.7 }}>
                            <p style={{ fontWeight: 700, marginBottom: '10px', fontSize: '16px', color: '#111827' }}>Description</p>
                            <p style={{ margin: 0 }}>{product.ITEM_DESC || 'No description available for this product.'}</p>
                        </div>

                        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', color: '#4B5563', fontSize: '14px', lineHeight: 1.7 }}>
                            <p style={{ fontWeight: 700, marginBottom: '10px', fontSize: '16px', color: '#111827' }}>Product details</p>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                <li>Fabric: 100% cotton</li>
                                <li>Fit: Regular</li>
                                <li>Care: Gentle machine wash</li>
                                <li>Sourced from artisan catalog</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}
