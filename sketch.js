/// <reference types="p5" />


// ---- Varaibles ----

// --- variables for buttons/sliders ---

var btnStartPause;
var btnReset;
var btnChangeSize;
var sliderWidth;
var sliderHeight;
var sliderSpeed;
var isPaused = false; // Flaga do zatrzymywania animacji

// --- variables for drawing ---

var width = 400; // szerokość canvasu
var height = 400; // wysokość canvasu
var ordered = [];  // tablica przechowująca punkty w kolejności ich dodawania do gridu


var strokeColor = 'white' // kolor nieaktywnych punktow
var colorActive = 'purple' // kolor aktywnych punktow
var strokeWidth = r * 0.5 // grubość linii

// --- variables for algorithm ---

var r = 10 // Punkty beda w promieniu 10px od siebie
var k = 20 // liczba prob przed tym jak odrzucimy punkt
var liczba_iteracji = 50; // szybkosc animacji, im większa liczba iteracji, tym szybciej będzie się rysować, ale może być mniej płynna animacja

const n = 2 // liczba wymiarow (demension)

var cellSize = r / Math.sqrt(n) // rozmiar komorki ( formula z artykulu )

// -- Arrays --
var grid = [] // tablica dwuwymiarowa przechowujaca punkty
var active = [] // tablica przechowujaca aktywne punkty


var columns; // liczba kolumn w gridzie
var rows; // liczba wierszy w gridzie

// ---- Functions ----

// --- Button functions ---

function togglePause() // -- Funckja pauzy/odpauzowania animacji --
{
    isPaused = !isPaused; // Switch
    if (isPaused) {
        noLoop(); // Zatrzymuje petla draw()
    } else {
        loop(); // Wznawia petla draw()
    }
}


function resetAlgorithm() // -- Resetowanie wszystkich zmiennych --
{
    initPoissonDiscSampling(); // -- funckja ustawia wszstko na deffault --
    loop(); // Wznawia petla draw() po resecie
}


function changeCanvasSize() { // -- funckja zmienia rozmiar canvasu --

    var canvasWithRandomPoints = document.getElementById('show-random').checked;

    if (canvasWithRandomPoints) {
        alert("Zmiana rozmiaru zablokowana – wyłącz najpierw 'Show Random Point Generation'.");
        return; // - jezeli checkbox jest zaznaczony, nie zmieniamy rozmiaru canvasu -
    }

    width = parseInt(document.getElementById('width-slider').value);
    height = parseInt(document.getElementById('height-slider').value);

    resizeCanvas(width, height);

    initPoissonDiscSampling(); // - funckja ustawia wszstko na deffault -

}

function initPoissonDiscSampling() // -- funckja ustawia wszstko na deffault --
{

    // - Arrays -
    grid = [] // tablica dwuwymiarowa przechowujaca punkty
    active = [] // tablica przechowujaca aktywne punkty

    ordered = [];  // tablica przechowująca punkty w kolejności ich dodawania do gridu

    // - variables - 

    cellSize = r / Math.sqrt(n) // rozmiar komorki ( formula z artykulu )
    columns = floor(width / cellSize) // liczba kolumn
    rows = floor(height / cellSize) // liczba wierszy

    columns = floor(width / cellSize) // liczba kolumn
    rows = floor(height / cellSize) // liczba wierszy

    for (var i = 0; i < columns * rows; i++) // the default −1 indicates no sample, a
    //non-negative integer gives the index of the sample located in a cell.
    {
        grid[i] = undefined;
    }


    // - Losowanie punktow startowych -
    var x = Math.random() * (width);
    var y = Math.random() * (height);
    var position = createVector(x, y);

    // - Umieszczenie punktu startowego w gridzie -
    var i = floor(x / cellSize);
    var j = floor(y / cellSize);

    if (i >= 0 && i < columns && j >= 0 && j < rows) {
        grid[i + j * columns] = position;
        active.push(position);
        ordered.push(position);
    }
    // var i = floor(x / cellSize);
    // var j = floor(y / cellSize);
    // grid[i + j * columns] = position; // umieszczenie punktu startowego w gridzie

}


