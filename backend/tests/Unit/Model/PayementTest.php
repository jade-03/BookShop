<?php

namespace App\Tests\Unit\Model;

use App\Entity\Payement;
use App\Enum\PayementMethod;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class PayementTest extends TestCase
{
    #[Test]
    public function create_payement(): void{
        $stripe = 'id_stripe';
        $method = PayementMethod::Card;
        $amount = 13.50;

        $payement = new Payement;
        $payement->setStripePaymentIntent($stripe);
        $payement->setPayementMethod($method);
        $payement->setAmount($amount);

        $this->assertEquals($stripe, $payement->getStripePaymentIntent());
        $this->assertEquals($method, $payement->getPayementMethod());
        $this->assertEquals($amount, $payement->getAmount());

    }
    

}