'use client'

import React from 'react'
import Link from 'next/link'
import { useCart } from '@/components/CartContext'
import '@/styles/CartPage.css'

const CartPage = () => {
    const { cartItems, updateQuantity, totalAmount } = useCart()

    if (cartItems.length === 0) {
        return (
            <div className="cart-page" style={{ textAlign: 'center', padding: '100px 0' }}>
                <h1 className="cart-title">Your Cart is Empty</h1>
                <Link href="/menu" className="btn-maroon">Return To Shop</Link>
            </div>
        )
    }

    return (
        <div className="cart-page">
            <h1 className="cart-title">Cart</h1>

            <table className="cart-table">
                <thead>
                    <tr className="cart-header">
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item) => (
                        <tr key={item.id} className="cart-row">
                            <td className="product-cell">
                                <img 
                                    src={item.image || 'https://via.placeholder.com/80'} 
                                    alt={item.name} 
                                    className="product-image" 
                                />
                                <span className="product-name">{item.name}</span>
                            </td>
                            <td className="price-cell">₹{item.price}</td>
                            <td>
                                <div className="quantity-selector">
                                    <input 
                                        type="number" 
                                        className="quantity-input" 
                                        value={item.quantity < 10 ? `0${item.quantity}` : item.quantity} 
                                        readOnly 
                                    />
                                    <div className="quantity-btn">
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ cursor: 'pointer', border: 'none', background: 'none', fontSize: '10px' }}>▲</button>
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ cursor: 'pointer', border: 'none', background: 'none', fontSize: '10px' }}>▼</button>
                                    </div>
                                </div>
                            </td>
                            <td className="subtotal-cell">₹{item.price * item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="cart-actions">
                <Link href="/menu" className="btn-maroon" style={{ background: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                    Return To Shop
                </Link>
                <div style={{ display: 'flex', gap: '20px' }}>
                    {/* Add update cart or other buttons here if needed */}
                    <Link href="/checkout" className="btn-maroon">
                        Checkout
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CartPage
