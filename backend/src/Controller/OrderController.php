<?php

namespace App\Controller;

use App\Entity\Order;
use App\Entity\User;
use App\Repository\OrderRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api')]
final class OrderController extends AbstractController
{
    #[Route('/user/{id}/orders', name: 'api_order', methods: ['GET'])]
    public function ordersAll( OrderRepository $repository, SerializerInterface $serialize): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json([
                'code' => 401,
                'message' => 'User not authenticated'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $orders = $repository->findAll();

        $jsonResponse = $serialize->serialize($orders, 'json');

        return new JsonResponse($jsonResponse, Response::HTTP_OK, [], true);
    }


    #[Route('/user/{id}/new/orders', name: 'api_new_order', methods: ['POST'])]
    public function createOrder(#[CurrentUser] ?User $user, Request $request, SerializerInterface $serialize, EntityManagerInterface $em): JsonResponse
    {
        if (!$user) {
            return $this->json([
                'code' => 401,
                'message' => 'User not authenticated'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $newOrder = $serialize->deserialize($request->getContent(), Order::class, 'json');

        $newOrder->setOrderDate(new DateTimeImmutable());

        $em->persist($newOrder);
        $em->flush();

        $jsonOrder = $serialize->serialize($newOrder, 'json');

        return new JsonResponse($jsonOrder, Response::HTTP_CREATED, [], true);
    }

}
