'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartContext'
import '@/styles/CheckoutPage.css'

const CheckoutPage = () => {
    const router = useRouter()
    const { 
        cartItems, 
        totalAmount, 
        orderId, 
        userId, 
        setOrderId, 
        setUserId, 
        setOrderStatus,
        clearCart
    } = useCart()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [merchant, setMerchant] = useState<any>(null)

    const [formData, setFormData] = useState({
        firstName: '',
        companyName: '',
        streetAddress: '',
        apartment: '',
        city: '',
        phone: '',
        email: '',
        saveInfo: false
    })

    const [paymentMethod, setPaymentMethod] = useState<'bank' | 'cod'>('cod')

    useEffect(() => {
        // Fetch merchant data
        const fetchMerchant = async () => {
            try {
                const res = await fetch('/api/menu-proxy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        workflow: "merchant",
                        action: "getMerchantByUniqueCred",
                        MERCH_UNIQUE_URL: "xyz.com"
                    }),
                })
                const data = await res.json()
                if (data.DATA) {
                    setMerchant(data.DATA)
                }
            } catch (err) {
                console.error("Merchant fetch error", err)
            }
        }
        fetchMerchant()
    }, [])

    if (cartItems.length === 0) {
        return (
            <div className="checkout-page" style={{ textAlign: 'center', padding: '100px 0' }}>
                <h1 className="checkout-title">Your Cart is Empty</h1>
                <button onClick={() => router.push('/menu')} className="btn-maroon">Return To Shop</button>
            </div>
        )
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handlePlaceOrder = async () => {
        setLoading(true)
        setError(null)

        try {
            let currentOrderId = orderId
            let currentUserId = userId

            // 1. Create order if didn't exist (using phone from form)
            if (!currentOrderId) {
                const createRes = await fetch('/api/menu-proxy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        MERCH_ID: Number(merchant?.MERCH_ID) || 1,
                        USER_ID: null,
                        CUST_ORDER_ID: null,
                        CUST_ORDER_PHONE: formData.phone,
                        ADDR_ID: null,
                        COUPON_CODE: null,
                        CUST_ORDER_STATUS: "PreBook",
                        CUST_ORDER_TYPE: "Delivery",
                        ITEMS: cartItems.map(i => ({
                            CUST_ORDER_DETAIL_ITEM_ID: Number(i.id),
                            CUST_ORDER_DETAIL_ITEM_NAME: i.name,
                            CUST_ORDER_DETAIL_ITEM_PRICE: Number(i.price),
                            CUST_ORDER_DETAIL_QTY: Number(i.quantity)
                        })),
                        USER_FIRST_NAME: formData.firstName,
                        action: "create",
                        workflow: "order",
                        endpoint: "/opn"
                    }),
                })
                const createData = await createRes.json()
                if (createData.DATA) {
                    currentOrderId = createData.DATA.CUST_ORDER_ID
                    currentUserId = createData.DATA.USER_ID
                    setOrderId(currentOrderId!)
                    setUserId(currentUserId!)
                } else {
                    throw new Error("Failed to create order")
                }
            }

            // 2. Save Address
            const addrRes = await fetch('/api/menu-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: "/opn",
                    workflow: "address",
                    action: "create",
                    USER_ID: Number(currentUserId),
                    ADDR_NAME: "Billing Address",
                    ADDR_LN_1: formData.streetAddress,
                    ADDR_LN_2: formData.apartment,
                    ADDR_LN_3: formData.city,
                    PHONE: formData.phone,
                    ADDR_STATUS: "2"
                }),
            })
            const addrData = await addrRes.json()
            const addrId = addrData.DATA?.ADDR_ID || addrData.ADDR_ID

            // 3. Add Payment Method
            await fetch('/api/menu-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: "/opn",
                    workflow: "order",
                    action: "addPaymentMethod",
                    CUST_ORDER_ID: Number(currentOrderId),
                    ORDER_PAYMENT_METHOD: paymentMethod === 'cod' ? 1 : 2
                }),
            })

            // 4. Update to Pending
            await fetch('/api/menu-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: "/opn",
                    workflow: "order",
                    action: "update",
                    MERCH_ID: Number(merchant?.MERCH_ID) || 1,
                    USER_ID: Number(currentUserId),
                    CUST_ORDER_ID: Number(currentOrderId),
                    CUST_ORDER_PHONE: formData.phone,
                    ADDR_ID: Number(addrId),
                    CUST_ORDER_STATUS: "Pending",
                    USER_FIRST_NAME: formData.firstName,
                    PLATFORM_TYPE: "web"
                }),
            })

            setOrderStatus("Pending")
            clearCart()
            router.push('/form-success') // Or a dedicated success page

        } catch (err: any) {
            setError(err.message || "Failed to place order")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="checkout-page">
            <h1 className="checkout-title">Checkout</h1>

            <div className="checkout-container">
                <div className="billing-details">
                    <h2>Billing Details</h2>
                    <div className="billing-form">
                        <div className="form-group">
                            <label>First Name<span>*</span></label>
                            <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Company Name</label>
                            <input type="text" name="companyName" className="form-control" value={formData.companyName} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Street Address<span>*</span></label>
                            <input type="text" name="streetAddress" className="form-control" value={formData.streetAddress} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Apartment, floor, etc. (optional)</label>
                            <input type="text" name="apartment" className="form-control" value={formData.apartment} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Town/City<span>*</span></label>
                            <input type="text" name="city" className="form-control" value={formData.city} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Phone Number<span>*</span></label>
                            <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email Address<span>*</span></label>
                            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} required />
                        </div>
                        <div className="checkbox-group">
                            <input type="checkbox" id="saveInfo" name="saveInfo" checked={formData.saveInfo} onChange={handleInputChange} />
                            <label htmlFor="saveInfo">Save this information for faster check-out next time</label>
                        </div>
                    </div>
                </div>

                <div className="order-summary">
                    <div style={{ marginBottom: '30px' }}>
                        {cartItems.map(item => (
                            <div key={item.id} className="summary-item-row">
                                <div className="summary-item-info">
                                    <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} className="summary-item-image" />
                                    <span>{item.name}</span>
                                </div>
                                <span style={{ fontWeight: 500 }}>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div className="summary-totals">
                        <div className="total-row">
                            <span>Subtotal:</span>
                            <span>₹{totalAmount}</span>
                        </div>
                        <div className="total-row">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>
                        <div className="total-row grand-total">
                            <span>Total:</span>
                            <span>₹{totalAmount}</span>
                        </div>
                    </div>

                    <div className="payment-methods">
                        <label className="payment-option">
                            <input type="radio" name="payment" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} />
                            <span>Bank</span>
                        </label>
                        <label className="payment-option">
                            <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                            <span>Cash on delivery</span>
                        </label>
                    </div>

                    <div className="coupon-section">
                        <input type="text" className="coupon-input" placeholder="Coupon Code" />
                        <button className="btn-maroon" style={{ padding: '10px 20px', fontSize: '12px' }}>Apply Coupon</button>
                    </div>

                    {error && <p style={{ color: '#7a1f1f', marginTop: '20px', fontSize: '14px' }}>{error}</p>}

                    <button 
                        className="btn-place-order" 
                        onClick={handlePlaceOrder}
                        disabled={loading || !formData.firstName || !formData.phone || !formData.streetAddress}
                    >
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage
