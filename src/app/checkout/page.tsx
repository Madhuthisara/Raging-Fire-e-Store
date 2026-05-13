'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService'; // payment integration
import { useRouter } from 'next/navigation';
import { message } from 'antd';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, subtotal, clearCart } = useCartStore();
    const { customer, isAuthenticated } = useAuthStore();

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [methods, setMethods] = useState<any[]>([]);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        mainCity: '',
        nearestCity: '',
        postalCode: '',
        phone: '',
        secondaryPhone: '',
        district: 'Colombo',
    });

    useEffect(() => {
        setMounted(true);
        // Fetch active payment gateways
        const fetchMethods = async () => {
            try {
                // Hardcoded business ID fallback to match previous patterns in the store
                const businessId = '01kkazv3v65cz550skrzvfsge9';
                const res = await paymentService.getActiveMethods(businessId);
                if (res.output) {
                    setMethods(res.output);
                }
            } catch (err) {
                console.error('Failed to parse payment methods', err);
            }
        };
        fetchMethods();
    }, []);

    useEffect(() => {
        if (mounted && customer) {
            setFormData(prev => ({
                ...prev,
                email: customer.email || '',
                firstName: customer.first_name || '',
                lastName: customer.last_name || '',
                phone: customer.mobile_number || '',
                address: customer.address || '',
                // If more details were available in customer object, we'd pre-fill them here
            }));
        }
    }, [mounted, isAuthenticated, customer, router]);

    const shippingCost = 400.00;
    const finalTotal = subtotal() + shippingCost;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCompleteOrder = async () => {
        if (items.length === 0) {
            message.error('Your cart is empty.');
            return;
        }

        if (!formData.firstName || !formData.lastName || !formData.address || !formData.phone || !formData.mainCity || !formData.nearestCity) {
            message.error('Please fill in all required delivery fields.');
            return;
        }

        setLoading(true);
        try {
            // Grab business_id from the first item (all items belong to one business in this e-store)
            const businessId = (items[0] as any).businessId || '01kkazv3v65cz550skrzvfsge9';

            const orderPayload = {
                business_id: businessId,
                customer_name: `${formData.firstName} ${formData.lastName}`,
                phone_number: formData.phone,
                secondary_phone_number: formData.secondaryPhone,
                delivery_address: formData.address,
                district: formData.district,
                nearest_main_city: formData.nearestCity,
                main_city: formData.mainCity,
                postal_code: formData.postalCode,
                payment_method: paymentMethod,
                notes: '',
                items: items.map(item => ({
                    product_id: item.productId,
                    quantity: item.quantity,
                    unit_price: item.price,
                    attribute_option_ids: item.attributeOptionIds || []
                }))
            };

            const response = await orderService.placeOrder(orderPayload);

            if (response.success) {
                const createdOrderId = response.output?.id;

                if (paymentMethod === 'cod') {
                    message.success('Order placed successfully!');
                    clearCart();
                    router.push('/order-confirmation');
                } else {
                    // Gateway online payment flow
                    setIsRedirecting(true);
                    try {
                        const initResponse = await paymentService.initiatePayment({
                            business_id: businessId,
                            gateway_name: paymentMethod,
                            amount: finalTotal,
                            currency: 'LKR',
                            order_id: createdOrderId,
                            return_url: window.location.origin + '/order-confirmation',
                            cancel_url: window.location.origin + '/checkout',
                            first_name: formData.firstName,
                            last_name: formData.lastName,
                            email: formData.email,
                            phone: formData.phone,
                            address: formData.address,
                            city: formData.mainCity,
                            country: 'Sri Lanka',
                            items_description: `${items.length} items from E-store`
                        });

                        // Clear cart right before moving to gateway as per instruction
                        clearCart();

                        window.location.href = initResponse.output.payment_url;
                        // Execution stops here due to redirect
                    } catch (paymentErr: any) {
                        console.error('Payment initiation failed:', paymentErr);
                        setIsRedirecting(false);
                        message.error(paymentErr.response?.data?.message || 'Payment initiation failed. Please try again or choose COD.');
                        // Note: loading state will turn off in finally block, but cart remains intact!
                    }
                }
            }
        } catch (error: any) {
            console.error('Order placement failed:', error);
            message.error(error.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className=" max-w-7xl mx-auto bg-background flex flex-col lg:flex-row shadow-sm overflow-hidden">
            {/* LEFT COLUMN - Forms */}
            <div className="w-full lg:w-1/2 lg:border-r border-zinc-200 dark:border-zinc-800 p-6 lg:p-10 bg-background lg:overflow-y-auto" style={{ overflowY: 'auto', scrollbarWidth: 'thin' }}>

                {/* Contact Section */}
                <section className="mb-10">
                    <h2 className="text-lg font-bold text-primary mb-4 uppercase tracking-widest">Contact Information</h2>
                    <div className="mb-3">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email Address"
                            className="w-full border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-primary"
                        />
                    </div>
                </section>

                {/* Delivery Section */}
                <section className="mb-10">
                    <h2 className="text-lg font-bold text-primary mb-4 uppercase tracking-widest">Delivery Details</h2>

                    <div className="space-y-4 text-primary">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="First Name"
                                className="w-full border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Last Name"
                                className="w-full border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                            />
                        </div>

                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Full Delivery Address"
                            className="w-full border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                        />

                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                name="mainCity"
                                value={formData.mainCity}
                                onChange={handleInputChange}
                                placeholder="Main City"
                                className="w-full sm:w-1/2 border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                            />
                            <input
                                type="text"
                                name="nearestCity"
                                value={formData.nearestCity}
                                onChange={handleInputChange}
                                placeholder="Nearest City"
                                className="w-full sm:w-1/2 border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                placeholder="Postal Code"
                                className="w-full sm:w-1/2 border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                            />
                            <div className="w-full sm:w-1/2 relative">
                                <select
                                    name="district"
                                    value={formData.district}
                                    onChange={handleInputChange}
                                    className="w-full border border-zinc-300 dark:border-zinc-700 rounded-sm px-4 py-3 text-sm text-primary bg-background appearance-none focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                                >
                                    <option value="Colombo">Colombo</option>
                                    <option value="Gampaha">Gampaha</option>
                                    <option value="Kalutara">Kalutara</option>
                                    <option value="Kandy">Kandy</option>
                                    <option value="Galle">Galle</option>
                                    <option value="Matara">Matara</option>
                                    {/* Add more districts as needed */}
                                    <option value="Other">Other</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                    ▼
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Phone Number"
                                className="w-full sm:w-1/2 border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                            />
                            <input
                                type="tel"
                                name="secondaryPhone"
                                value={formData.secondaryPhone}
                                onChange={handleInputChange}
                                placeholder="Secondary Number (Optional)"
                                className="w-full sm:w-1/2 border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                            />
                        </div>
                    </div>
                </section>

                {/* Payment Section */}
                <section className="mb-10">
                    <h2 className="text-lg font-bold text-primary mb-1 uppercase tracking-widest">Payment Method</h2>
                    <p className="text-[10px] uppercase font-bold text-text-muted mb-4 tracking-widest">Select your preferred payment method</p>

                    <div className="border border-zinc-300 dark:border-zinc-700 rounded-sm overflow-hidden bg-background">
                        <label className={`flex items-center justify-between p-4 cursor-pointer border-b border-zinc-200 dark:border-zinc-800 transition-colors ${paymentMethod === 'cod' ? 'bg-zinc-50/50 dark:bg-zinc-900/50' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}`}>
                            <div className="flex items-center gap-3">
                                <div className="relative w-4 h-4 flex items-center justify-center">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                        className="peer sr-only"
                                    />
                                    <div className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-700 bg-background peer-checked:border-primary peer-checked:border-[5px] transition-all"></div>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-primary">Cash on Delivery (COD)</span>
                            </div>
                        </label>

                        {methods.map(method => (
                            <label key={method.gateway_name} className={`flex items-center justify-between p-4 cursor-pointer border-b border-zinc-200 dark:border-zinc-800 transition-colors ${paymentMethod === method.gateway_name ? 'bg-zinc-50/50 dark:bg-zinc-900/50' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="relative w-4 h-4 flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={method.gateway_name}
                                            checked={paymentMethod === method.gateway_name}
                                            onChange={() => setPaymentMethod(method.gateway_name)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-700 bg-background peer-checked:border-primary peer-checked:border-[5px] transition-all"></div>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                        {method.display_name}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </section>

                <button
                    onClick={handleCompleteOrder}
                    disabled={loading || isRedirecting}
                    className={`w-full text-background py-4 text-xs font-bold uppercase tracking-widest transition-all mb-4 ${isRedirecting ? 'bg-zinc-500 cursor-not-allowed' : 'bg-primary hover:opacity-90 disabled:opacity-50'}`}
                >
                    {isRedirecting
                        ? 'Redirecting to secure payment... Please do not refresh.'
                        : (loading ? 'Wait... Processing Order' : 'COMPLETE ORDER')}
                </button>

            </div>

            {/* RIGHT COLUMN - Order Summary */}
            <div className="w-full lg:w-1/2 p-6 lg:p-10 border-t lg:border-t-0 border-zinc-200 dark:border-zinc-800 lg:border-l-0 lg:overflow-y-auto">
                <div className="space-y-4 mb-6">
                    {items.length === 0 ? (
                        <p className="text-sm text-text-muted italic py-4">Your cart is empty.</p>
                    ) : (
                        items.map((item) => (
                            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-4 text-primary">
                                <div className="relative w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-sm border border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover rounded-sm"
                                    />
                                    <span className="absolute -top-2 -right-2 bg-zinc-600 dark:bg-zinc-700 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-primary truncate uppercase mt-1">
                                        {item.name}
                                    </h4>
                                    <p className="text-[11px] text-text-muted mt-0.5 uppercase tracking-widest">
                                        {item.size || 'N/A'} / {(item.color || 'N/A').toUpperCase()}
                                    </p>
                                </div>
                                <div className="text-xs text-primary font-bold whitespace-nowrap pl-2">
                                    LKR {(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="space-y-3 text-sm text-text-muted pt-6 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex justify-between uppercase tracking-widest text-[10px] font-bold">
                        <span>Subtotal • {items.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                        <span className="text-primary">LKR {(subtotal()).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between uppercase tracking-widest text-[10px] font-bold">
                        <span>Shipping</span>
                        <span className="text-primary">LKR {(shippingCost).toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <span className="text-lg font-black uppercase tracking-widest text-primary">Total</span>
                    <div className="flex items-baseline gap-2 text-primary">
                        <span className="text-xl font-black uppercase tracking-widest">
                            LKR {finalTotal.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
