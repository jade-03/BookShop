<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260820181403 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE favorite (id INT AUTO_INCREMENT NOT NULL, date_add DATETIME NOT NULL, user_id INT NOT NULL, listing_id INT NOT NULL, INDEX IDX_68C58ED9A76ED395 (user_id), INDEX IDX_68C58ED9D4619D1A (listing_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE favorite ADD CONSTRAINT FK_68C58ED9A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE favorite ADD CONSTRAINT FK_68C58ED9D4619D1A FOREIGN KEY (listing_id) REFERENCES listing (id)');
        $this->addSql('ALTER TABLE listing ADD favorite_id INT DEFAULT NULL, ADD category_id INT NOT NULL');
        $this->addSql('ALTER TABLE listing ADD CONSTRAINT FK_CB0048D4AA17481D FOREIGN KEY (favorite_id) REFERENCES favorite (id)');
        $this->addSql('ALTER TABLE listing ADD CONSTRAINT FK_CB0048D412469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('CREATE INDEX IDX_CB0048D4AA17481D ON listing (favorite_id)');
        $this->addSql('CREATE INDEX IDX_CB0048D412469DE2 ON listing (category_id)');
        $this->addSql('ALTER TABLE picture CHANGE back_front back_cover VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE user ADD role VARCHAR(50) NOT NULL, ADD updated_at DATETIME DEFAULT NULL, ADD favorite_id INT DEFAULT NULL, DROP roles, CHANGE pseudo pseudo VARCHAR(30) DEFAULT NULL, CHANGE create_at created_at DATETIME NOT NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649AA17481D FOREIGN KEY (favorite_id) REFERENCES favorite (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D64986CC499D ON user (pseudo)');
        $this->addSql('CREATE INDEX IDX_8D93D649AA17481D ON user (favorite_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE favorite DROP FOREIGN KEY FK_68C58ED9A76ED395');
        $this->addSql('ALTER TABLE favorite DROP FOREIGN KEY FK_68C58ED9D4619D1A');
        $this->addSql('DROP TABLE favorite');
        $this->addSql('ALTER TABLE listing DROP FOREIGN KEY FK_CB0048D4AA17481D');
        $this->addSql('ALTER TABLE listing DROP FOREIGN KEY FK_CB0048D412469DE2');
        $this->addSql('DROP INDEX IDX_CB0048D4AA17481D ON listing');
        $this->addSql('DROP INDEX IDX_CB0048D412469DE2 ON listing');
        $this->addSql('ALTER TABLE listing DROP favorite_id, DROP category_id');
        $this->addSql('ALTER TABLE picture CHANGE back_cover back_front VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649AA17481D');
        $this->addSql('DROP INDEX UNIQ_8D93D64986CC499D ON user');
        $this->addSql('DROP INDEX IDX_8D93D649AA17481D ON user');
        $this->addSql('ALTER TABLE user ADD roles JSON NOT NULL, DROP role, DROP updated_at, DROP favorite_id, CHANGE pseudo pseudo VARCHAR(30) NOT NULL, CHANGE created_at create_at DATETIME NOT NULL');
    }
}
