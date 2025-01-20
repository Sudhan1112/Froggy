document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid");
    const timerElement = document.getElementById("timer");
    const startPauseButton = document.getElementById("start-pause-button");

    const cells = [];
    const numRows = 10;
    const numCols = 10;

    let frogPosition = 94; // Initial frog position (starting block)
    let timer = 30; // Initial countdown timer
    let intervalId;
    let gameRunning = false;

    // Create the grid dynamically
    for (let i = 0; i < numRows * numCols; i++) {
        const cell = document.createElement("div");
        grid.appendChild(cell);
        cells.push(cell);
    }

    // Define cars, logs, and starting/ending blocks
    const cars = [21, 22, 23, 31, 32, 33]; // Position of cars (red blocks)
    const logs = [41, 42, 43, 51, 52, 53]; // Position of logs (blue blocks)
    const startingBlock = 94;
    const endingBlock = 4;

    // Add special blocks to the grid
    cells[startingBlock].classList.add("starting-block");
    cells[endingBlock].classList.add("ending-block");

    // Initialize frog position
    cells[frogPosition].classList.add("frog");

    // Add cars and logs
    cars.forEach((car) => cells[car].classList.add("car"));
    logs.forEach((log) => cells[log].classList.add("log"));

    // Move frog with arrow keys
    document.addEventListener("keydown", (e) => {
        if (!gameRunning) return;

        cells[frogPosition].classList.remove("frog");

        switch (e.key) {
            case "ArrowUp":
                if (frogPosition - numCols >= 0) frogPosition -= numCols;
                break;
            case "ArrowDown":
                if (frogPosition + numCols < numRows * numCols) frogPosition += numCols;
                break;
            case "ArrowLeft":
                if (frogPosition % numCols !== 0) frogPosition -= 1;
                break;
            case "ArrowRight":
                if (frogPosition % numCols !== numCols - 1) frogPosition += 1;
                break;
        }

        cells[frogPosition].classList.add("frog");
        checkGameStatus();
    });

    // Move cars to the left
    function moveCars() {
        cars.forEach((car, index) => {
            cells[car].classList.remove("car");
            cars[index] = car % numCols === 0 ? car + (numCols - 1) : car - 1;
            cells[cars[index]].classList.add("car");
        });
    }

    // Move logs to the right
    function moveLogs() {
        logs.forEach((log, index) => {
            cells[log].classList.remove("log");
            logs[index] = log % numCols === numCols - 1 ? log - (numCols - 1) : log + 1;
            cells[logs[index]].classList.add("log");
        });
    }

    // Check game status: Win or Lose
    function checkGameStatus() {
        if (frogPosition === endingBlock) {
            clearInterval(intervalId);
            alert("You win!");
            resetGame();
        } else if (
            cells[frogPosition].classList.contains("car") || // Collided with car
            (cells[frogPosition].classList.contains("log") === false &&
                frogPosition < numCols * 6 &&
                frogPosition >= numCols * 4) // Fell into river
        ) {
            clearInterval(intervalId);
            alert("You lose!");
            resetGame();
        }
    }

    // Timer countdown
    function updateTimer() {
        timer--;
        timerElement.textContent = `Time: ${timer}s`;
        if (timer <= 0) {
            clearInterval(intervalId);
            alert("Time's up! You lose!");
            resetGame();
        }
    }

    // Start or pause the game
    startPauseButton.addEventListener("click", () => {
        if (gameRunning) {
            clearInterval(intervalId);
            startPauseButton.textContent = "Start";
            gameRunning = false;
        } else {
            intervalId = setInterval(() => {
                moveCars();
                moveLogs();
                updateTimer();
            }, 500);
            startPauseButton.textContent = "Pause";
            gameRunning = true;
        }
    });

    // Reset the game
    function resetGame() {
        clearInterval(intervalId);
        gameRunning = false;
        timer = 30;
        timerElement.textContent = `Time: ${timer}s`;
        startPauseButton.textContent = "Start";

        // Reset frog position
        cells[frogPosition].classList.remove("frog");
        frogPosition = startingBlock;
        cells[frogPosition].classList.add("frog");
    }
});
