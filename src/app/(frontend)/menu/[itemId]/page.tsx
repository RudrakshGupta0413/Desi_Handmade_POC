'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartContext'
import '@/styles/ProductDetail.css'

const IMAGE_BASE_URL = 'https://www.misrut.com/assets/img/'

type MenuItem = {
    ITEM_ID: number
    ITEM_NAME: string
    ITEM_DESC: string | null
    ITEM_PRICE: number
    ITEM_PHOTO_PATH: string[] | null
    TAG_NAME?: string | null
    TAG_COLOUR?: string | null
    isFirstProduct?: boolean
}


const AccordionItem = ({ title, children, isOpen, onClick }: { title: string, children: React.ReactNode, isOpen: boolean, onClick: () => void }) => {
    return (
        <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
            <div className="accordion-header" onClick={onClick}>
                <span>{title}</span>
                <span className="accordion-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>

            </div>

            <div className="accordion-content">
                {children}
            </div>
        </div>
    )
}

export default function ProductDetailPage({ params }: { params: Promise<{ itemId: string }> }) {
    const { itemId } = React.use(params)
    const router = useRouter()
    const { cartItems, addToCart, orderId, userId } = useCart()
    const [product, setProduct] = useState<MenuItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedSize, setSelectedSize] = useState<string>('M')
    const [openAccordions, setOpenAccordions] = useState<string[]>(['description'])

    const toggleAccordion = (id: string) => {
        setOpenAccordions(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id) 
                : [...prev, id]
        )
    }


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
                const firstItem = allItems[0]
                const found = allItems.find((it) => String(it.ITEM_ID) === String(itemId))

                if (!found) {
                    throw new Error('Product not found')
                }

                if (firstItem && String(found.ITEM_ID) === String(firstItem.ITEM_ID)) {
                    found.isFirstProduct = true
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

    const onAddToCart = async () => {
        if (!product) return

        const newItem = {
            id: product.ITEM_ID,
            name: `${product.ITEM_NAME} (${selectedSize})`,
            price: Number(product.ITEM_PRICE),
            quantity: 1,
            image: product.ITEM_PHOTO_PATH?.[0] ? `${IMAGE_BASE_URL}${product.ITEM_PHOTO_PATH[0]}` : undefined
        }

        // 1. Add to local cart
        addToCart(newItem)

        // 2. Sync with backend if orderId exists
        if (orderId) {
            const existing = cartItems.find(i => Number(i.id) === Number(product.ITEM_ID))
            let updatedItems;
            if (existing) {
                updatedItems = cartItems.map(i =>
                    Number(i.id) === Number(product.ITEM_ID) ? { ...i, quantity: i.quantity + 1 } : i
                )
            } else {
                updatedItems = [...cartItems, newItem]
            }

            try {
                await fetch('/api/menu-proxy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        endpoint: "/opn",
                        workflow: "order",
                        action: "update",
                        MERCH_ID: 1,
                        USER_ID: Number(userId),
                        CUST_ORDER_ID: Number(orderId),
                        ITEMS: updatedItems.map(i => ({
                            CUST_ORDER_DETAIL_ITEM_ID: Number(i.id),
                            CUST_ORDER_DETAIL_ITEM_NAME: i.name,
                            CUST_ORDER_DETAIL_ITEM_PRICE: Number(i.price),
                            CUST_ORDER_DETAIL_QTY: Number(i.quantity)
                        })),
                        CUST_ORDER_STATUS: "PreBook"
                    }),
                })
            } catch (err) {
                console.error("Failed to sync cart", err)
            }
        }

        // 3. Redirect to Cart page
        router.push('/cart')
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

    const sizes = ['XS', 'S', 'M', 'L', 'XL']

    return (
        <main className="product-detail-container">
            <div className="product-main-section">
                <div className="product-image-container">
                    {product.ITEM_PHOTO_PATH?.length || product.isFirstProduct ? (
                        <img
                            src={product.isFirstProduct ? '/dummy_product.jpg' : `${IMAGE_BASE_URL}${product.ITEM_PHOTO_PATH?.[0]}`}
                            alt={product.ITEM_NAME}
                            className="product-image"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/720x760?text=No+Image' }}
                        />
                    ) : (
                        <div style={{ width: '100%', minHeight: '760px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: '#9CA3AF' }}>No image available</span>
                        </div>
                    )}
                </div>


                <section className="product-info-container" style={{ fontFamily: "'Libre Baskerville', serif" }}>

                    <p className="product-category">Printed Kurtha</p>
                    <h1 className="product-title">{product.ITEM_NAME}</h1>
                    <div className="product-price">₹{product.ITEM_PRICE}</div>
                    <p className="product-tax-info">incl. local Tax & Shipping.</p>

                    <div className="size-selection-container">
                        <div className="size-header">
                            <span className="size-label">Select Size: <span style={{ fontWeight: 'normal' }}>{selectedSize === 'XS' ? 'Extra Small' : selectedSize === 'S' ? 'Small' : selectedSize === 'M' ? 'Medium' : selectedSize === 'L' ? 'Large' : 'Extra Large'}</span></span>
                            <span className="size-guide-link">Size guide</span>
                        </div>
                        <div className="size-grid">
                            {sizes.map(size => (
                                <button
                                    key={size}
                                    className={`size-button ${selectedSize === size ? 'active' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={onAddToCart}
                        className="add-to-bag-button"
                    >
                        Add to Bag
                    </button>
                    
                    <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                        {/* Empty spacing to match layout */}
                    </div>
                </section>
            </div>

            <div className="details-section" style={{ fontFamily: "'Baskerville Old Face', 'Baskerville', serif" }}>

                <div className="accordion-container">
                    <AccordionItem
                        title="Description"
                        isOpen={openAccordions.includes('description')}
                        onClick={() => toggleAccordion('description')}
                    >

                        <p>{product.ITEM_DESC || 'Simple hand block printed Kurta with short sleeves. Made of pure cotton naturally dyed, hand-woven fabric that is soft and breathable. Comfortable to be worn for casual everyday wear, this knee length kurta with side slits can be paired with a pair of salwar or pants.'}</p>
                    </AccordionItem>

                    <AccordionItem
                        title="Product Details"
                        isOpen={openAccordions.includes('details')}
                        onClick={() => toggleAccordion('details')}
                    >

                        <div style={{ display: 'grid', gap: '15px' }}>
                            <div>
                                <strong style={{ display: 'block', color: '#1E1E1E' }}>Fabric-Weave</strong>
                                <span>Plain</span>
                            </div>
                            <div>
                                <strong style={{ display: 'block', color: '#1E1E1E' }}>Yarn-Count</strong>
                                <span>Warp-2X40 Weft-20</span>
                            </div>
                            <div>
                                <strong style={{ display: 'block', color: '#1E1E1E' }}>Dye-Ingredient</strong>
                                <span>Natural Yarn</span>
                            </div>
                        </div>
                    </AccordionItem>

                    <AccordionItem
                        title="Size Guide"
                        isOpen={openAccordions.includes('sizeguide')}
                        onClick={() => toggleAccordion('sizeguide')}
                    >

                        <p>Sleek and timeless. Titanium glasses with an innovative bridge. A frame to suit every face, Morgan is a classic 'panto' shape. Named after James Morgan, the engineer who built the Regent's Canal, it features custom elements including fluid single piece bridge, adjustable nose pads and temple tips based on Constantin Brancusi's Bird in Space.</p>
                    </AccordionItem>
                </div>

                <div className="note-card">
                    <span className="note-title">Note</span>
                    <p className="note-content">
                        Natural Dyes are a result of processing of the root, bark, peel and pulp of trees and plants found in nature. The dyes thus prepared from natural processes vary in their properties depending on weather conditions. The shade of the fabric might not always be consistent. The actual product might differ slightly from the photograph.
                        <br /><br />
                        The minor imperfections in the fabric as a result of hand woven processes are not defects; they are a unique feature of hand woven cloth.
                        <br /><br />
                        Unstitched products tend to shrink upto 5%. Garments are pre-shrunk but a slight shrinkage is observed in some cases. Each product is unique and special.
                    </p>
                </div>
            </div>
        </main>
    )
}
