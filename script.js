const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRAVITY = 0.6;
const FLAP_STRENGTH = -15;
const SPAWN_RATE = 90; // Pipe spawn rate (frames)
const PIPE_WIDTH = 60;
const PIPE_SPACING = 300; // Distance between pipes

let bird = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: GRAVITY,
    flap: FLAP_STRENGTH,
};

let pipes = [];
let score = 0;
let isGameOver = false;

// Set canvas size
canvas.width = 400;
canvas.height = 600;

// Handle keyboard input for PC
document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !isGameOver) {
        bird.velocity = bird.flap; // Bird flaps on spacebar
    } else if (isGameOver && event.code === "Enter") {
        resetGame(); // Restart game on Enter when it's over
    }
});

// Handle touch input for mobile
document.addEventListener("touchstart", function(event) {
    if (!isGameOver) {
        bird.velocity = bird.flap; // Bird flaps on touch
    } else {
        event.preventDefault(); // Prevent scrolling on touch when game is over
    }
});

// Prevent scrolling on touchmove for mobile devices
document.addEventListener("touchmove", function(event) {
    if (isGameOver) {
        event.preventDefault(); // Prevent scroll on game over
    }
});

// Optional: Restart game on touchend (for mobile)
document.addEventListener("touchend", function(event) {
    if (isGameOver) {
        resetGame(); // Restart game on touch end when it's over
    }
});

// Update game objects (bird and pipes)
function update() {
    if (isGameOver) return;

    // Bird physics
    bird.velocity += bird.gravity; // Apply gravity to the bird's velocity
    bird.y += bird.velocity; // Update bird's position

    // Move pipes and detect collision with bird
    if (pipes.length > 0) {
        pipes.forEach((pipe, index) => {
            pipe.x -= 3; // Move pipes leftward

            // Detect collision with bird
            if (
                bird.x + bird.width > pipe.x &&
                bird.x < pipe.x + PIPE_WIDTH &&
                (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
            ) {
                isGameOver = true; // Collision detected, end game
            }

            // Remove pipes that have passed the screen
            if (pipe.x + PIPE_WIDTH < 0) {
                pipes.splice(index, 1);
                score++; // Increment score when pipes pass
            }
        });
    }

    // Add new pipes at intervals
    if (Math.random() < 1 / SPAWN_RATE) {
        const pipeHeight = Math.floor(Math.random() * (canvas.height / 2)) + 50;
        pipes.push({
            x: canvas.width,
            top: pipeHeight,
            bottom: pipeHeight + PIPE_SPACING,
        });
    }

    // Check for ground or ceiling collision
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        isGameOver = true; // End game if bird hits ground or ceiling
    }
}

// Draw game objects (bird, pipes, score, etc.)
function draw() {
    // Clear the canvas and set background color
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the bird
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Draw pipes
    ctx.fillStyle = "#32CD32";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top); // Top pipe
        ctx.fillRect(pipe.x, pipe.bottom, PIPE_WIDTH, canvas.height - pipe.bottom); // Bottom pipe
    });

    // Draw score
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    // Draw Game Over message
    if (isGameOver) {
        ctx.fillStyle = "#000";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", canvas.width / 4, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Tap to Restart", canvas.width / 3.5, canvas.height / 1.5); // Mobile-friendly restart message
    }
}

// Reset the game to the initial state
function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    isGameOver = false;
}

// Main game loop (update and draw continuously)
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop); // Keep the game loop going
}

// Start the game
gameLoop();
