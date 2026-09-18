<?php

namespace App\Controller;

use App\Entity\Favorite;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

final class FavoriteController extends AbstractController
{
    #[Route('/favorite', name: 'app_favorite')]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/FavoriteController.php',
        ]);
    }

    // #[Route('/favorite/add', name: 'api_add_favorite')]
    // public function addFavorite(Request $request, SerializerInterface $serializer, EntityManagerInterface $em){
    //     $favori = $serializer->deserialize($request->getContent(), Favorite::class, 'json');

    //     $favori->getDateAdd(DateT)
    // }
}
