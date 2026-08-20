<?php

namespace App\Tests\Unit\Model;

use App\Entity\Order;
use DateTimeImmutable;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class OrderTest extends TestCase
{
    #[Test]
    public function create_order():void
    {
        $date = new DateTimeImmutable();
        $statut = 'Accepter';
        $total = 14.30;

        $order = new Order;
        $order->setOrderDate($date);
        $order->setStatus($statut);
        $order->setTotalAmount($total);

        $this->assertEquals($date, $order->getOrderDate());
        $this->assertEquals($statut, $order->getStatus());
        $this->assertEquals($total, $order->getTotalAmount());
    }
}