/**
 * Hra Had (Snake Game) 
 * @author Michal Gros
 * @licence MIT
 * @version 1.0
 * @webpage http://www.netsecure.cz
 * Tento skript řídí logiku hry Had.
 */
const canvas = document.getElementById('gameCanvas'); // Reference na HTML plátno
const ctx = canvas.getContext('2d'); // Kontext pro kreslení na plátně

let speed = 2; // Rychlost hry (kolikrát za sekundu se hra aktualizuje)

let tileCount = 20; // Počet dlaždic na jednu stranu plátna
let tileSize = canvas.width / tileCount - 2; // Velikost jedné dlaždice
let headX = 10; // Počáteční horizontální pozice hlavy hada
let headY = 10; // Počáteční vertikální pozice hlavy hada
const snakeParts = []; // Pole částí těla hada
let tailLength = 1; // Počáteční délka hada

let appleX = 5; // Horizontální pozice jablka
let appleY = 5; // Vertikální pozice jablka

let xVelocity=0; // Horizontální rychlost hada (změna pozice za aktualizaci)
let yVelocity=0; // Vertikální rychlost hada (změna pozice za aktualizaci)
let death_message = " Had je hladovej"
let score = 0; // Skóre hry

/**
 * Hlavní smyčka hry, která se opakuje. Tato funkce řídí aktualizaci stavu hry,
 * včetně pohybu hada, kontroly kolizí a vykreslování hry na plátno.
 */
function drawGame() {
    changeSnakePosition();
    let result = isGameOver();
    if(result) {
        return;
    }

    clearScreen(); 
    
    checkAppleCollision();
    drawApple();
    drawSnake();

    drawScore();

    setTimeout(drawGame, 1000 / speed);
}

/**
 * Kontroluje, zda hra skončila, což se může stát, pokud had narazí do zdi
 * nebo do svého vlastního těla. Vrací true, pokud je hra u konce.
 * @return {boolean} Vrací true, pokud je hra u konce; jinak false.
 */
function isGameOver() {
    let gameOver = false;

    // Pokud se had ještě nezačal hýbat, hra neskončila
    if(yVelocity ===0 && xVelocity ===0){
        return false;
    }
    
    // Kontrola, zda had narazil do zdi
    if(headX < 0 || headX === tileCount || headY < 0 || headY === tileCount) {
        gameOver = true;
        death_message = "Had umřel na zeď";
    }

    // Kontrola, zda had narazil sám do sebe
    for(let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if(part.x === headX && part.y === headY) {
            gameOver = true;
            death_message = "Had umřel sám na sebe";
            break;
        }
    }

    // Pokud hra skončila, zobrazit text
    if(gameOver) {
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = "50px Verdana";
        ctx.fillText("Konec hry!", canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = "red";
        ctx.font = "20px Verdana";
        ctx.fillText(death_message, canvas.width / 2, canvas.height / 2 +50);
    }

    return gameOver;
}

/**
 * Zobrazuje aktuální skóre hráče na plátno.
 */
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "15px Verdana"
    ctx.fillText("Skóre " + score, canvas.width-80, 20);
}

/**
 * Vyčistí celé plátno, připraví ho na další vykreslení herního stavu.
 */
function clearScreen() {
    ctx.fillStyle = '#123456';
    ctx.fillRect(0,0,canvas.width,canvas.height);
}
/**
 * Vykresluje hada na plátno. Kreslí všechny části těla hada a jeho hlavu.
 */
function drawSnake() {

    ctx.fillStyle = 'green';
    for(let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize,tileSize);
    }

    // Přidávání nových částí hada
    snakeParts.push(new SnakePart(headX, headY));
    while(snakeParts.length > tailLength){
        snakeParts.shift(); // Odstranění nejstarší části hada
    }

    // Vykreslení hlavy hada
    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize,tileSize);
}

/**
 * Aktualizuje pozici hada na základě jeho aktuální rychlosti a směru pohybu.
 */
function changeSnakePosition(){
    headX += xVelocity;
    headY += yVelocity;
}
/**
 * Vykresluje jablko na plátno. Jablko je cílovým objektem, který had musí sníst
 * pro zvýšení skóre a délky těla.
 */
function drawApple() {

    ctx.fillStyle = "red";
    // Vypočítá střed jablka
    let centerX = appleX * tileCount + tileSize / 2;
    let centerY = appleY * tileCount + tileSize / 2;

    // Začíná novou cestu pro kreslení kruhu
    ctx.beginPath();
    // Kreslí kruh: arc(x, y, radius, startAngle, endAngle)
    ctx.arc(centerX, centerY, tileSize / 2, 0, Math.PI * 2);
    // Vykreslí vyplněný kruh
    ctx.fill();



}
/**
 * Kontroluje, zda došlo ke kolizi hlavy hada s jablkem. Pokud ano, aktualizuje
 * pozici jablka a zvyšuje délku těla hada a skóre hráče.
 */
function checkAppleCollision() {
    // Kontrola, zda se pozice hlavy hada shoduje s pozicí jablka
    if(appleX === headX && appleY == headY) {
        // Pokud ano, generujeme novou pozici pro jablko
        // Math.random() vrací náhodné číslo mezi 0 a 1
        // Násobíme toto číslo počtem dlaždic (tileCount) a zaokrouhlíme dolů
        // Tím získáme náhodnou pozici na mřížce
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);

        // Zvýšíme délku hada o jednu, protože snědl jablko
        tailLength++;

        // Zvýšíme skóre hráče o jedna
        score++;
        // zvisime rychlost kazdejch 5 jablek
        if(score % 5 === 0) {
            speed += 1;
        }
    }
}

// Ovládání hada klávesnicí
document.body.addEventListener('keydown', keyDown);
/**
 * Ošetřuje události stisku kláves pro ovládání směru pohybu hada.
 * @param {KeyboardEvent} event Událost stisku klávesy.
 */
function keyDown(event) {
    // Pohyb nahoru
    if(event.keyCode == 38) {
        if(yVelocity == 1)
            return;
        yVelocity = -1;
        xVelocity = 0;
    }

    // Pohyb dolů
    if(event.keyCode == 40) {
        if(yVelocity == -1)
            return;
        yVelocity = 1;
        xVelocity = 0;
    }

    // Pohyb vlevo
    if(event.keyCode == 37) {
        if(xVelocity == 1)
            return;
        yVelocity = 0;
        xVelocity = -1;
    }

    // Pohyb vpravo
    if(event.keyCode == 39) {
        if(xVelocity == -1)
            return;
        yVelocity = 0;
        xVelocity = 1;
    }
}

// Definice části hada
class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Restartuje hru do počátečního stavu. Resetuje všechny herní proměnné a
 * spouští hru od začátku.
 */
function restartGame() {
    // Reset stavu hry
    headX = 10;
    headY = 10;
    xVelocity = 0;
    yVelocity = 0;
    tailLength = 1;
    score = 0;
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    speed = 2;
    gameOver = false; // Důležité: reset stavu 'gameOver'
    // Restart hry
    drawSnake();
        clearScreen();
        drawGame();

}

// Připojení události kliknutí k tlačítku
document.getElementById('restartButton').onclick = restartGame;

// Spustí hru
drawGame();
