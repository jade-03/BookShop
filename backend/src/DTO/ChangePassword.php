<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class ChangePassword
{
    #[Assert\NotBlank(message: "L'ancien mot de passe est obligatoire")]
    public string $oldPassword;
    
    #[Assert\NotBlank(message: "Le nouveau mot de passe est obligatoire")]
    #[Assert\Length(
        min: 6,
        minMessage: "Le mot de passe doit contenir au moins {{ limit }} caractères"
    )]
    #[Assert\Regex(
        pattern: "/^(?=.*[A-Za-z])(?=.*\d)/",
        message: "Le mot de passe doit contenir au moins une lettre et un chiffre"
    )]
    public string $newPassword;
    
}