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