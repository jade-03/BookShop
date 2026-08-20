<?php

namespace App\Tests\Unit\Model;

use App\Entity\Announcement;
use App\Enum\BookCondition;
use App\Enum\Statut;
use DateTimeImmutable;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Validator\Constraints\Date;

class AnnouncementTest extends TestCase
{
    #[Test]
    public function create_annonce(): void
    {
        // Arrange
        $title = "Livre Harry potter";
        $condition = BookCondition::Unused;
        $language = "Français";
        $price = 30.0;
        $statut = Statut::For_Sale;
        $date = new DateTimeImmutable();


        // Act - avec setters si pas de constructeur
        $annonce = new Announcement();
        $annonce->setTitle($title);
        $annonce->setBookCondition($condition);
        $annonce->setLanguage($language);
        $annonce->setPrice($price);
        $annonce->setStatut($statut);
        $annonce->setPublicationDate($date);


        // Assert
        $this->assertEquals($title, $annonce->getTitle());
        $this->assertEquals($condition, $annonce->getBookCondition());
        $this->assertEquals($language, $annonce->getLanguage());
        $this->assertEquals($price, $annonce->getPrice());
        $this->assertEquals($statut, $annonce->getStatut());
        $this->assertEquals($date, $annonce->getPublicationDate());
    }
}
