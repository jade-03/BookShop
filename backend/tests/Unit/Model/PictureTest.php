<?php

namespace App\Tests\Unit\Model;

use App\Entity\Picture;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class PictureTest extends TestCase  
{
    #[Test]
    public function create_picture(): void 
    {
        // Variable
        $front = "imageFront.png";
        $back = "imageBack.png";

        $picture = new Picture;
        $picture->setFrontCover($front);
        $picture->setBackFront($back);

        $this->assertEquals($front, $picture->getFrontCover());
        $this->assertEquals($back, $picture->getBackFront());

    }
}