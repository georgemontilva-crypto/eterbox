import axios from "axios";
import { ENV } from "./_core/env";

const PAYPAL_BASE_URL = ENV.paypalMode === "sandbox"
  ? "https://api-m.sandbox.paypal.com"
  : "https://api-m.paypal.com";

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

/**
 * Get PayPal access token for API calls
 */
export async function getPayPalAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    return cachedAccessToken.token;
  }

  try {
    const response = await axios.post(
      `${PAYPAL_BASE_URL}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        auth: {
          username: ENV.paypalClientId,
          password: ENV.paypalSecretKey,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const token = response.data.access_token;
    const expiresIn = response.data.expires_in * 1000; // Convert to milliseconds

    cachedAccessToken = {
      token,
      expiresAt: Date.now() + expiresIn - 60000, // Refresh 1 minute before expiry
    };

    return token;
  } catch (error: any) {
    console.error("Failed to get PayPal access token:", error.response?.data || error.message);
    throw new Error("Failed to authenticate with PayPal");
  }
}

/**
 * Create a PayPal subscription for a user
 */
export async function createPayPalSubscription(
  planId: string,
  returnUrl: string,
  cancelUrl: string,
  userEmail: string,
  userId: string
) {
  const accessToken = await getPayPalAccessToken();

  try {
    const response = await axios.post(
      `${PAYPAL_BASE_URL}/v1/billing/subscriptions`,
      {
        plan_id: planId,
        subscriber: {
          email_address: userEmail,
        },
        application_context: {
          brand_name: "EterBox",
          locale: "en-US",
          user_action: "SUBSCRIBE_NOW",
          return_url: returnUrl,
          cancel_url: cancelUrl,
          notification_url: `${process.env.VITE_APP_URL || "http://localhost:3000"}/api/paypal/webhook`,
        },
        custom_id: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Failed to create PayPal subscription:", error.response?.data || error.message);
    throw new Error("Failed to create subscription");
  }
}

/**
 * Get subscription details from PayPal
 */
export async function getPayPalSubscription(subscriptionId: string) {
  const accessToken = await getPayPalAccessToken();

  try {
    const response = await axios.get(
      `${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Failed to get PayPal subscription:", error.response?.data || error.message);
    throw new Error("Failed to retrieve subscription");
  }
}

/**
 * Cancel a PayPal subscription
 */
export async function cancelPayPalSubscription(subscriptionId: string, reason: string = "User requested cancellation") {
  const accessToken = await getPayPalAccessToken();

  try {
    await axios.post(
      `${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`,
      {
        reason,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true };
  } catch (error: any) {
    console.error("Failed to cancel PayPal subscription:", error.response?.data || error.message);
    throw new Error("Failed to cancel subscription");
  }
}

/**
 * Suspend a PayPal subscription
 */
export async function suspendPayPalSubscription(subscriptionId: string, reason: string = "Suspended by user") {
  const accessToken = await getPayPalAccessToken();

  try {
    await axios.post(
      `${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}/suspend`,
      {
        reason,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true };
  } catch (error: any) {
    console.error("Failed to suspend PayPal subscription:", error.response?.data || error.message);
    throw new Error("Failed to suspend subscription");
  }
}

/**
 * Reactivate a suspended PayPal subscription
 */
export async function reactivatePayPalSubscription(subscriptionId: string) {
  const accessToken = await getPayPalAccessToken();

  try {
    await axios.post(
      `${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}/activate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true };
  } catch (error: any) {
    console.error("Failed to reactivate PayPal subscription:", error.response?.data || error.message);
    throw new Error("Failed to reactivate subscription");
  }
}

/**
 * Verify PayPal webhook signature
 */
export async function verifyPayPalWebhookSignature(
  transmissionId: string,
  transmissionTime: string,
  certUrl: string,
  transmissionSig: string,
  webhookBody: string
): Promise<boolean> {
  const accessToken = await getPayPalAccessToken();

  try {
    const response = await axios.post(
      `${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`,
      {
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: "SHA256withRSA",
        transmission_sig: transmissionSig,
        webhook_body: webhookBody,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.verification_status === "SUCCESS";
  } catch (error: any) {
    console.error("Failed to verify PayPal webhook:", error.response?.data || error.message);
    return false;
  }
}

/**
 * Create a PayPal order for one-time payment
 */
export async function createPayPalOrder(
  planName: string,
  amount: string,
  userId: string,
  planId: string
) {
  const accessToken = await getPayPalAccessToken();

  try {
    const response = await axios.post(
      `${PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: `eterbox_plan_${planId}`,
            custom_id: `${userId}_${planId}`,
            description: `EterBox ${planName} Plan - Monthly Subscription`,
            amount: {
              currency_code: "USD",
              value: amount,
            },
          },
        ],
        application_context: {
          brand_name: "EterBox",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          return_url: `${process.env.VITE_APP_URL || "http://localhost:3000"}/dashboard?payment=success`,
          cancel_url: `${process.env.VITE_APP_URL || "http://localhost:3000"}/pricing?payment=cancelled`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Failed to create PayPal order:", error.response?.data || error.message);
    throw new Error("Failed to create order");
  }
}

/**
 * Capture a PayPal order after approval
 */
export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();

  try {
    const response = await axios.post(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Failed to capture PayPal order:", error.response?.data || error.message);
    throw new Error("Failed to capture order");
  }
}

/**
 * Get PayPal order details
 */
export async function getPayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();

  try {
    const response = await axios.get(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Failed to get PayPal order:", error.response?.data || error.message);
    throw new Error("Failed to get order");
  }
}

/**
 * Create PayPal billing plans
 */
export async function createPayPalBillingPlan(
  name: string,
  description: string,
  productId: string,
  amount: string,
  currency: string = "USD",
  interval: string = "MONTH",
  intervalCount: number = 1
) {
  const accessToken = await getPayPalAccessToken();

  try {
    const response = await axios.post(
      `${PAYPAL_BASE_URL}/v1/billing/plans`,
      {
        product_id: productId,
        name,
        description,
        billing_cycles: [
          {
            frequency: {
              interval_unit: interval,
              interval_count: intervalCount,
            },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: 0, // 0 means infinite
            pricing_scheme: {
              fixed_price: {
                value: amount,
                currency_code: currency,
              },
            },
          },
        ],
        payment_preferences: {
          auto_bill_amount: "YES",
          payment_failure_threshold: 3,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Failed to create PayPal billing plan:", error.response?.data || error.message);
    throw new Error("Failed to create billing plan");
  }
}

/**
 * Create PayPal product
 */
export async function createPayPalProduct(
  name: string,
  description: string,
  type: string = "SERVICE"
) {
  const accessToken = await getPayPalAccessToken();

  try {
    const response = await axios.post(
      `${PAYPAL_BASE_URL}/v1/catalogs/products`,
      {
        name,
        description,
        type,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Failed to create PayPal product:", error.response?.data || error.message);
    throw new Error("Failed to create product");
  }
}
