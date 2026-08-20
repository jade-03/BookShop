<?php

namespace App\Entity;

use App\Enum\PayementMethod;
use App\Repository\PayementRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PayementRepository::class)]
class Payement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(enumType: PayementMethod::class)]
    private ?PayementMethod $payement_method = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $amount = null;

    #[ORM\Column]
    private ?\DateTime $payement_date = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPayementMethod(): ?PayementMethod
    {
        return $this->payement_method;
    }

    public function setPayementMethod(PayementMethod $payement_method): static
    {
        $this->payement_method = $payement_method;

        return $this;
    }

    public function getAmount(): ?string
    {
        return $this->amount;
    }

    public function setAmount(string $amount): static
    {
        $this->amount = $amount;

        return $this;
    }

    public function getPayementDate(): ?\DateTime
    {
        return $this->payement_date;
    }

    public function setPayementDate(\DateTime $payement_date): static
    {
        $this->payement_date = $payement_date;

        return $this;
    }
}
