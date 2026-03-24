# Projekt-M-I--Wizualizacja-i-Animacja-Poisson-disc-sampling

Cześć! To mój projekt na zaliczenie, w którym zrobiłem wizualizację algorytmu **Poisson Disc Sampling**.

Całą matematykę oparłem na artykule Roberta Bridsona (*Fast Poisson Disk Sampling in Arbitrary Dimensions*) - gość wymyślił, jak liczyć to szybko i prosto, więc skorzystałem z jego podejścia. Projekt napisałem w **JavaScripcie** z użyciem biblioteki **p5.js** do rysowania.

---

## Co robi ten algorytm?

Układa punkty na ekranie tak, żeby wyglądały naturalnie - nie losowo, ale z zachowaniem minimalnej odległości między nimi (tzw. promień `r`). Efekt jest dużo ładniejszy niż zwykłe losowanie, które często daje chaos i nakładające się punkty.

---

## Funkcje

Panel sterowania na dole strony jest podzielony na trzy sekcje.

**1. Plansza (Canvas)**
- Suwaki do ustawiania szerokości i wysokości ekranu.
- Przycisk *Change Size* zatwierdza zmiany i odświeża planszę.

**2. Algorytm**
- **Szybkość** - suwak do regulacji tempa animacji.
- **Promień (r)** - minimalna odległość między punktami. Najważniejszy parametr.
- **Próby (k)** - ile razy algorytm próbuje dodać nowy punkt, zanim odpuści.
- Przycisk *Default* przywraca domyślne ustawienia (`r=10`, `k=20`).

**3. Animacja i wygląd**
- **Grubość kropek** - suwak do zmiany rozmiaru punktów plus przycisk do automatycznego dopasowania do promienia.
- **Podgląd "pod maską"** - checkboxy do włączenia podglądu odrzuconych punktów (czerwone) i aktywnych (fioletowe). Opcja *Show Random Generation* otwiera drugą ramkę z losowym rozkładem dla porównania.
- **Motywy kolorystyczne** - biały, tęcza według pozycji, tęcza według kolejności dodawania lub totalnie losowe kolory. UWAGA! Przy losowych kolorach pojawia się ostrzeżenie o epilepsji - sporo miga.

---

## Technologie

- **HTML i CSS** - interfejs z suwakami, układ na Flexboxie, ciemnofioletowy pasek nawigacyjny.
- **JavaScript (p5.js)** - logika algorytmu: pętle, sprawdzanie odległości, zarządzanie tablicami. Zamiast pierwiastka kwadratowego używam porównania kwadratów odległości - jest szybciej.

---

## Jak uruchomić?

Nie trzeba instalować niczego.

1. Pobierz pliki na swój komputer.
2. Kliknij dwa razy w `index.html`.
3. Projekt otworzy się w przeglądarce i od razu działa.