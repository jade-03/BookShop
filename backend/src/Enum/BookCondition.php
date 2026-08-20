<?php

namespace App\Enum;

enum BookCondition: string
{
    case Unused = 'unused';
    case Very_Good = 'very_good';
    case Good = 'good';
    
    public function getLabel(): string
    {
        return match ($this) {
            self::Unused => 'Neuf',
            self::Very_Good => 'Très bon état',
            self::Good => 'Bon état',
        };
    }
}