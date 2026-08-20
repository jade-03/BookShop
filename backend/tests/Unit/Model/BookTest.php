<?php

namespace App\Tests\Unit\Model;

use App\Entity\Book;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class BookTest extends TestCase
{
    #[Test]
    public function create_book(): void
    {
         // Arrange
        $title = 'Harry Potter';
        $isbn = '1234567897894';
        
        // Act - avec setters si pas de constructeur
        $book = new Book();
        $book->setTitle($title);
        $book->setIsbn($isbn);
        
        // Assert
        $this->assertEquals($title, $book->getTitle());
        $this->assertEquals($isbn, $book->getIsbn());
    
    }
}