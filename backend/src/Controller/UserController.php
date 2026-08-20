<?php

namespace App\Controller;

use App\DTO\Account;
use App\DTO\ChangePassword;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class UserController extends AbstractController
{
    private SerializerInterface $serializer;

    public function __construct(SerializerInterface $serializer)
    {
        $this->serializer = $serializer;
    } 

    #[Route('/api/users', name: 'api_users', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getUsers(UserRepository $repository): JsonResponse
    {
        $users = $repository->findByRole('ROLE_USER');

        $jsonUsers = $this->serializer->serialize($users, 'json', ['groups' => 'getUser']);
        return new JsonResponse($jsonUsers, 200, [], true);
    }

    #[Route('/api/user/{id}', name: 'api_user', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getUserBy(User $user): JsonResponse
    {
        $jsonUsers = $this->serializer->serialize($user, 'json', ['groups' => 'getUser']);
        return new JsonResponse($jsonUsers, 200, [], true);
    }

    #[Route('/api/user/{id}/account', name: 'api_user_account', methods: ['PATCH'])]
    #[IsGranted('PUBLIC_ACCESS')]
    public function patchUser(
        Request $request,
        User $currentUser,
        ValidatorInterface $validator,
        EntityManagerInterface $em
    ): JsonResponse {
        
        $dto = $this->serializer->deserialize($request->getContent(), Account::class, 'json');


        $error = $validator->validate($dto);

        if (count($error) > 0) {
            return $this->json($error, 400);
        }

        if ($dto->lastname !== null) {
            $currentUser->setLastname($dto->lastname);
        }

        if ($dto->firstname !== null) {
            $currentUser->setFirstname($dto->firstname);
        }

        if ($dto->pseudo !== null) {
            $currentUser->setPseudo($dto->pseudo);
        }

        if ($dto->email !== null) {
            $currentUser->setEmail($dto->email);
        }

        $em->persist($currentUser);

        $em->flush();

        $jsonUsers = $this->serializer->serialize($currentUser, 'json', ['groups' => 'getUser']);
        return new JsonResponse($jsonUsers, 200, [], true);
    }

    #[Route('/api/user/{id}/password', name: 'api_password', methods: ['PATCH'])]
    public function patchtPasswd(
        Request $request,
        User $currentUser,
        ValidatorInterface $validator,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $userPasswordHasher
    ): JsonResponse {
        $data = $this->serializer->deserialize($request->getContent(), ChangePassword::class, 'json');

        $error = $validator->validate($data);

        if (count($error) > 0) {
            return $this->json($error, 400);
        }

        $oldPassword = $data->oldPassword;

        // Vérifier que le mot de passe entrer et le même que en BDD
        if ($userPasswordHasher->isPasswordValid($currentUser, $oldPassword) === false) {
            return new JsonResponse('Ancien mot de passe requis', Response::HTTP_BAD_REQUEST);
        }

        $newPassword = $data->newPassword;

        if (!$newPassword) {
            return $this->json(['message' => 'Le nouveau mot de passe est obligatoire'], Response::HTTP_BAD_REQUEST);
        }

        if ($oldPassword === $newPassword) { 
            return new JsonResponse("L'ancien mot de passe doit être différent du nouveau", Response::HTTP_BAD_REQUEST);
        }

        $currentUser->setPassword($userPasswordHasher->hashPassword($currentUser, $newPassword));

        $em->flush();

        $jsonUser = $this->serializer->serialize($currentUser, 'json');

        return new JsonResponse($jsonUser, 200, [], true);
    }
}
