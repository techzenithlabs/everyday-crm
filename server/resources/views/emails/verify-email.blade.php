<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
</head>
<body style="font-family: sans-serif; background: #f9f9f9; padding: 2rem;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px;">
    <h2 style="color: #2563eb;">Verify Your Email</h2>
    <p>Hi {{ $name }},</p>
    <p>Thanks for registering on <strong>Everyday CRM</strong>.</p>
    <p>Click the button below to verify your email address:</p>

    <a href="{{ $url }}"
       style="display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px;">
      Verify Email
    </a>

    <p>If the button doesn’t work, copy and paste this link:</p>
    <p style="font-size: 12px; color: #555;">{{ $url }}</p>

    <hr style="margin-top: 30px;">
    <p style="font-size: 12px; color: #999;">Everyday CRM | This is an automated email</p>
  </div>
</body>
</html>
