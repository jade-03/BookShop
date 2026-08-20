<?php

namespace App\Controller;

use App\DTO\SendMessage;
use App\Entity\Message;
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
        private ValidatorInterface $validator
    ) {}

    #[Route('/conversations/me', name: 'api_my_messages', methods: ['GET'])]
    public function messageUser(MessageRepository $repository): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Non authentifié'], 401);
        }

        $messages = $repository->findConversationsByUser($user);

        $jsonMessages = $this->serializer->serialize($messages, 'json', ['groups' => 'getMessages']);
        return new JsonResponse($jsonMessages, 200, [], true);
    }

    #[Route('/conversation/{id}', name: 'api_my_message_id', methods: ['GET', 'POST'])]
    public function messageById(int $id, Request $request, MessageRepository $repository, UserRepository $userRepository): JsonResponse
    {

        $otherUser = $userRepository->find($id);

        if (!$otherUser) {
            return $this->json(['error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        if ($request->isMethod('get')) {
            $message = $repository->findConversation($this->getUser(), $otherUser);

            if (!$message) {
                return $this->json(['error' => 'Message not found'], 404);
            }

            $jsonMessages = $this->serializer->serialize($message, 'json', ['groups' => 'getMessages']);
            return new JsonResponse($jsonMessages, 200, [], true);
        }

        if ($request->isMethod('post')) {
            $newMessage = $this->serializer->deserialize($request->getContent(), Message::class, 'json');

            $receiver =  $userRepository->find($id);

            if (!$receiver) {
                return $this->json(['error' => 'Destinataire non trouvé'], 404);
            }

            $newMessage->setSendAt(new DateTimeImmutable());
            $newMessage->setSender($this->getUser());
            $newMessage->setReceiver($receiver);
            $this->em->persist($newMessage);
            $this->em->flush();

            $jsonMessages = $this->serializer->serialize($newMessage, 'json', ['groups' => 'getMessages']);
            return new JsonResponse($jsonMessages, 200, [], true);
        }

        throw $this->createNotFoundException();
    }
}
