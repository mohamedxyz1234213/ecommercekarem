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
      from: `"Perfume Store" <${process.env.SMTP_USER}>`,
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

const formatOrderItems = (items) => {
  return items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">EGP ${item.price.toFixed(2)}</td>
        </tr>`
    )
    .join('');
};

const sendOrderConfirmation = async (order, user) => {
  const subject = `Order Confirmation #${order._id.toString().slice(-8).toUpperCase()}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#333;">Thank you for your order, ${user.name}!</h2>
      <p>Your order has been placed successfully.</p>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f5f5f5;">
            <th style="padding:8px;text-align:left;">Product</th>
            <th style="padding:8px;text-align:center;">Qty</th>
            <th style="padding:8px;text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>${formatOrderItems(order.items)}</tbody>
      </table>
      <p style="font-size:18px;font-weight:bold;text-align:right;margin-top:16px;">
        Total: EGP ${order.totalPrice.toFixed(2)}
      </p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      ${order.paymentMethod === 'instapay' ? '<p style="color:#e67e22;">Your InstaPay payment is pending admin approval.</p>' : ''}
      <hr style="margin:24px 0;" />
      <p style="color:#999;font-size:12px;">Perfume Store — Thank you for shopping with us!</p>
    </div>
  `;
  return sendEmail(order.email || user.email, subject, html);
};

const sendInstapayApproval = async (order, user) => {
  const subject = `Payment Approved — Order #${order._id.toString().slice(-8).toUpperCase()}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#27ae60;">Payment Approved!</h2>
      <p>Hi ${user.name},</p>
      <p>Your InstaPay payment for order <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong> has been approved.</p>
      <p>Your order is now being processed and will be shipped soon.</p>
      <p style="font-size:18px;font-weight:bold;">Total: EGP ${order.totalPrice.toFixed(2)}</p>
      <hr style="margin:24px 0;" />
      <p style="color:#999;font-size:12px;">Perfume Store — Thank you for shopping with us!</p>
    </div>
  `;
  return sendEmail(order.email || user.email, subject, html);
};

const sendStatusUpdate = async (order, user) => {
  const statusMessages = {
    processing: 'Your order is now being processed.',
    shipped: 'Your order has been shipped! It is on its way to you.',
    delivered: 'Your order has been delivered. Enjoy!',
    cancelled: 'Your order has been cancelled.',
  };
  const subject = `Order Update — #${order._id.toString().slice(-8).toUpperCase()}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#333;">Order Status Update</h2>
      <p>Hi ${user.name},</p>
      <p>${statusMessages[order.status] || `Your order status has been updated to: ${order.status}`}</p>
      <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
      <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
      <hr style="margin:24px 0;" />
      <p style="color:#999;font-size:12px;">Perfume Store — Thank you for shopping with us!</p>
    </div>
  `;
  return sendEmail(order.email || user.email, subject, html);
};

const sendInstapayRejection = async (order, user) => {
  const subject = `Payment Rejected — Order #${order._id.toString().slice(-8).toUpperCase()}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#e74c3c;">Payment Rejected</h2>
      <p>Hi ${user.name},</p>
      <p>Unfortunately, your InstaPay payment for order <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong> has been rejected.</p>
      ${order.rejectionReason ? `<p><strong>Reason:</strong> ${order.rejectionReason}</p>` : ''}
      <p>Please contact our support team for assistance or try placing a new order.</p>
      <p style="font-size:18px;font-weight:bold;">Total: EGP ${order.totalPrice.toFixed(2)}</p>
      <hr style="margin:24px 0;" />
      <p style="color:#999;font-size:12px;">Perfume Store — Thank you for shopping with us!</p>
    </div>
  `;
  return sendEmail(order.email || user.email, subject, html);
};

const sendPaymobPaymentConfirmation = async (order, user) => {
  const subject = `Payment Confirmed — Order #${order._id.toString().slice(-8).toUpperCase()}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#27ae60;">Payment Successful!</h2>
      <p>Hi ${user.name},</p>
      <p>Your payment for order <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong> has been successfully processed via Paymob.</p>
      <p>Your order is now being processed and will be shipped soon.</p>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f5f5f5;">
            <th style="padding:8px;text-align:left;">Product</th>
            <th style="padding:8px;text-align:center;">Qty</th>
            <th style="padding:8px;text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>${formatOrderItems(order.items)}</tbody>
      </table>
      <p style="font-size:18px;font-weight:bold;text-align:right;margin-top:16px;">
        Total: EGP ${order.totalPrice.toFixed(2)}
      </p>
      <hr style="margin:24px 0;" />
      <p style="color:#999;font-size:12px;">Perfume Store — Thank you for shopping with us!</p>
    </div>
  `;
  return sendEmail(order.email || user.email, subject, html);
};

const sendAdminNotification = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const subject = `New Order Received — #${order._id.toString().slice(-8).toUpperCase()}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#333;">New Order Received</h2>
      <p>A new order has been placed.</p>
      <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
      <p><strong>Customer Email:</strong> ${order.email}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <p><strong>Total:</strong> EGP ${order.totalPrice.toFixed(2)}</p>
      <p><strong>Items:</strong> ${order.items.length} product(s)</p>
      ${order.paymentMethod === 'instapay' ? '<p style="color:#e67e22;font-weight:bold;">⚠ InstaPay payment — requires manual approval.</p>' : ''}
      <hr style="margin:24px 0;" />
      <p style="color:#999;font-size:12px;">Perfume Store Admin Panel</p>
    </div>
  `;
  return sendEmail(adminEmail, subject, html);
};

const sendLoginWelcome = async (user) => {
  if (!user?.email) return;
  const subject = `Welcome back, ${user.name || 'there'}!`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#333;">Welcome back!</h2>
      <p>Hi ${user.name || 'there'},</p>
      <p>You have successfully logged in to your account.</p>
      <p>If this was not you, please reset your password immediately and contact support.</p>
      <hr style="margin:24px 0;" />
      <p style="color:#999;font-size:12px;">vybe — account security notification</p>
    </div>
  `;
  return sendEmail(user.email, subject, html);
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
