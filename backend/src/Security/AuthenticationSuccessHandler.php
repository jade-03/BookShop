<?php

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Security\Http\Authentication\AuthenticationSuccessHandler as BaseHandler;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class AuthenticationSuccessHandler extends BaseHandler
{
    public function onAuthenticationSuccess($request, TokenInterface $token): JsonResponse
    {
        $response = parent::onAuthenticationSuccess($request, $token);

        $data = json_decode($response->getContent(), true);
        $jwt = $data['token'];

        // cookie HTTP-only
        $cookie = Cookie::create('JWT_TOKEN')
            ->withValue($jwt)
            ->withHttpOnly(true)
            ->withSecure(false) // true en prod HTTPS
            ->withSameSite('lax')
            ->withPath('/');

        $response->headers->setCookie($cookie);


        return $response;
    }
}