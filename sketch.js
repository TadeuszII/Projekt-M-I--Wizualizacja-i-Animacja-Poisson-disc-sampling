/// <reference types="p5" />




// ---- Varaibles ----
var r = 10 // Punkty beda w promieniu 10px od siebie
var k = 20 // liczba prob przed tym jak odrzucimy punkt

// --- Variables for drawing --

var strokeColor = 'white' // kolor linii
var strokeWidth = 4 // grubość linii



const n = 2 // liczba wymiarow (demension)

var cellSize = r / Math.sqrt(n) // rozmiar komorki ( formula z artykulu )

// --- Arrays ---
var grid = [] // tablica dwuwymiarowa przechowujaca punkty
var active = [] // tablica przechowujaca aktywne punkty


// ---- Main functions ----
function setup () {
    createCanvas(400, 400);
    background(0);
    strokeWeight(4);
    stroke('white');

    // ---- Step 0: Initialize an n-dimensional background grid... ----
    var columns = floor(width / cellSize) // liczba kolumn
    var rows = floor(height / cellSize) // liczba wierszy

    for (var i = 0; i < columns * rows; i++) // the default −1 indicates no sample, a
        //non-negative integer gives the index of the sample located in a cell.
    {
        grid[i] = -1;
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
}


function draw () {

    background(0);


    // ---- Step 2 While the active list is not empty... ----
    if (active.length > 0)
    {
        var index = random(active.length); // losowanie indeksu z tablicy aktywnych
        for (var n = 0; n < k; n++)
        {   
            
            var index = floor(random(active.length)); // losowanie indeksu z tablicy aktywnych
            var position = active[index]; // pobranie punktu z tablicy aktywnych
            


            // var angle = random(TWO_PI); // losowanie kąta
            // var offsetX = cos(angle); // obliczanie przesunięcia w osi X
            // var offsetY = sin(angle); // obliczanie przesunięcia w osi Y

            var sample = p5.Vector.random2D(); // losowanie wektora przesunięcia
            sample.setMag(random(r, 2 * r)); // ustawienie długości wektora przesunięcia
            //  from the spherical annulus between radius r and 2r 

            sample.add(position); // dodanie przesunięcia do pozycji punktu


            var column_position = floor(sample.x / cellSize); // obliczanie kolumny w gridzie
            var row_position = floor(sample.y / cellSize); // obliczanie wiersza w gridzie

            var czy_punkt_jest_ok = true; //  If a point is adequately far from existing samples

            for ( var i = -1; i <= 1; i++) // -1 spot on the left; 1 spot on the right
            {
                for (var j = -1; j <= 1; j++)
                {
                    var neighbor = grid[[i + j * columns]];
                    // --- Sprawdzanie dystancji meidzy punktem a sąsiadem ---

                    if (neighbor != -1) // jeśli sąsiad istnieje
                    {
                        var distance = p5.Vecotr.dist(sample, neighbor);
                        if (distance < r) // jeśli dystans jest mniejszy niż r, to odrzucamy punkt
                        {
                            czy_punkt_jest_ok = false;
                        }

                    }   

                }


            }

            if (czy_punkt_jest_ok) // jeśli punkt jest dobry to dodamy go
            {
                grid[columns + rows * column_position] = sample; // umieszczenie punktu w gridzie
                active.push(sample);
            }

        }
    }

    for (var i = 0; i < grid.length; i++)
    {
        if (grid[i] != -1)
        {
            stroke(strokeColor);
            strokeWeight(strokeWidth);

            point(grid[i].x, grid[i].y);
        }
        
    }

    // --- loop przez aktywne punkty ---
    for (var i = 0; i < active.length; i++)
    {
        stroke('blue');
        strokeWeight(strokeWidth);
        point(active[i].x, active[i].y);
    }
}