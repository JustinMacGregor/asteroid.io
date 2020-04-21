let canvas;
let ctx;
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
let keys = [];
let ship;
let bullets = [];
let asteroids = [];
let score = 0;
let lives = 3;

let highScore;
let localStorageName = "HighScore";

document.addEventListener('DOMContentLoaded', SetupCanvas);

function SetupCanvas(){
    canvas = document.getElementById("asteroid-canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    //ctx.lineWidth = 5;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);



    ship = new Ship();

    for(let i = 0; i < 8; i++){
        asteroids.push(new Asteroid());
    }

    document.body.addEventListener("keydown", HandleKeyDown);
    document.body.addEventListener("keyup", HandleKeyUp);

    // Retrieves locally stored high scores
    if (localStorage.getItem(localStorageName) == null) {
        highScore = 0;
    } else {
        highScore = localStorage.getItem(localStorageName);
    }

    Render();
}

function handleDeath(){
    ship.x = canvasWidth / 2;
    ship.y = canvasHeight / 2;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ship.velX = 0;
    ship.velY = 0;
    lives -= 1;
    ship.numBlinks = Math.ceil (5 / 0.1);
}

function HandleKeyDown(e){
    keys[e.keyCode] = true;
}

function HandleKeyUp(e){
    keys[e.keyCode] = false;
}

const gun = {
    fireRate : 80,
    nextShotIn : 0,
    update() {
        if(this.nextShotIn > 0){
            this.nextShotIn -= 1;
        }
    },
    fire(){
        if(this.nextShotIn === 0){
            fireRate = ship.fireRate;
            bullets.push(new Bullet(ship.angle));
            this.nextShotIn = this.fireRate;
        }
    }
}



class Ship {
    constructor() {
        this.visible = true;
        this.fireRate = 80;
        this.numBlinks = Math.ceil (5 / 0.1);
        this.blinkTime = Math.ceil (0.1 * 30);
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.movingForward = false;
        this.speed = 0.1;
        this.velX = 0;
        this.velY = 0;
        this.rotateSpeed = 0.001;
        this.radius = 15;
        this.angle = 0;
        this.strokeColor = 'white';
        // Used to know where to fire the bullet from
        this.noseX = canvasWidth / 2 + 15;
        this.noseY = canvasHeight / 2;
    }
    Rotate(dir) {
        this.angle += this.rotateSpeed * dir;
    }
    Update() {
        // Get current direction ship is facing
        let radians = this.angle / Math.PI * 180;

        // If moving forward calculate changing values of x & y
        // If you want to find the new point x use the
        // formula oldX + cos(radians) * distance
        // Forumla for y oldY + sin(radians) * distance
        if (this.movingForward) {
            this.velX += Math.cos(radians) * this.speed;
            this.velY += Math.sin(radians) * this.speed;

        }
        // If ship goes off board place it on the opposite
        // side
        if (this.x < this.radius) {
            handleDeath();
        }
        if (this.x > canvas.width) {
            handleDeath();
        }
        if (this.y < this.radius) {
            handleDeath();
        }
        if (this.y > canvas.height) {
            handleDeath();
        }
        // Slow ship speed when not holding key

        ctx.translate(this.x,this.y);
        this.velX *= 0.99;
        this.velY *= 0.99;

        // Change value of x & y while accounting for
        // air friction
        this.x -= this.velX;
        this.y -= this.velY;

        ctx.translate(-this.x, -this.y);
        ctx.strokeStyle = "white";
        ctx.strokeRect(1, 1, canvas.width-2, canvas.height-2);

    }
    Draw() {
        let blinking = this.numBlinks % 2 == 0;

        if (blinking) {
            ctx.strokeStyle = this.strokeColor;
            ctx.beginPath();
            // Angle between vertices of the ship
            let vertAngle = ((Math.PI * 2) / 3);

            let radians = this.angle / Math.PI * 180;
            // Where to fire bullet from
            this.noseX = this.x - this.radius * Math.cos(radians);
            this.noseY = this.y - this.radius * Math.sin(radians);

            for (let i = 0; i < 3; i++) {
                ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
            }
            ctx.closePath();
            ctx.stroke();
        }

        if (this.numBlinks > 0) {
            this.blinkTime--;
            if (this.blinkTime == 0){
                this.blinkTime = Math.ceil (0.1 * 30);
                this.numBlinks--;
            }
        }
    }
}



class Bullet{
    constructor(angle) {
        this.visible = true;
        this.x = ship.noseX;
        this.y = ship.noseY;
        this.angle = angle;
        this.height = 4;
        this.width = 4;
        this.speed = 5;
        this.velX = 0;
        this.velY = 0;
    }
    Update(){
        let radians = this.angle / Math.PI * 180;
        this.x -= Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed;
    }
    Draw(){
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}

class Asteroid{
    constructor(x,y,radius,level,collisionRadius) {
        this.visible = true;
        this.x = x || Math.floor(Math.random() * canvasWidth);
        this.y = y || Math.floor(Math.random() * canvasHeight);
        this.speed = 1;
        this.radius = radius || 50;
        this.angle = Math.floor(Math.random() * 359);
        this.strokeColor = 'white';
        this.collisionRadius = collisionRadius || 46;
        // Used to decide if this asteroid can be broken into smaller pieces
        this.level = level || 1;
    }
    Update(){
        let radians = this.angle / Math.PI * 180;
        this.x += Math.cos(radians) * this.speed;
        this.y += Math.sin(radians) * this.speed;
        if (this.x < this.radius) {
            this.x = canvas.width;
        }
        if (this.x > canvas.width) {
            this.x = this.radius;
        }
        if (this.y < this.radius) {
            this.y = canvas.height;
        }
        if (this.y > canvas.height) {
            this.y = this.radius;
        }
    }
    Draw(){
        ctx.beginPath();
        let vertAngle = ((Math.PI * 2) / 6);
        var radians = this.angle / Math.PI * 180;
        for(let i = 0; i < 6; i++){
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        ctx.closePath();
        if (this.level == 4){
            ctx.strokeStyle = 'yellow';
            ctx.fillstyle = 'yellow';
            ctx.fill();
        }
        else{
            ctx.strokeStyle = 'white';
        }
        ctx.stroke();
    }
}

function CircleCollision(p1x, p1y, r1, p2x, p2y, r2){
    let radiusSum;
    let xDiff;
    let yDiff;

    radiusSum = r1 + r2;
    xDiff = p1x - p2x;
    yDiff = p1y - p2y;

    if (radiusSum > Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))) {
        return true;
    } else {
        return false;
    }
}

// Handles drawing life ships on screen
function DrawLifeShips(){
    let startX = 1350;
    let startY = 10;
    let points = [[9, 9], [-9, 9]];
    ctx.strokeStyle = 'white'; // Stroke color of ships
    // Cycle through all live ships remaining
    for(let i = 0; i < lives; i++){
        // Start drawing ship
        ctx.beginPath();
        // Move to origin point
        ctx.moveTo(startX, startY);
        // Cycle through all other points
        for(let j = 0; j < points.length; j++){
            ctx.lineTo(startX + points[j][0],
                startY + points[j][1]);
        }
        // Draw from last point to 1st origin point
        ctx.closePath();
        // Stroke the ship shape white
        ctx.stroke();
        // Move next shape 30 pixels to the left
        startX -= 30;
    }
}

function Render() {
    // Check if the ship is moving forward
    ship.movingForward = (keys[87]);

    gun.update();

    if (keys[68]) {
        // d key rotate right
        ship.Rotate(1);
    }
    if (keys[65]) {
        // a key rotate left
        ship.Rotate(-1);
    }

    if (keys[32]){
        gun.fire();
    }


    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Display score
    ctx.fillStyle = 'white';
    ctx.font = '21px Arial';
    ctx.fillText("SCORE : " + score.toString(), 20, 35);

    // If no lives signal game over
    if(lives <= 0){
        // If Game over remove event listeners to stop getting keyboard input
        document.body.removeEventListener("keydown", HandleKeyDown);
        document.body.removeEventListener("keyup", HandleKeyUp);

        ship.visible = false;
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.fillText("GAME OVER", canvasWidth / 2 - 150, canvasHeight / 2);
    }


    if(asteroids.length === 0){
        ship.x = canvasWidth / 2;
        ship.y = canvasHeight / 2;
        ship.velX = 0;
        ship.velY = 0;
        for(let i = 0; i < 8; i++){
            let asteroid = new Asteroid();
            asteroid.speed += .5;
            asteroids.push(asteroid);
        }
    }


    DrawLifeShips();

    // collision of ship with asteroid
    if (asteroids.length !== 0 && ship.numBlinks == 0) {
        for(let k = 0; k < asteroids.length; k++){
            if(CircleCollision(ship.x, ship.y, 11, asteroids[k].x, asteroids[k].y, asteroids[k].collisionRadius)){
                if (asteroids[k].level == 4){
                    asteroids.splice(k,1);
                    score += 20;
                }
                else{
                    handleDeath();
                }
            }
        }
    }

    //collision with bullet and asteroid
    if (asteroids.length !== 0 && bullets.length != 0){
        loop1:
            for(let l = 0; l < asteroids.length; l++){
                for(let m = 0; m < bullets.length; m++){
                    if(CircleCollision(bullets[m].x, bullets[m].y, 3, asteroids[l].x, asteroids[l].y, asteroids[l].collisionRadius)){
                        // Check if asteroid can be broken into smaller pieces
                        if(asteroids[l].level === 1){
                            asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 25, 2, 22));
                            asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 25, 2, 22));
                            asteroids.splice(l,1);
                            bullets.splice(m,1);
                        } else if(asteroids[l].level === 2){
                            asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 15, 3, 12));
                            asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 15, 3, 12));
                            asteroids.splice(l,1);
                            bullets.splice(m,1);
                        }else if(asteroids[l].level === 3){
                            asteroid1 = new Asteroid(asteroids[l].x - 2, asteroids[l].y - 5, 5, 4, 6);
                            asteroid1.speed = 0.1;
                            asteroids.push(asteroid1);
                            asteroid2 = new Asteroid(asteroids[l].x + 2, asteroids[l].y + 5, 5, 4, 6);
                            asteroid2.speed = 0.1;
                            asteroids.push(asteroid2);
                            asteroid3 = new Asteroid(asteroids[l].x - 4, asteroids[l].y - 5, 5, 4, 6);
                            asteroid3.speed = 0.1;
                            asteroids.push(asteroid3);
                            asteroid4 = new Asteroid(asteroids[l].x + 4, asteroids[l].y + 5, 5, 4, 6);
                            asteroid4.speed = 0.1
                            asteroids.push(asteroid4);
                            asteroids.splice(l,1);
                            bullets.splice(m,1);
                        }

                        // Used to break out of loops because splicing arrays
                        // you are looping through will break otherwise
                        break loop1;
                    }
                }
            }
    }

    if(ship.visible){
        ship.Update();
        ship.Draw();
    }

    if (bullets.length !== 0) {
        for(let i = 0; i < bullets.length; i++){
            bullets[i].Update();
            bullets[i].Draw();
        }
    }
    if (asteroids.length !== 0) {
        for(let j = 0; j < asteroids.length; j++){
            asteroids[j].Update();
            asteroids[j].Draw(j);
        }
    }

    // Updates the high score using local storage
    highScore = Math.max(score, highScore);
    localStorage.setItem(localStorageName, highScore);
    ctx.font = '21px Arial';
    ctx.fillText("HIGH SCORE : " + highScore.toString(), 20, 70);

    requestAnimationFrame(Render);
}