<?php
namespace App\Helpers;

use Illuminate\Support\Facades\Mail;

class EmailHelper
{
    /**
     * Send a general email with view and dynamic data.
     *
     * @param string $to
     * @param string $subject
     * @param string $viewPath Blade view path (e.g., emails.welcome)
     * @param array $data
     * @return bool
     */
    public static function send(string $to, string $subject, string $viewPath, array $data): bool
    {
        try {
            Mail::send($viewPath, $data, function ($message) use ($to, $subject) {
                $message->to($to)
                        ->subject($subject);
            });

            return true;
        } catch (\Exception $e) {
            logger()->error("Email sending failed: " . $e->getMessage());
            return false;
        }
    }
}
