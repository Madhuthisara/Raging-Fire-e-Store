import axiosInstance from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";

export const paymentService = {
    getActiveMethods: async (businessId?: string) => {
        const id = businessId || process.env.NEXT_PUBLIC_BUSINESS_ID || '';
        const response = await axiosInstance.get(API_ENDPOINTS.PAYMENTS.METHODS(id));
        return response.data;
    },

    initiatePayment: async (data: {
        business_id?: string;
        gateway_name: string;
        amount: number;
        currency: string;
        order_id: string;
        return_url: string;
        cancel_url: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
        district?: string;
        postal_code?: string;
        country?: string;
        items_description?: string;
    }) => {
        const payload = {
            ...data,
            business_id: data.business_id || process.env.NEXT_PUBLIC_BUSINESS_ID
        };
        const response = await axiosInstance.post(API_ENDPOINTS.PAYMENTS.INITIATE, payload);
        return response.data;
    },

    initiatePayHereSimple: async (orderId: string, amount: number) => {
        // 1. Call our Laravel API to get all PayHere checkout parameters and sandbox flag
        const response = await axiosInstance.post('/payment/initiate', {
            order_id: orderId,
            amount: amount
        });

        if (response.data.status === 'success') {
            const { params, sandbox } = response.data;

            // 2. Initialize the PayHere payment object for the SDK
            const payment = {
                sandbox: sandbox,
                ...params
            };

            // 3. Define the PayHere event handlers
            // @ts-ignore (PayHere is provided by a global script)
            window.payhere.onCompleted = (payhereOrderId: string) => {
                console.log("Payment completed. OrderID:" + payhereOrderId);
                // Redirect to success page (database is updated via notify_url webhook)
                window.location.href = params.return_url;
            };

            // @ts-ignore
            window.payhere.onDismissed = () => {
                console.log("Payment dismissed");
                // Optionally show a message or redirect to cancel page
            };

            // @ts-ignore
            window.payhere.onError = (error: string) => {
                console.error("PayHere Error:", error);
            };

            // 4. Start the payment checkout popup
            // @ts-ignore
            window.payhere.startPayment(payment);

        } else {
            throw new Error(response.data.message || 'Failed to initiate payment');
        }
    }
};
