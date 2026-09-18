<?php

namespace App\Controller;

use App\DTO\SendMessage;
use App\Entity\Message;
use App\Repository\ListingRepository;
use App\Repository\MessageRepository;
use App\Repository\UserRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;


#[Route('/api')]
final class MessageController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator,
    ) {}

    /**
     * Liste toutes les conversations de l'utilisateur connecté.
     * Une "conversation" = un regroupement (autreUser + livre).
     */
    #[Route('/conversations/me', name: 'api_my_conversations', methods: ['GET'])]
    public function myConversations(MessageRepository $repository): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $conversations = $repository->findConversationsByUser($user);

        $json = $this->serializer->serialize($conversations, 'json', ['groups' => 'getConversations']);
        return new JsonResponse($json, Response::HTTP_OK, [], true);
    }

    /**
     * GET  : tous les messages échangés avec {userId} à propos du livre {listingId}.
     * POST : envoie un message à {userId} à propos du livre {listingId}.
     */
    #[Route('/conversation/{userId}/{listingId}', name: 'api_conversation', methods: ['GET', 'POST'])]
    public function conversation(
        int $userId,
        int $listingId,
        Request $request,
        MessageRepository $repository,
        UserRepository $userRepository,
        ListingRepository $listingRepository,
    ): JsonResponse {
        $me = $this->getUser();
        if (!$me) {
            return $this->json(['error' => 'Non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $otherUser = $userRepository->find($userId);
        if (!$otherUser) {
            return $this->json(['error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $listing = $listingRepository->find($listingId);
        if (!$listing) {
            return $this->json(['error' => 'Livre non trouvé'], Response::HTTP_NOT_FOUND);
        }

        if ($me === $otherUser) {
            return $this->json(['error' => 'Impossible de discuter avec soi-même'], Response::HTTP_BAD_REQUEST);
        }

        // ---------- GET ----------
        if ($request->isMethod('GET')) {
            $messages = $repository->findConversation($me, $otherUser, $listing);

            // Pas encore de message → on renvoie un tableau vide (200 OK)
            $json = $this->serializer->serialize($messages, 'json', ['groups' => 'getMessages']);
            return new JsonResponse($json, Response::HTTP_OK, [], true);
        }

        // ---------- POST ----------
        $data = json_decode(
    $request->getContent(),
    true,
    512,
    JSON_THROW_ON_ERROR
);

        if (!isset($data['content']) || trim($data['content']) === '') {
            return $this->json(['error' => 'Le contenu est obligatoire'], Response::HTTP_BAD_REQUEST);
        }

        $message = new Message();
        $message->setContent(trim($data['content']));
        $message->setSendAt(new DateTimeImmutable());
        $message->setSender($me);
        $message->setReceiver($otherUser);
        $message->setListing($listing);

        $errors = $this->validator->validate($message);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->em->persist($message);
        $this->em->flush();

        $json = $this->serializer->serialize($message, 'json', ['groups' => 'getMessages']);
        return new JsonResponse($json, Response::HTTP_CREATED, [], true);
    }
}
