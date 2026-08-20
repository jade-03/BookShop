<?php

namespace App\Services;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class BookApiService {
    private HttpClientInterface $client;
    private string $apiKey;

    private $url = 'https://www.googleapis.com/books/v1/volumes';

    public function __construct(HttpClientInterface $client, string $apiKey)
    {
        $this->client = $client;
        $this->apiKey = $apiKey;
    }

    public function searchBookByIsbn(string $isbn): array
    {
        $response = $this->client->request(
            'GET',
            $this->url,
            [
                'query' => [
                    'q' => 'isbn:' . $isbn,
                    'key' => $this->apiKey,
                ]
            ]
        );

        return $response->toArray(false);
    }
}