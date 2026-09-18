<?php

namespace App\Repository;

use App\Entity\Listing;
use App\Entity\Message;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Message>
 */
class MessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

    public function findConversationsByUser(User $user): array
{
    $messages = $this->createQueryBuilder('m')
        ->leftJoin('m.listing', 'b')->addSelect('b')
        ->leftJoin('m.sender', 's')->addSelect('s')
        ->leftJoin('m.receiver', 'r')->addSelect('r')
        ->where('m.sender = :user OR m.receiver = :user')
        ->setParameter('user', $user)
        ->orderBy('m.send_at', 'DESC')
        ->getQuery()
        ->getResult();

    $conversations = [];

    foreach ($messages as $message) {
        $otherUser = $message->getSender()->getId() === $user->getId()
            ? $message->getReceiver()
            : $message->getSender();

        $key = $otherUser->getId() . '-' . $message->getListing()->getId();

        if (!isset($conversations[$key])) {
            $conversations[$key] = [
                'user' => $otherUser,
                'listing' => $message->getListing(),
                'lastMessage' => $message->getContent(),
                'date' => $message->getSendAt(),
            ];
        }
    }

    return array_values($conversations);
}
    public function findConversation(User $user1, User $user2, Listing $listing): array
    {
        return $this->createQueryBuilder('m')
        ->leftJoin('m.sender', 's')->addSelect('s')
        ->leftJoin('m.receiver', 'r')->addSelect('r')
        ->where('m.listing = :listing')
        ->andWhere(
            '(m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1)'
        )
        ->setParameter('listing', $listing)
        ->setParameter('user1', $user1)
        ->setParameter('user2', $user2)
        ->orderBy('m.send_at', 'ASC')
        ->getQuery()
        ->getResult();
    }

    //    /**
    //     * @return Message[] Returns an array of Message objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('m.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Message
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
