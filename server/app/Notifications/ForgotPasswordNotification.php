<?php
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ForgotPasswordNotification extends Notification
{
    public $token;
    public $email;

    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $url = config('app.frontend_url') . "/reset-password?token={$this->token}&email=" . urlencode($this->email);

        return (new MailMessage)
            ->subject('Reset Your Password - Everyday CRM')
            ->greeting("Hi,")
            ->line("You requested a password reset.")
            ->action('Reset Password', $url)
            ->line("This link will expire in 60 minutes.")
            ->line("If you didn’t request this, please ignore the email.");
    }
}
