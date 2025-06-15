<?php

namespace App\Helpers;

class Helper
{
    public static function extractNamesFromEmail(string $email): array
    {
        $username = explode('@', $email)[0];
        $username = str_replace(['_', '-'], '.', $username);
        $parts = explode('.', $username);

        $firstName = ucfirst(preg_replace('/[^a-zA-Z]/', '', $parts[0] ?? 'User'));
        $lastName  = ucfirst(preg_replace('/[^a-zA-Z0-9]/', '', $parts[1] ?? 'User'));

        return [
            'first_name' => $firstName,
            'last_name'  => $lastName,
        ];
    }

  }
