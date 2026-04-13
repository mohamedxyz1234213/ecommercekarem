const crypto = require('crypto');

/**
 * Paymob payment integration utility.
 *
 * Environment variables required:
 *   PAYMOB_API_KEY        — API key from Paymob dashboard
 *   PAYMOB_INTEGRATION_ID — Integration ID for your payment method
 *   PAYMOB_IFRAME_ID      — iframe ID for the hosted checkout
 *   PAYMOB_HMAC_SECRET    — HMAC secret for verifying webhooks
 */

const PAYMOB_BASE_URL = 'https://accept.paymob.com/api';

/**
 * Step 1: Authenticate with Paymob and get auth token.
 */
const getAuthToken = async () => {
  const apiKey = process.env.PAYMOB_API_KEY;
  if (!apiKey) {
    throw new Error('PAYMOB_API_KEY is not configured');
  }

  const response = await fetch(`${PAYMOB_BASE_URL}/auth/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey }),
  });

  if (!response.ok) {
    throw new Error(`Paymob auth failed: ${response.status}`);
  }

  const data = await response.json();
  return data.token;
};

/**
 * Step 2: Create an order on Paymob.
 */
const createPaymobOrder = async (authToken, order) => {
  const response = await fetch(`${PAYMOB_BASE_URL}/ecommerce/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: Math.round(order.totalPrice * 100),
      currency: 'EGP',
      merchant_order_id: order._id.toString(),
      items: order.items.map((item) => ({
        name: item.name,
        amount_cents: Math.round(item.price * 100),
        quantity: item.quantity,
        description: item.name,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error(`Paymob order creation failed: ${response.status}`);
  }

  const data = await response.json();
  return data.id; // Paymob order ID
};

/**
 * Step 3: Generate a payment key.
 */
const getPaymentKey = async (authToken, paymobOrderId, order, user) => {
  const integrationId = process.env.PAYMOB_INTEGRATION_ID;
  if (!integrationId) {
    throw new Error('PAYMOB_INTEGRATION_ID is not configured');
  }

  const response = await fetch(`${PAYMOB_BASE_URL}/acceptance/payment_keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: Math.round(order.totalPrice * 100),
      expiration: 3600,
      order_id: paymobOrderId,
      billing_data: {
        first_name: user.name?.split(' ')[0] || 'Customer',
        last_name: user.name?.split(' ').slice(1).join(' ') || 'N/A',
        email: user.email || order.email,
        phone_number: order.shippingAddress?.phone || 'N/A',
        street: order.shippingAddress?.street || 'N/A',
        city: order.shippingAddress?.city || 'N/A',
        state: order.shippingAddress?.state || 'N/A',
        country: order.shippingAddress?.country || 'EG',
        postal_code: order.shippingAddress?.zipCode || 'N/A',
        apartment: 'N/A',
        floor: 'N/A',
        building: 'N/A',
        shipping_method: 'N/A',
      },
      currency: 'EGP',
      integration_id: parseInt(integrationId, 10),
    }),
  });

  if (!response.ok) {
    throw new Error(`Paymob payment key failed: ${response.status}`);
  }

  const data = await response.json();
  return data.token;
};

/**
 * Full Paymob checkout flow — returns the redirect URL for the hosted checkout.
 */
const initiatePaymobPayment = async (order, user) => {
  const iframeId = process.env.PAYMOB_IFRAME_ID;
  if (!iframeId) {
    throw new Error('PAYMOB_IFRAME_ID is not configured');
  }

  const authToken = await getAuthToken();
  const paymobOrderId = await createPaymobOrder(authToken, order);
  const paymentKey = await getPaymentKey(authToken, paymobOrderId, order, user);

  return {
    paymentUrl: `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`,
    paymobOrderId,
  };
};

/**
 * Verify the HMAC signature of a Paymob webhook/callback.
 * This is critical for payment security.
 *
 * The HMAC is calculated over specific fields in a specific order per Paymob docs.
 */
const verifyPaymobHMAC = (requestBody, receivedHmac) => {
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
  if (!hmacSecret) {
    console.error('PAYMOB_HMAC_SECRET is not configured');
    return false;
  }

  // Paymob HMAC fields in the required order
  const obj = requestBody.obj || requestBody;
  const hmacFields = [
    obj.amount_cents,
    obj.created_at,
    obj.currency,
    obj.error_occured,
    obj.has_parent_transaction,
    obj.id,
    obj.integration_id,
    obj.is_3d_secure,
    obj.is_auth,
    obj.is_capture,
    obj.is_refunded,
    obj.is_standalone_payment,
    obj.is_voided,
    obj.order?.id || obj.order,
    obj.owner,
    obj.pending,
    obj.source_data?.pan || '',
    obj.source_data?.sub_type || '',
    obj.source_data?.type || '',
    obj.success,
  ];

  const concatenated = hmacFields.map((f) => (f === undefined || f === null ? '' : String(f))).join('');

  const calculatedHmac = crypto
    .createHmac('sha512', hmacSecret)
    .update(concatenated)
    .digest('hex');

  return calculatedHmac === receivedHmac;
};

module.exports = {
  initiatePaymobPayment,
  verifyPaymobHMAC,
};
