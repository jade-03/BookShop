<?php

namespace App\Repository;

use App\Entity\Book;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Book>
*
* @method Book|null find($id, $lockMode = null, $lockVersion = null)
* @method Book|null findOneBy(array $criteria, array $orderBy = null)
* @method Book[]    findAll()
* @method Book[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
* find  : donnez un id, recevez l’entité correspondante.
* findOneBy  : cette méthode prend en argument un tableau de critères pour effectuer une requête  WHERE  . Par exemple  findOneBy([‘title’ => ‘1984’])
* findAll  : cette méthode renvoie l’intégralité des entités d’un certain type. Il est fortement déconseillé de s’en servir, sauf pour des tables de référence contenant un nombre très limité de lignes.
* findBy  : cette méthode extrêmement polyvalente prend en paramètre le même tableau de critères que  findOneBy  , un second tableau optionnel construit de la même manière pour ajouter une clause  ORDER BY  , un paramètre optionnel  LIMIT  , et un paramètre optionnel  OFFSET
 */
class BookRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Book::class);
    }

//     // Méthode qui permet de filtrer les enregistrements en fonction de la plage de dates 'editAt'.
// // Elle renvoie un objet QueryBuilder configuré avec les conditions spécifiées.
// public function findByEditeAt(array $editAt = []): QueryBuilder
// {
//     // Initialisation d'un QueryBuilder pour créer une requête sur l'entité concernée.
//     // 'a' est un alias utilisé pour représenter cette entité dans la requête.
//     $qb = $this->createQueryBuilder('a');

//     // Vérifie si le tableau $editAt contient une clé 'start'.
//     // Si cette clé existe, cela signifie qu'une date de début est spécifiée pour le filtre.
//     if (\array_key_exists('start', $editAt)) {
//         // Ajoute une condition "a.editAt >= :start" à la requête.
//         $qb->andWhere('a.editAt >= :start')
//             // Définit la valeur du paramètre ':start' en utilisant un objet DateTimeImmutable.
//             // Cela garantit que la date est bien formatée pour la base de données.
//             ->setParameter('start', new \DateTimeImmutable($editAt['start']));
//     }

//     // Vérifie si le tableau $editAt contient une clé 'end'.
//     // Si cette clé existe, cela signifie qu'une date de fin est spécifiée pour le filtre.
//     if (\array_key_exists('end', $editAt)) {
//         // Ajoute une condition "a.editAt <= :end" à la requête.
//         $qb->andWhere('a.editAt <= :end')
//             // Définit la valeur du paramètre ':end' en utilisant un objet DateTimeImmutable.
//             ->setParameter('end', new \DateTimeImmutable($editAt['end']));
//     }

//     // Retourne le QueryBuilder, qui contient la requête construite.
//     // L'appelant pourra exécuter cette requête ou la modifier si nécessaire.
//     return $qb;
// }

    public function findBookIsbn(string $isbn){
        return $this->createQueryBuilder('b')
            ->andWhere('b.isbn = :isbn')
            ->setParameter('isbn', $isbn)
            ->getQuery()
            ->getResult()
        ;
    }
    //    /**
    //     * @return Book[] Returns an array of Book objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('b.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Book
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
