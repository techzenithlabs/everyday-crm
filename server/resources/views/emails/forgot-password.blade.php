<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Reset Password - Everyday CRM</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f8fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 30px 10px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 40px;">
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <img src="{{ asset('logo.png') }}" alt="Everyday CRM Logo" height="40">
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 18px; font-weight: bold; color: #333; padding-bottom: 12px;">
                            Reset your password
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 15px; color: #555555; line-height: 1.5; padding-bottom: 24px;">
                            We received a request to reset your password for your <strong>Everyday CRM</strong> account.
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <a href="{{ $url }}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">
                                Reset Password
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 13px; color: #777777; line-height: 1.6; padding-top: 24px;">
                            If the button doesn’t work, copy and paste the link below into your browser:
                            <br>
                            <a href="{{ $url }}" style="color: #3b82f6; word-break: break-all;">{{ $url }}</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 13px; color: #999999; padding-top: 20px;">
                            This link will expire in <strong>{{ $expire }}</strong>.
                        </td>
                    </tr>
                    <tr>
                        <td style="border-top: 1px solid #eaeaea; padding-top: 20px; font-size: 12px; color: #aaa; text-align: center;">
                            If you didn't request a password reset, you can ignore this email.<br>
                            Need help? <a href="mailto:support@everydaycrm.com" style="color: #3b82f6;">Contact support</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
