<?php

namespace App\DataFixtures;

use App\Entity\Category;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public const CATEGORIES = [
        'Roman', 'Science-Fiction', 'Fantasy', 'Policier' ,'Thriller',
        'Romance', 'Horreur', 'Aventure', 'Historique', 'Classique',
        'Poésie', 'Théâtre', 'Biographie', 'Essai', 'Développement personnel',
        'BD', 'Manga', 'Jeunesse', 'Scolaire', 'Sciences',
        'Informatique', 'Cuisine', 'Voyage', 'Art', 'Religion', 'Droit / Économie',
    ];
    
    public function load(ObjectManager $manager): void
    {
        foreach (self::CATEGORIES as $index => $name) {
            $category = new Category();
            $category->setName($name);

            $manager->persist($category);

            // Référence réutilisable dans les autres fixtures
            $this->addReference('category_' . $index, $category);
        }

        $manager->flush();
    }
}
