<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invitation to Register</title>
</head>
<body style="font-family: sans-serif; background: #f9f9f9; padding: 2rem;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px;">
        <h2 style="color: #2563eb;">You're Invited to Everyday CRM</h2>
        <p>Hi {{ $name }},</p>
        <p>You’ve been invited to join <strong>Everyday CRM</strong>.</p>
        <p>Please click the button below to complete your registration. This link will expire in 2 days.</p>

        <a href="{{ $register_url }}"
           style="display: inline-block; margin: 20px 0; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px;">
            Complete Registration
        </a>

        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="font-size: 12px; color: #555;">{{ $register_url }}</p>

        <hr style="margin-top: 30px;">
        <p style="font-size: 12px; color: #999;">Everyday CRM | This is an automated email</p>
    </div>
</body>
</html>
