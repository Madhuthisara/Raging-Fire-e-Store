'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService'; // payment integration
import { useRouter } from 'next/navigation';
import { App, Form, Input, Select } from 'antd';
import Script from 'next/script';


export default function CheckoutPage() {
    const router = useRouter();
    const { items, subtotal, clearCart } = useCartStore();
    const { customer, isAuthenticated } = useAuthStore();
    const { message: messageApi } = App.useApp();

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [methods, setMethods] = useState<any[]>([]);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Form Instance
    const [form] = Form.useForm();


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
            form.setFieldsValue({
                email: customer.email || '',
                firstName: customer.first_name || '',
                lastName: customer.last_name || '',
                phone: customer.mobile_number || '',
                address: customer.address || '',
                district: 'Colombo', // Default if not provided
            });
        }
    }, [mounted, isAuthenticated, customer, form]);


    const shippingCost = 400.00;
    const finalTotal = subtotal() + shippingCost;

    const onFinish = async (values: any) => {
        if (items.length === 0) {
            messageApi.error('Your cart is empty.');
            return;
        }

        setLoading(true);
        try {
            // Grab business_id from the first item (all items belong to one business in this e-store)
            const businessId = (items[0] as any).businessId || '01kkazv3v65cz550skrzvfsge9';

            const orderPayload = {
                business_id: businessId,
                customer_name: `${values.firstName} ${values.lastName}`,
                phone_number: values.phone,
                secondary_phone_number: values.secondaryPhone,
                delivery_address: values.address,
                district: values.district,
                nearest_main_city: values.nearestCity,
                main_city: values.mainCity,
                postal_code: values.postalCode,
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
                    messageApi.success('Order placed successfully!');
                    clearCart();
                    router.push('/order-confirmation');
                } else {
                    // Gateway online payment flow
                    setIsRedirecting(true);
                    try {
                        if (paymentMethod === 'payhere') {
                            // Use our new Simple/Public initiation flow for PayHere
                            await paymentService.initiatePayHereSimple(createdOrderId, finalTotal);
                            // Clear cart right before moving to gateway
                            clearCart();
                            // The above method handles redirection, so we stop here
                            return;
                        }

                        // Fallback/Existing flow for other gateways
                        const initResponse = await paymentService.initiatePayment({
                            business_id: businessId,
                            gateway_name: paymentMethod,
                            amount: finalTotal,
                            currency: 'LKR',
                            order_id: createdOrderId,
                            return_url: window.location.origin + '/order-confirmation',
                            cancel_url: window.location.origin + '/checkout',
                            first_name: values.firstName,
                            last_name: values.lastName,
                            email: values.email,
                            phone: values.phone,
                            address: values.address,
                            city: values.mainCity,
                            country: 'Sri Lanka',
                            items_description: `${items.length} items from E-store`
                        });

                        // Clear cart right before moving to gateway
                        clearCart();

                        // Standard redirect for other gateways (Stripe, PayPal)
                        window.location.href = initResponse.output.payment_url;

                    } catch (paymentErr: any) {
                        console.error('Payment initiation failed:', paymentErr);
                        setIsRedirecting(false);
                        messageApi.error(paymentErr.response?.data?.message || 'Payment initiation failed. Please try again or choose COD.');
                    }
                }
            }
        } catch (error: any) {
            console.error('Order placement failed:', error);
            messageApi.error(error.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    if (!mounted) return null;

    return (
        <div className="flex justify-center items-center">
            <Script
                src="https://www.payhere.lk/lib/payhere.js"
                strategy="beforeInteractive"
            />
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                className="w-[80%] bg-background flex flex-col lg:flex-row shadow-sm overflow-hidden"
            >
                {/* LEFT COLUMN - Forms */}
                <div className="w-full lg:w-1/2 lg:border-r border-zinc-200 dark:border-zinc-800 p-6 lg:p-10 bg-background lg:overflow-y-auto" style={{ overflowY: 'auto', scrollbarWidth: 'thin' }}>


                    {/* Contact Section */}
                    <section className="mb-10">
                        <h2 className="text-lg font-bold text-primary mb-4 uppercase tracking-widest">Contact Information</h2>
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                        >
                            <Input
                                placeholder="Email Address"
                                variant="outlined"
                                size='large'
                                className="w-full border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-primary h-auto"
                            />
                        </Form.Item>
                    </section>


                    {/* Delivery Section */}
                    <section className="mb-10">
                        <h2 className="text-lg font-bold text-primary mb-4 uppercase tracking-widest">Delivery Details</h2>

                        <div className="space-y-4 text-primary">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Form.Item
                                    name="firstName"
                                    className="w-full mb-0"
                                    rules={[{ required: true, message: 'Please enter your first name' }]}
                                >
                                    <Input
                                        placeholder="First Name"
                                        size='large'
                                        className="w-full border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm h-auto"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="lastName"
                                    className="w-full mb-0"

                                    rules={[{ required: true, message: 'Please enter your last name' }]}
                                >
                                    <Input
                                        placeholder="Last Name"
                                        size='large'
                                        className="w-full border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm h-auto"
                                    />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="address"
                                rules={[{ required: true, message: 'Please enter your delivery address' }]}
                            >
                                <Input
                                    placeholder="Full Delivery Address"
                                    size='large'
                                    className="w-full border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm h-auto"
                                />
                            </Form.Item>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Form.Item
                                    name="mainCity"
                                    className="w-full sm:w-1/2 mb-0"
                                    rules={[{ required: true, message: 'Please enter your main city' }]}
                                >
                                    <Input
                                        placeholder="Main City"
                                        size='large'
                                        className="w-full border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm h-auto"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="nearestCity"
                                    className="w-full sm:w-1/2 mb-0"
                                    rules={[{ required: true, message: 'Please enter your nearest city' }]}
                                >
                                    <Input
                                        placeholder="Nearest City"
                                        size='large'
                                        className="w-full border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm h-auto"
                                    />
                                </Form.Item>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Form.Item
                                    name="postalCode"
                                    className="w-full sm:w-1/2 mb-0"
                                >
                                    <Input
                                        placeholder="Postal Code"
                                        size='large'
                                        className="w-full border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm h-auto"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="district"
                                    className="w-full sm:w-1/2 mb-0"
                                    rules={[{ required: true, message: 'Please select a district' }]}
                                >
                                    <Select
                                        placeholder="Select District"
                                        size='large'
                                        className="w-full h-[46px] border-zinc-300 dark:border-zinc-700 rounded-sm text-sm text-primary bg-background ant-select-custom"
                                        classNames={{
                                            popup: { root: 'dark:bg-zinc-900' }
                                        }}
                                    >
                                        <Select.Option value="Colombo">Colombo</Select.Option>
                                        <Select.Option value="Gampaha">Gampaha</Select.Option>
                                        <Select.Option value="Kalutara">Kalutara</Select.Option>
                                        <Select.Option value="Kandy">Kandy</Select.Option>
                                        <Select.Option value="Galle">Galle</Select.Option>
                                        <Select.Option value="Matara">Matara</Select.Option>
                                        <Select.Option value="Other">Other</Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Form.Item
                                    name="phone"
                                    className="w-full sm:w-1/2 mb-0"
                                    rules={[
                                        { required: true, message: 'Please enter your phone number' },
                                        { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit phone number' }
                                    ]}
                                >
                                    <Input
                                        type="tel"
                                        placeholder="Phone Number"
                                        size='large'
                                        className="w-full border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm h-auto"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="secondaryPhone"
                                    className="w-full sm:w-1/2 mb-0"
                                    rules={[
                                        { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit phone number' }
                                    ]}
                                >
                                    <Input
                                        type="tel"
                                        placeholder="Secondary Number (Optional)"
                                        size='large'
                                        className="w-full border border-zinc-300 dark:border-zinc-700 bg-background rounded-sm px-4 py-3 text-sm h-auto"
                                    />
                                </Form.Item>
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
                        type="submit"
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
            </Form></div>
    );
}

