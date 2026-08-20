<?php

namespace App\Entity;

use App\Enum\BookCondition;
use App\Enum\Statut;
use App\Repository\ListingRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ListingRepository::class)]
class Listing
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['getListing'])]
    private ?int $id = null;

    #[ORM\Column(length: 30)]
    #[Groups(['getListing'])]
    private ?string $title = null;

    #[ORM\Column(enumType: BookCondition::class)]
    #[Groups(['getListing'])]
    #[Assert\Choice(callback: [ BookCondition::class, 'cases'])]
    private ?BookCondition $book_condition = null;

    #[ORM\Column(length: 100)]
    #[Groups(['getListing'])]
    private ?string $language = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Groups(['getListing'])]
    private ?string $price = null;

    #[ORM\Column(enumType: Statut::class)]
    #[Groups(['getListing'])]
    #[Assert\Choice(callback: [ Statut::class, 'cases'])]
    private ?Statut $statut = null;

    #[ORM\Column]
    #[Groups(['getListing'])]
    private ?\DateTimeImmutable $publication_date = null;

    #[ORM\ManyToOne(inversedBy: 'listings')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['getListing'])]
    private ?Book $book = null;

    #[ORM\ManyToOne(inversedBy: 'listings')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['getListing'])]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'listing')]
    private ?Favorite $favorite = null;

    /**
     * @var Collection<int, Favorite>
     */
    #[ORM\OneToMany(targetEntity: Favorite::class, mappedBy: 'listing')]
    private Collection $favoritesBy;

    #[ORM\OneToOne(mappedBy: 'listing', cascade: ['persist', 'remove'])]
    #[Groups(['getListing'])]
    private ?Picture $picture = null;

    #[ORM\ManyToOne(inversedBy: 'listings')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['getListing'])]
    private ?Category $category = null;

    public function __construct()
    {
        $this->favoritesBy = new ArrayCollection();
    }

    

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }


    public function getBookCondition(): ?BookCondition
    {
        return $this->book_condition;
    }

    public function setBookCondition(BookCondition|string|null $book_condition): static
    {
         if (is_string($book_condition)) {
            $book_condition = BookCondition::tryFrom($book_condition);
        }
        
        $this->book_condition = $book_condition;

        return $this;
    }

    public function getLanguage(): ?string
    {
        return $this->language;
    }

    public function setLanguage(string $language): static
    {
        $this->language = $language;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getStatut(): ?Statut
    {
        return $this->statut;
    }

    public function setStatut(Statut $statut): static
    {
        $this->statut = $statut;

        return $this;
    }

    public function getPublicationDate(): ?\DateTimeImmutable
    {
        return $this->publication_date;
    }

    public function setPublicationDate(\DateTimeImmutable $publication_date): static
    {
        $this->publication_date = $publication_date;

        return $this;
    }

    public function getBook(): ?Book
    {
        return $this->book;
    }

    public function setBook(?Book $book): static
    {
        $this->book = $book;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getFavorite(): ?Favorite
    {
        return $this->favorite;
    }

    public function setFavorite(?Favorite $favorite): static
    {
        $this->favorite = $favorite;

        return $this;
    }

    /**
     * @return Collection<int, Favorite>
     */
    public function getFavoritesBy(): Collection
    {
        return $this->favoritesBy;
    }

    public function addFavoritesBy(Favorite $favoritesBy): static
    {
        if (!$this->favoritesBy->contains($favoritesBy)) {
            $this->favoritesBy->add($favoritesBy);
            $favoritesBy->setListing($this);
        }

        return $this;
    }

    public function removeFavoritesBy(Favorite $favoritesBy): static
    {
        if ($this->favoritesBy->removeElement($favoritesBy)) {
            // set the owning side to null (unless already changed)
            if ($favoritesBy->getListing() === $this) {
                $favoritesBy->setListing(null);
            }
        }

        return $this;
    }

    public function getPicture(): ?Picture
    {
        return $this->picture;
    }

    public function setPicture(Picture $picture): static
    {
        // set the owning side of the relation if necessary
        if ($picture->getListing() !== $this) {
            $picture->setListing($this);
        }

        $this->picture = $picture;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }
}
