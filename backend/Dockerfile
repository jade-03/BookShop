FROM php:8.4-fpm

RUN docker-php-ext-install pdo_pgsql

# Variables
ENV COMPOSER_ALLOW_SUPERUSER=1

# Dépendances système
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libicu-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        intl \
        zip \
        gd \
        opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Xdebug (dev only)
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

# Config Xdebug simple
RUN echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.start_with_request=yes" >> /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.client_host=host.docker.internal" >> /usr/local/etc/php/conf.d/xdebug.ini

WORKDIR /var/www/symfony

# Copier projet
COPY . .

# Installer dépendances Symfony
RUN composer install --no-interaction --prefer-dist

# Permissions Symfony
RUN chown -R www-data:www-data /var/www/symfony

EXPOSE 8000

CMD ["php-fpm"]