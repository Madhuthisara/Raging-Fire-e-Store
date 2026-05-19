'use client';

import React from 'react';
import { CONTACT_DETAILS } from '@/data/contact';
import { App, Form, Input } from 'antd';


export default function ContactPage() {
    const { message: messageApi } = App.useApp();
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Form Values:', values);
        messageApi.success('YOUR MESSAGE HAS BEEN SENT SUCCESSFULLY!');
        form.resetFields();
    };

    return (
        <div className="w-full bg-background min-h-[calc(100vh-64px)] overflow-hidden transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 md:py-8 relative z-10">

                {/* Header Section */}
                <div className="mb-16 md:mb-16">
                    <h1 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-widest mb-6 text-foreground">
                        HIT US UP
                    </h1>
                    <p className="text-xs md:text-sm uppercase tracking-widest text-text-muted max-w-2xl leading-relaxed">
                        HAVE A QUESTION ABOUT AN ORDER, WANT TO COLLABORATE, OR JUST WANT TO SAY HI? WE&apos;RE HERE FOR IT. DROP US A LINE BELOW.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

                    {/* Left Column - Contact Info */}
                    <div className="lg:col-span-4 space-y-12">
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-text-muted">
                                GENERAL INQUIRIES
                            </h3>
                            <a href={`mailto:${CONTACT_DETAILS.email}`} className="text-lg md:text-xl font-bold uppercase tracking-widest hover:opacity-70 transition-opacity text-foreground">
                                {CONTACT_DETAILS.email}
                            </a>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-text-muted">
                                CALL US
                            </h3>
                            <a href={`tel:${CONTACT_DETAILS.phone.link}`} className="text-lg md:text-xl font-bold uppercase tracking-widest hover:opacity-70 transition-opacity text-foreground">
                                {CONTACT_DETAILS.phone.display}
                            </a>
                            <p className="text-[10px] text-text-muted mt-2 uppercase tracking-widest">
                                {CONTACT_DETAILS.businessHours}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-text-muted">
                                HEADQUARTERS
                            </h3>
                            <p className="text-sm md:text-base font-bold uppercase tracking-widest leading-loose text-foreground">
                                {CONTACT_DETAILS.address.line1}<br />
                                {CONTACT_DETAILS.address.city}<br />
                                {CONTACT_DETAILS.address.country}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-text-muted">
                                FOLLOW US
                            </h3>
                            <div className="flex flex-col space-y-3">
                                <a href={CONTACT_DETAILS.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest hover:opacity-70 transition-opacity text-foreground w-fit">
                                    INSTAGRAM
                                </a>
                                <a href={CONTACT_DETAILS.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest hover:opacity-70 transition-opacity text-foreground w-fit">
                                    FACEBOOK
                                </a>
                                <a href={CONTACT_DETAILS.socials.tiktok} target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest hover:opacity-70 transition-opacity text-foreground w-fit">
                                    TIKTOK
                                </a>
                                <a href={CONTACT_DETAILS.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest hover:opacity-70 transition-opacity text-foreground w-fit">
                                    WHATSAPP
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="lg:col-span-8">
                        <Form
                            form={form}
                            onFinish={onFinish}
                            layout="vertical"
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 relative group">
                                    <Form.Item
                                        name="name"
                                        label={<span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block transition-colors group-focus-within:text-foreground">FULL NAME *</span>}
                                        rules={[{ required: true, message: 'Please enter your name' }]}
                                        className="mb-0 ant-form-item-custom"
                                    >
                                        <Input
                                            variant="underlined"
                                            className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 pb-3 pt-2 text-sm uppercase tracking-widest focus:outline-none focus:border-black dark:focus:border-white transition-colors text-foreground rounded-none px-0"
                                            placeholder="JOHN DOE"
                                        />
                                    </Form.Item>
                                </div>
                                <div className="space-y-2 relative group">
                                    <Form.Item
                                        name="email"
                                        label={<span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block transition-colors group-focus-within:text-foreground">EMAIL ADDRESS *</span>}
                                        rules={[
                                            { required: true, message: 'Please enter your email' },
                                            { type: 'email', message: 'Please enter a valid email' }
                                        ]}
                                        className="mb-0 ant-form-item-custom"
                                    >
                                        <Input
                                            variant="underlined"
                                            className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 pb-3 pt-2 text-sm uppercase tracking-widest focus:outline-none focus:border-black dark:focus:border-white transition-colors text-foreground rounded-none px-0"
                                            placeholder="JOHN@EXAMPLE.COM"
                                        />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="space-y-2 relative group">
                                <Form.Item
                                    name="subject"
                                    label={<span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block transition-colors group-focus-within:text-foreground">SUBJECT</span>}
                                    className="mb-0 ant-form-item-custom"
                                >
                                    <Input
                                        variant="underlined"
                                        className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 pb-3 pt-2 text-sm uppercase tracking-widest focus:outline-none focus:border-black dark:focus:border-white transition-colors text-foreground rounded-none px-0"
                                        placeholder="ORDER INQUIRY / COLLAB"
                                    />
                                </Form.Item>
                            </div>

                            <div className="space-y-2 relative group">
                                <Form.Item
                                    name="message"
                                    label={<span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block transition-colors group-focus-within:text-foreground">YOUR MESSAGE *</span>}
                                    rules={[{ required: true, message: 'Please enter your message' }]}
                                    className="mb-0 ant-form-item-custom"
                                >
                                    <Input.TextArea
                                        variant="underlined"
                                        autoSize={{ minRows: 5, maxRows: 10 }}
                                        className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 pb-3 pt-2 text-sm tracking-widest focus:outline-none focus:border-black dark:focus:border-white transition-colors uppercase resize-y mt-2 text-foreground rounded-none px-0"
                                        placeholder="WHAT'S ON YOUR MIND?"
                                    />
                                </Form.Item>
                            </div>

                            <button type="submit" className="w-full md:w-auto px-12 py-4  text-bg-main dark:bg-white dark:text-black font-bold uppercase tracking-widest text-xs hover:opacity-80 transition-opacity mt-8 relative overflow-hidden group">
                                <span className="relative z-10 transition-colors duration-300">SEND MESSAGE</span>
                                <div className="absolute inset-0 bg-zinc-800 dark:bg-zinc-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                            </button>
                        </Form>
                    </div>
                </div>
            </div>

            {/* Giant Background Text Area */}
            <div className="w-full flex justify-center items-end opacity-[0.03] dark:opacity-5 pointer-events-none select-none h-[30vh] md:h-[40vh] overflow-hidden relative">
                <h1 className="text-[15vw] font-heading font-black uppercase leading-none text-black dark:text-white whitespace-nowrap absolute bottom-[-15%]">
                    RAGING FIRE.
                </h1>
            </div>
        </div>
    );
}

