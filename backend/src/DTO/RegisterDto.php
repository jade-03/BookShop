<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class RegisterDto
{
    #[Assert\NotBlank]
    public string $lastname;

    #[Assert\NotBlank]
    public string $firstname;

    #[Assert\NotBlank()]
    public string $pseudo;

    public ?string $profil_picture = null;

    #[Assert\NotBlank]
    #[Assert\Email]
    public string $email;

    #[Assert\NotBlank]
    #[Assert\Length(
        min: 6,
        minMessage: "Le mot de passe doit contenir au moins {{ limit }} caractères"
    )]
    #[Assert\Regex(
        pattern: "/^(?=.*[A-Za-z])(?=.*\d)/",
        message: "Le mot de passe doit contenir au moins une lettre et un chiffre"
    )]
    public string $password;
    

}