function setToDefault() { // -- funckja ustawia r, k, color width na deffault --

    document.getElementById('r-input').value = 10;
    document.getElementById('r-slider').value = 10;
    document.getElementById('k-input').value = 20;
    document.getElementById('k-slider').value = 20;

    document.getElementById('stroke-slider').value = (r * 0.5);
    document.getElementById('stroke-input').value = (r * 0.5);

    updateR_And_Parameters(); // -- funckja aktualizujaca r i resetuje algortym  --
}

function updateR_And_Parameters() { // -- funckja aktualizująca wartosc r --
    r = parseInt(document.getElementById('r-input').value);
    resetAlgorithm();
}



// --- Main functions ---
function setup() {
    //createCanvas(400, 400);

    var myCanvas = createCanvas(width, height);
    myCanvas.parent('canvas-container');
    background(0);
    strokeWeight(4);
    stroke('white');
    colorMode(HSB);

    // ---- Step 0: Initialize an n-dimensional background grid... ----
    columns = floor(width / cellSize) // liczba kolumn
    rows = floor(height / cellSize) // liczba wierszy

    for (var i = 0; i < columns * rows; i++) // the default −1 indicates no sample, a
    //non-negative integer gives the index of the sample located in a cell.
    {
        grid[i] = undefined;
    }


    // ---- Step 1: Select the initial sample x0, randomly ( i jeszce na wybor) ...

    // --- Losowanie punktow startowych ---
    var x = Math.random() * (width - 1);
    var y = Math.random() * (height - 1);
    var position = createVector(x, y);

    // --- Umieszczenie punktu startowego w gridzie ---
    var i = floor(x / cellSize);
    var j = floor(y / cellSize);
    grid[i + j * columns] = position; // umieszczenie punktu startowego w gridzie

    // --- Umieszczenie punktu startowego w tablicy aktywnych ---
    active.push(position);
    ordered.push(position);

    background(0);
}


