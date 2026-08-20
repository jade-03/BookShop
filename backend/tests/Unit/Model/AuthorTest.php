<?php

namespace App\Tests\Unit\Model;

use App\Entity\Author;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class AuthorTest extends TestCase
{
    #[Test]
    public function create_author(): void
    {
         // Arrange
        $name = 'J. K. Rowling';
        
        // Act - avec setters si pas de constructeur
        $author = new Author();
        $author->setName($name);
        
        // Assert
        $this->assertEquals($name, $author->getName());
    }
}