<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\User;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api')]
final class CategoryController extends AbstractController
{
    private SerializerInterface $serializer;

    public function __construct(SerializerInterface $serializer)
    {
        $this->serializer = $serializer;
    }

    #[Route('/categories', name: 'api_categories', methods: ['GET'])]
    public function categories(CategoryRepository $repository): JsonResponse
    {
        $categories = $repository->findAll();
        $jsonCategory = $this->serializer->serialize($categories, 'json', ['groups' =>  'getCategory']);
        return new JsonResponse($jsonCategory,  200, [], true);
    }


    #[Route('/category/{id}', name: 'api_category', methods: ['GET'])]
    public function category(Category $category): JsonResponse
    {
         $user = $this->getUser(); 

        if (!$user) {
            return $this->json([
                'code' => 401,
                'message' => 'User not authenticated'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $jsonCategory = $this->serializer->serialize($category, 'json', ['groups' =>  'getCategory']);

        return new JsonResponse($jsonCategory,  200, [], true);
    }


    #[Route('/new/category', name: 'api_new_category', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function newCategory(
        #[CurrentUser] User $user,
        Request $request,
        EntityManagerInterface $em,
        ValidatorInterface $validator
    ): JsonResponse {
        if (!$user) {
            return $this->json([
                'code' => 401,
                'message' => 'User not authenticated'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $newCategory = $this->serializer->deserialize($request->getContent(), Category::class, 'json');


        $error = $validator->validate($newCategory);

        if (count($error) > 0) {
            return $this->json($error, 400);
        }

        $em->persist($newCategory);
        $em->flush();

        $jsonCategory = $this->serializer->serialize($newCategory, 'json');

        return new JsonResponse($jsonCategory,  Response::HTTP_CREATED, [], true);
    }


    #[Route('/update/category/{id}', name: 'api_update_category', methods: ['PUT'])]
    public function putCategory(
        #[CurrentUser] User $user,
        Request $request,
        Category $currentCategory,
        EntityManagerInterface $em,
        ValidatorInterface $validator
    ): JsonResponse {
        if (!$user) {
            return $this->json([
                'code' => 401,
                'message' => 'User not authenticated'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $updateCategory = $this->serializer->deserialize($request->getContent(), Category::class, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $currentCategory]);


        $error = $validator->validate($updateCategory);

        if (count($error) > 0) {
            return $this->json($error, 400);
        }

        $em->persist($updateCategory);
        $em->flush();

        $jsonCategory = $this->serializer->serialize($updateCategory, 'json');

        return new JsonResponse($jsonCategory, Response::HTTP_OK);
    }

    #[Route('/delete/category/{id}', name: 'ap_del_category', methods: ['DELETE'])]
    public function delCategory(Category $category, EntityManagerInterface $em)
    {
        $em->remove($category);
        $em->flush();

        return new JsonResponse(null,  204);
    }
}