function draw() {

    background(0);


    // ---- Pobranie wartosci z suwakow i przyciskow ----

    // --- pobranie wartosci liczby iteracji z suwaka szybkości ---
    liczba_iteracji = parseInt(document.getElementById('speed-slider').value); // pobranie wartości z suwaka szybkości

    // --- pobranie wartosci k z suwaka i inputa ---
    k = parseInt(document.getElementById('k-input').value);
    // --- pobranie wartosci z suwaka grubosci linii ---
    strokeWidth = parseInt(document.getElementById('stroke-input').value);

    // ---- Step 2 While the active list is not empty... ----
    for (var total = 0; total < liczba_iteracji; total++) { // 5 raza per frame, zeby bylo szybciej, ale mozna usunac i bedzie animacja
        if (active.length > 0) { // while = odrazu, if = animacja, 

            var index = floor(random(active.length)); // losowanie indeksu z tablicy aktywnych
            var position = active[index]; // pobranie punktu z tablicy aktywnych


            var found = false; // zmienna pomocnicza do sprawdzania czy znaleźliśmy odpowiedni punkt

            for (var n = 0; n < k; n++) {




                var sample = p5.Vector.random2D(); // losowanie wektora przesunięcia
                sample.setMag(random(r, 2 * r)); // ustawienie długości wektora przesunięcia
                //  from the spherical annulus between radius r and 2r 

                sample.add(position); // dodanie przesunięcia do pozycji punktu


                var column_position = floor(sample.x / cellSize); // obliczanie kolumny w gridzie
                var row_position = floor(sample.y / cellSize); // obliczanie wiersza w gridzie

                if (column_position > -1 && row_position > -1 && column_position < (columns) && row_position < (rows) && !grid[column_position + row_position * columns]) { // jeśli w gridzie jest już punkt, to odrzucamy próbę


                    var czy_punkt_jest_ok = true; //  If a point is adequately far from existing samples

                    // --- Sprawdzanie sąsiadów w gridzie ---
                    for (var i = -1; i <= 1; i++) // -1 spot on the left; 1 spot on the right
                    {
                        for (var j = -1; j <= 1; j++) {
                            // --- Sprawdzanie dystancji meidzy punktem a sąsiadem ---
                            var index_sasiada = (column_position + i) + (row_position + j) * columns; // obliczanie indeksu sąsiada w gridzie
                            var neighbor = grid[index_sasiada]; // pobranie sąsiada z gridzie


                            if (neighbor) // jeśli sąsiad istnieje
                            {
                                var distance = p5.Vector.dist(sample, neighbor);
                                if (distance < r) // jeśli dystans jest mniejszy niż r, to odrzucamy punkt
                                {
                                    czy_punkt_jest_ok = false;
                                }

                            }

                        }


                    }

                    if (czy_punkt_jest_ok) //  -- jeśli punkt jest dobry to dodamy go --
                    {
                        found = true; // -- znaleźliśmy odpowiedni punkt --

                        grid[column_position + row_position * columns] = sample; // umieszczenie punktu w gridzie
                        active.push(sample);

                        // --- Jest to dla animacji kolorowanie puntkow od kolejnosci ----
                        ordered.push(sample); // dodanie punktu do tablicy ordered

                        break; // one point per frame delte to do it faster
                    } else {
                        stroke('red');
                        strokeWeight(strokeWidth); // Slightly thicker so you can see them flash
                        point(sample.x, sample.y);
                    }


                }
            }

            if (!found) // -- jezeli nie znaleźliśmy odpowiedniego punktu po k próbach
            {
                // --- Jezeeli dojdzi do k-1 prób, to usuwamy punkt z tablicy aktywnych ---
                active.splice(index, 1); // usunięcie punktu z tablicy aktywnych
            }
        }
    }

    // --- biale kolorowanie punktow w gridzie ---
    for (var i = 0; i < grid.length; i++) {
        if (grid[i]) {
            stroke(strokeColor);
            strokeWeight(strokeWidth);

            point(grid[i].x, grid[i].y); // rysowanie punktu z gridzie
        }

    }


    // ---- Kolorowanie punktow w gridzie zależnie od ich indeksu ----
    // for (var i = 0; i < grid.length; i++) {
    //     if (grid[i]) {
    //         stroke(i / 100 % 360, 100, 100); // kolor punktu zależny od jego indeksu w gridzie
    //         strokeWeight(1);

    //         point(grid[i].x, grid[i].y); // rysowanie punktu z gridzie
    //     }

    // }


    // ---- Kolorowanie punktow w tablicy ordered zależnie od ich indeksu ----
    // for (var i = 0; i < ordered.length; i++) {
    //     if (ordered[i]) {
    //         stroke(i % 360, 100, 100); // kolor punktu zależny od jego indeksu w tablicy ordered
    //         strokeWeight(20);

    //         point(ordered[i].x, ordered[i].y); // rysowanie punktu z tablicy ordered
    //     }

    // }

    // ---- Kolorowanie punktow w tablicy ordered zależnie od ich indeksu, ale z mniejszą ilością kolorów ----
    // var a = 0;
    // for (var i = 0; i < ordered.length; i++) {
    //     if (ordered[i]) {

    //         if (i % 100 === 0){
    //             a += 1;
    //         }

    //         var colorValue = min(a, 359);
    //         stroke(colorValue, 100, 100); // kolor punktu zależny od jego indeksu w tablicy ordered
    //         strokeWeight(1);

    //         point(ordered[i].x, ordered[i].y); // rysowanie punktu z tablicy ordered
    //     }

    // }



    // --- loop przez aktywne punkty ---
    for (var i = 0; i < active.length; i++) {
        stroke(colorActive);
        strokeWeight(strokeWidth);
        point(active[i].x, active[i].y);

    }


    if (active.length === 0) {

        background(0);

        for (var i = 0; i < grid.length; i++) {
            if (grid[i]) {
                stroke(strokeColor);
                strokeWeight(strokeWidth);

                point(grid[i].x, grid[i].y); // rysowanie punktu z gridzie
            }

        }

        noLoop(); // Zatrzymuje petla draw() gdy nie ma już aktywnych punktów

    }

}


