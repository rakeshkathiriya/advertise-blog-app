export const resetPasswordTemplate = (resetURL: string) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f4f7f6; padding:40px 0;">
    <div style="
      max-width:600px;
      margin:auto;
      background:#ffffff;
      border-radius:14px;
      padding:40px 35px;
      border:1px solid #e2e8e6;
      box-shadow:0 6px 24px rgba(0,0,0,0.08);
    ">

      <!-- HEADER -->
      <div style="text-align:center; margin-bottom:25px;">
        <h2 style="
          margin:0;
          font-size:24px;
          font-weight:700;
          color:#044241;
        ">
          Reset Your Password
        </h2>
      </div>

      <!-- MESSAGE -->
      <p style="font-size:15px; color:#444; line-height:1.7;">
        We received a request to reset your password. Click the button below to continue.
        If you didn’t request this, you may safely ignore this email.
      </p>

      <!-- BUTTON -->
      <div style="text-align:center; margin:35px 0;">
        <a href="${resetURL}" 
          style="
            background: #2D6F6D;
            color:#ffffff;
            padding:14px 28px;
            border-radius:8px;
            text-decoration:none;
            font-size:16px;
            font-weight:600;
            display:inline-block;
            letter-spacing:0.3px;
            box-shadow:0 3px 10px rgba(0,0,0,0.15);
          ">
          Reset Password
        </a>
      </div>

      <!-- EXPIRY -->
      <p style="font-size:14px; color:#555; line-height:1.6;">
        For security purposes, this link will expire in <strong>5 minutes</strong>.
      </p>

      <p style="font-size:13px; color:#888; margin-top:25px;">
        If the button above doesn’t work, copy and paste this link into your browser:
      </p>

      <p style="
        font-size:13px;
        color:#2D6F6D;
        word-break:break-all;
        margin-top:8px;
      ">
        ${resetURL}
      </p>

      <hr style="margin:35px 0; border:none; border-top:1px solid #e5ecea;">

      <!-- FOOTER -->
      <p style="text-align:center; font-size:12px; color:#999;">
        © ${new Date().getFullYear()} Food N Processing • All Rights Reserved
      </p>

    </div>
  </div>
`;
