# Sprawozdanie1 - Aplikacja Webowa

## Opis
To jest aplikacja webowa zbudowana przy użyciu Node.js, Express.js i MongoDB. Aplikacja umożliwia zarządzanie książkami, autoryzację użytkowników oraz funkcje administracyjne. Używa Pug jako silnika szablonów i JWT do autoryzacji.

## Wymagania wstępne
- Node.js (wersja 14 lub nowsza)
- npm (menedżer pakietów Node.js)
- MongoDB (uruchomiony lokalnie na porcie 27017)

## Instalacja
1. Sklonuj repozytorium lub pobierz pliki projektu.
2. Przejdź do katalogu projektu:
   ```
   cd e:\Github\web2.0
   ```
3. Zainstaluj zależności:
   ```
   npm install
   ```

## Konfiguracja
1. Upewnij się, że masz plik `.env` w katalogu głównym projektu z następującymi zmiennymi:
   ```
   JWT_SECRET=twoj_super_tajny_klucz
   APP_URL=http://localhost:3000
   EMAIL_USER=twój_email@gmail.com
   EMAIL_PASS=twój_hasło_aplikacji
   ```
   - `JWT_SECRET`: Tajny klucz dla JWT (możesz zmienić na własny).
   - `APP_URL`: URL aplikacji (domyślnie localhost:3000).
   - `EMAIL_USER` i `EMAIL_PASS`: Dane do wysyłania emaili (używa Gmaila, wymagane ustawienia aplikacji).

2. Uruchom MongoDB lokalnie. Domyślnie aplikacja łączy się z `mongodb://127.0.0.1:27017/web2_db`.

## Uruchomienie
Aby uruchomić aplikację, wykonaj:
```
node app.js
```
Aplikacja będzie dostępna pod adresem `http://localhost:3000`.

## Użycie
- Strona główna: `http://localhost:3000`
- Rejestracja/Logowanie: `/auth`
- Zarządzanie książkami: `/books`
- Panel administracyjny: `/admin` (wymaga autoryzacji)

## Funkcje
- Autoryzacja użytkowników (rejestracja, logowanie, zmiana hasła)
- Zarządzanie książkami (dodawanie, edycja, usuwanie)
- Wysyłanie emaili (np. powiadomienia)
- Middleware dla autoryzacji i admina

## Autor
Tomasz Czyż
