const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: parseInt(process.env.SMTP_PORT, 10) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"vybe" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Email sending failed: ${error.message}`);
    // Don't throw — email failure shouldn't break the request
  }
};

const emailWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>vybe</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background-color:#014421;border-radius:16px 16px 0 0;padding:28px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;">vybe</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:0.12em;text-transform:uppercase;">Luxury Fragrances</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px;border-radius:0 0 0 0;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9f6f1;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #e8e3da;">
              <p style="margin:0 0 6px;color:#6b7280;font-size:12px;">© ${new Date().getFullYear()} vybe. All rights reserved.</p>
              <p style="margin:0;color:#9ca3af;font-size:11px;">You received this email because you placed an order or created an account with us.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const statusBadge = (status) => {
  const colors = {
    pending: { bg: '#fef3c7', color: '#92400e' },
    processing: { bg: '#dbeafe', color: '#1e40af' },
    shipped: { bg: '#d1fae5', color: '#065f46' },
    delivered: { bg: '#d1fae5', color: '#014421' },
    cancelled: { bg: '#fee2e2', color: '#991b1b' },
  };
  const style = colors[status] || { bg: '#f3f4f6', color: '#374151' };
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : '';
  return `<span style="display:inline-block;background-color:${style.bg};color:${style.color};padding:4px 14px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">${label}</span>`;
};

const formatOrderItems = (items) => {
  const rows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:12px 8px;border-bottom:1px solid #f0ede6;color:#142016;font-size:14px;">
            ${item.name}${item.size ? `<br/><span style="color:#9ca3af;font-size:12px;">Size: ${item.size}</span>` : ''}
          </td>
          <td style="padding:12px 8px;border-bottom:1px solid #f0ede6;text-align:center;color:#374151;font-size:14px;">${item.quantity}</td>
          <td style="padding:12px 8px;border-bottom:1px solid #f0ede6;text-align:right;color:#014421;font-weight:700;font-size:14px;">EGP ${item.price.toFixed(2)}</td>
        </tr>`
    )
    .join('');
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:16px;">
      <thead>
        <tr style="background-color:#f9f6f1;">
          <th style="padding:10px 8px;text-align:left;color:#6b7280;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;border-bottom:2px solid #e8e3da;">Product</th>
          <th style="padding:10px 8px;text-align:center;color:#6b7280;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;border-bottom:2px solid #e8e3da;">Qty</th>
          <th style="padding:10px 8px;text-align:right;color:#6b7280;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;border-bottom:2px solid #e8e3da;">Price</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
};

const sendOrderConfirmation = async (order, user) => {
  const subject = `Order Confirmed — #${order._id.toString().slice(-8).toUpperCase()}`;
  const content = `
    <h2 style="margin:0 0 8px;color:#014421;font-size:22px;font-weight:700;">Thank you for your order!</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Hi <strong style="color:#142016;">${user.name}</strong>, your order has been placed successfully.</p>

    <div style="background-color:#f9f6f1;border-radius:12px;padding:20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="color:#6b7280;font-size:13px;padding-bottom:6px;">Order ID</td>
          <td style="text-align:right;font-weight:700;color:#142016;font-size:13px;padding-bottom:6px;">#${order._id.toString().slice(-8).toUpperCase()}</td>
        </tr>
        <tr>
          <td style="color:#6b7280;font-size:13px;padding-bottom:6px;">Payment Method</td>
          <td style="text-align:right;font-weight:600;color:#142016;font-size:13px;padding-bottom:6px;">${order.paymentMethod === 'instapay' ? 'InstaPay' : order.paymentMethod === 'paymob' ? 'Card (Paymob)' : order.paymentMethod}</td>
        </tr>
        <tr>
          <td style="color:#6b7280;font-size:13px;">Status</td>
          <td style="text-align:right;font-size:13px;">${statusBadge(order.status)}</td>
        </tr>
      </table>
    </div>

    ${formatOrderItems(order.items)}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border-top:2px solid #e8e3da;padding-top:16px;">
      <tr>
        <td style="font-size:16px;font-weight:700;color:#142016;">Total</td>
        <td style="text-align:right;font-size:20px;font-weight:800;color:#014421;">EGP ${order.totalPrice.toFixed(2)}</td>
      </tr>
    </table>

    ${order.paymentMethod === 'instapay' ? `
    <div style="margin-top:24px;background-color:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:16px;">
      <p style="margin:0;color:#92400e;font-size:14px;">⏳ <strong>InstaPay Payment Pending</strong><br/>Your payment is awaiting admin verification. You will receive a confirmation email once it is approved.</p>
    </div>` : ''}
  `;
  return sendEmail(order.email || user.email, subject, emailWrapper(content));
};

