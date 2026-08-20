<?php

namespace App\Tests\Unit\Model;

use App\Entity\Category;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class CategoryTest extends TestCase
{
    #[Test]
    public function create_category(): void
    {
          // Arrange
        $name = 'Jeunesse';
        
        // Act - avec setters si pas de constructeur
        $category = new Category();
        $category->setName($name);
        
        // Assert
        $this->assertEquals($name, $category->getName());
    }
}