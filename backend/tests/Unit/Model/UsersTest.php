<?php

namespace App\Tests\Unit\Model;

use App\Entity\User;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class UsersTest extends TestCase
{
    #[Test]
    public function create_user(): void
    {
         // Arrange
        $lastname = 'Doe';
        $firtname = 'John';
        $pseudo = 'Johndoe';
        $email = 'johndoe@gmail.com';
        $password = 'motdepasse';
        // Act - avec setters si pas de constructeur
        $user = new User();
        $user->setLastname($lastname);
        $user->setFirstname($firtname);
        $user->setPseudo($pseudo);
        $user->setEmail($email);
        

        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $user->setPassword($hashedPassword);
        // Assert
        $this->assertEquals($lastname, $user->getLastname());
        $this->assertEquals($firtname, $user->getFirstname());
        $this->assertEquals($pseudo, $user->getPseudo());
        $this->assertEquals($email, $user->getEmail());
        
        $this->assertNotEquals($password, $user->getPassword());
        $this->assertTrue(password_verify($password, $user->getPassword()));
    }
}