const sendInstapayApproval = async (order, user) => {
  const subject = `Payment Approved — Order #${order._id.toString().slice(-8).toUpperCase()}`;
  const content = `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;background-color:#d1fae5;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:32px;margin-bottom:12px;">✅</div>
      <h2 style="margin:0 0 8px;color:#014421;font-size:22px;font-weight:700;">Payment Approved!</h2>
      <p style="margin:0;color:#6b7280;font-size:15px;">Your InstaPay payment has been verified.</p>
    </div>

    <p style="color:#374151;font-size:15px;">Hi <strong>${user.name}</strong>,</p>
    <p style="color:#374151;font-size:15px;margin-bottom:24px;">Your InstaPay payment for order <strong style="color:#014421;">#${order._id.toString().slice(-8).toUpperCase()}</strong> has been approved. Your order is now being processed and will be shipped soon.</p>

    <div style="background-color:#f9f6f1;border-radius:12px;padding:20px;text-align:center;">
      <p style="margin:0 0 4px;color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;">Order Total</p>
      <p style="margin:0;color:#014421;font-size:28px;font-weight:800;">EGP ${order.totalPrice.toFixed(2)}</p>
    </div>
  `;
  return sendEmail(order.email || user.email, subject, emailWrapper(content));
};

const sendStatusUpdate = async (order, user) => {
  const statusMessages = {
    processing: { icon: '⚙️', title: 'Order Processing', msg: 'Your order is now being processed by our team.' },
    shipped: { icon: '🚚', title: 'Order Shipped!', msg: 'Great news — your order is on its way to you!' },
    delivered: { icon: '🎉', title: 'Order Delivered!', msg: 'Your order has been delivered. We hope you love it!' },
    cancelled: { icon: '❌', title: 'Order Cancelled', msg: 'Your order has been cancelled.' },
  };
  const info = statusMessages[order.status] || { icon: '📦', title: 'Order Update', msg: `Your order status has been updated to: ${order.status}` };
  const subject = `Order Update — #${order._id.toString().slice(-8).toUpperCase()}`;
  const content = `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:40px;margin-bottom:12px;">${info.icon}</div>
      <h2 style="margin:0 0 8px;color:#142016;font-size:22px;font-weight:700;">${info.title}</h2>
      <p style="margin:0;color:#6b7280;font-size:15px;">${info.msg}</p>
    </div>

    <p style="color:#374151;font-size:15px;">Hi <strong>${user.name}</strong>,</p>

    <div style="background-color:#f9f6f1;border-radius:12px;padding:20px;margin-top:16px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="color:#6b7280;font-size:13px;padding-bottom:8px;">Order ID</td>
          <td style="text-align:right;font-weight:700;color:#142016;font-size:13px;padding-bottom:8px;">#${order._id.toString().slice(-8).toUpperCase()}</td>
        </tr>
        <tr>
          <td style="color:#6b7280;font-size:13px;">Current Status</td>
          <td style="text-align:right;font-size:13px;">${statusBadge(order.status)}</td>
        </tr>
      </table>
    </div>
  `;
  return sendEmail(order.email || user.email, subject, emailWrapper(content));
};

const sendInstapayRejection = async (order, user) => {
  const subject = `Payment Rejected — Order #${order._id.toString().slice(-8).toUpperCase()}`;
  const content = `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:40px;margin-bottom:12px;">❌</div>
      <h2 style="margin:0 0 8px;color:#991b1b;font-size:22px;font-weight:700;">Payment Rejected</h2>
      <p style="margin:0;color:#6b7280;font-size:15px;">Unfortunately, we could not verify your InstaPay payment.</p>
    </div>

    <p style="color:#374151;font-size:15px;">Hi <strong>${user.name}</strong>,</p>
    <p style="color:#374151;font-size:15px;margin-bottom:${order.rejectionReason ? '0' : '24px'};">Your InstaPay payment for order <strong style="color:#991b1b;">#${order._id.toString().slice(-8).toUpperCase()}</strong> has been rejected.</p>

    ${order.rejectionReason ? `
    <div style="margin:16px 0 24px;background-color:#fee2e2;border:1px solid #fca5a5;border-radius:10px;padding:14px 16px;">
      <p style="margin:0;color:#991b1b;font-size:14px;"><strong>Reason:</strong> ${order.rejectionReason}</p>
    </div>` : ''}

    <div style="background-color:#f9f6f1;border-radius:12px;padding:20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="color:#6b7280;font-size:13px;">Order Total</td>
          <td style="text-align:right;font-weight:800;color:#142016;font-size:16px;">EGP ${order.totalPrice.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <p style="margin-top:24px;color:#6b7280;font-size:14px;">Please contact our support team for assistance or try placing a new order.</p>
  `;
  return sendEmail(order.email || user.email, subject, emailWrapper(content));
};

