<?php

namespace App\Enum;

enum PayementMethod: string
{
    case Card = 'card';
    case PayPal = 'paypal';
    case ApplePay = 'apple_pay';

    public function getLabel():string
    {
        return match ($this) {
           self::Card => 'Carte bancaire',
           self::PayPal => 'Paypal',
           self::ApplePay => 'Apple Pay', 
        };
        

    }
}