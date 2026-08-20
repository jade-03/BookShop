<?php

namespace App\Enum;

enum Statut: string
{
    case For_Sale = 'for_sale';
    case Sold = 'sold';

    public function getLabel(): string
    {
        return match ($this) {
            self::For_Sale => 'A Vendre',
            self::Sold => 'Vendu',
        };
    }
}