const sendPaymobPaymentConfirmation = async (order, user) => {
  const subject = `Payment Confirmed — Order #${order._id.toString().slice(-8).toUpperCase()}`;
  const content = `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;background-color:#d1fae5;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:32px;margin-bottom:12px;">✅</div>
      <h2 style="margin:0 0 8px;color:#014421;font-size:22px;font-weight:700;">Payment Successful!</h2>
      <p style="margin:0;color:#6b7280;font-size:15px;">Your card payment via Paymob has been confirmed.</p>
    </div>

    <p style="color:#374151;font-size:15px;">Hi <strong>${user.name}</strong>,</p>
    <p style="color:#374151;font-size:15px;margin-bottom:24px;">Your payment for order <strong style="color:#014421;">#${order._id.toString().slice(-8).toUpperCase()}</strong> has been successfully processed. Your order is now being prepared for shipment.</p>

    ${formatOrderItems(order.items)}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border-top:2px solid #e8e3da;padding-top:16px;">
      <tr>
        <td style="font-size:16px;font-weight:700;color:#142016;">Total Charged</td>
        <td style="text-align:right;font-size:20px;font-weight:800;color:#014421;">EGP ${order.totalPrice.toFixed(2)}</td>
      </tr>
    </table>
  `;
  return sendEmail(order.email || user.email, subject, emailWrapper(content));
};

const sendAdminNotification = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const subject = `New Order — #${order._id.toString().slice(-8).toUpperCase()}`;
  const content = `
    <h2 style="margin:0 0 8px;color:#014421;font-size:22px;font-weight:700;">New Order Received</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">A new order has been placed on the store.</p>

    <div style="background-color:#f9f6f1;border-radius:12px;padding:20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="color:#6b7280;font-size:13px;padding-bottom:8px;">Order ID</td>
          <td style="text-align:right;font-weight:700;color:#142016;font-size:13px;padding-bottom:8px;">#${order._id.toString().slice(-8).toUpperCase()}</td>
        </tr>
        <tr>
          <td style="color:#6b7280;font-size:13px;padding-bottom:8px;">Customer Email</td>
          <td style="text-align:right;font-weight:600;color:#142016;font-size:13px;padding-bottom:8px;">${order.email}</td>
        </tr>
        <tr>
          <td style="color:#6b7280;font-size:13px;padding-bottom:8px;">Payment Method</td>
          <td style="text-align:right;font-weight:600;color:#142016;font-size:13px;padding-bottom:8px;">${order.paymentMethod === 'instapay' ? 'InstaPay' : order.paymentMethod === 'paymob' ? 'Card (Paymob)' : order.paymentMethod}</td>
        </tr>
        <tr>
          <td style="color:#6b7280;font-size:13px;padding-bottom:8px;">Items</td>
          <td style="text-align:right;font-weight:600;color:#142016;font-size:13px;padding-bottom:8px;">${order.items.length} product(s)</td>
        </tr>
        <tr>
          <td style="color:#6b7280;font-size:13px;">Total</td>
          <td style="text-align:right;font-weight:800;color:#014421;font-size:16px;">EGP ${order.totalPrice.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    ${order.paymentMethod === 'instapay' ? `
    <div style="background-color:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:16px;">
      <p style="margin:0;color:#92400e;font-size:14px;font-weight:700;">⚠ InstaPay — Requires Manual Approval</p>
      <p style="margin:6px 0 0;color:#92400e;font-size:13px;">Please review the payment proof in the admin panel and approve or reject the order.</p>
    </div>` : ''}
  `;
  return sendEmail(adminEmail, subject, emailWrapper(content));
};

const sendLoginWelcome = async (user) => {
  if (!user?.email) return;
  const subject = `Welcome back, ${user.name || 'there'}!`;
  const content = `
    <h2 style="margin:0 0 8px;color:#014421;font-size:22px;font-weight:700;">Welcome back!</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Hi <strong style="color:#142016;">${user.name || 'there'}</strong>, you have successfully logged in to your account.</p>

    <div style="background-color:#fef3c7;border:1px solid #fcd34d;border-radius:10px;padding:16px;">
      <p style="margin:0;color:#92400e;font-size:14px;">🔐 <strong>Security Notice:</strong> If this was not you, please reset your password immediately and contact our support team.</p>
    </div>
  `;
  return sendEmail(user.email, subject, emailWrapper(content));
};

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendInstapayApproval,
  sendInstapayRejection,
  sendPaymobPaymentConfirmation,
  sendStatusUpdate,
  sendAdminNotification,
  sendLoginWelcome,
};
