<?php

namespace App\Controller;

use App\Entity\Book;
use App\Repository\AuthorRepository;
use App\Repository\BookRepository;
use App\Services\BookApiService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
#[Route('/api')]
final class BookController extends AbstractController
{
    #[Route('/books', name: 'api_books', methods: ['GET'])]
    public function getAllBooks(BookRepository $bookRepository, SerializerInterface $serializer): JsonResponse
    {
        $bookList = $bookRepository->findAll();

        $jsonBookList = $serializer->serialize($bookList, 'json', ['groups' => 'getBooks']);
        return new JsonResponse($jsonBookList, Response::HTTP_OK, [], true);
    }


    #[Route('/book/{id}', name: 'api_detailBook', methods: ['GET'])]
    public function getDetailBook(?Book $book, SerializerInterface $serializer, BookRepository $bookRepository): JsonResponse
    {

        if (!$book) {
            return $this->json(['error' => 'Book not found'], 404);
        }
        $jsonBook = $serializer->serialize($book, 'json', ['groups' => 'getBooks']);
        return new JsonResponse($jsonBook, Response::HTTP_OK, [], true);
    }


    #[Route('/books/search', name: 'api_books_search', methods: ['GET'])]
    public function search(Request $request, BookApiService $service): JsonResponse
    {
        $isbn = $request->query->get('isbn');
        
        if (!$isbn) {
            return $this->json(['error' => 'ISBN manquant'], Response::HTTP_BAD_REQUEST);
        }
        
        // // Nettoyer l'ISBN (enlever les tirets et espaces)
        // $isbn = preg_replace('/[-\s]/', '', $isbn);
        
        // // Valider le format ISBN
        // if (!preg_match('/^\d{10}(\d{3})?$/', $isbn)) {
        //     return $this->json(['error' => 'Format ISBN invalide'], Response::HTTP_BAD_REQUEST);
        // }
        
        $result = $service->searchBookByIsbn($isbn);
        
        if (isset($result['error'])) {
            return $this->json(['error' => $result['error']], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        
        if (empty($result['items'])) {
            return $this->json(['error' => 'Aucun livre trouvé pour cet ISBN'], Response::HTTP_NOT_FOUND);
        }
        
        $bookData = $result['items'][0]['volumeInfo'];
        
        // Récupérer l'ISBN depuis les identifiants
        $isbnFound = null;
        if (!empty($bookData['industryIdentifiers'])) {
            foreach ($bookData['industryIdentifiers'] as $identifier) {
                if ($identifier['type'] === 'ISBN_13') {
                    $isbnFound = $identifier['identifier'];
                    break;
                }
            }
        }
        
        // Formater la réponse
        $book = [
            'isbn' => $isbnFound ?? $isbn,
            'title' => $bookData['title'] ?? null,
            'author' => [
                'name' => $bookData['authors'] ?? null
            ],
        ];
        
        return $this->json($book);
    }


    #[Route('/delete/book/{id}', name: 'api_deleteBook', methods: ['DELETE'])]
    public function deleteBook(Book $book, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($book);
        $em->flush();
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }


    #[Route('/update/book/{id}', name: "updateBook", methods: ['PUT'])]
    public function updateBook(
        Request $request,
        SerializerInterface $serializer,
        Book $currentBook,
        EntityManagerInterface $em,
    ): JsonResponse {
        $updatedBook = $serializer->deserialize($request->getContent(), Book::class, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $currentBook]);

        $em->persist($updatedBook);
        $em->flush();

        return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }
}
