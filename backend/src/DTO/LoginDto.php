<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class LoginDto
{
    #[Assert\NotBlank]
    #[Assert\Email]
    public string $username;

    #[Assert\NotBlank]
    public string $password;
    

}