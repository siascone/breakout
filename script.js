document.addEventListener('DOMContentLoaded', () => {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');

    var ballRadius = 10;
    var x = canvas.width/2;
    var y = canvas.height-30;
    var dx = 2;
    var dy = -2

    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width-paddleWidth)/2;

    var rightPressed = false;
    var leftPressed = false;

    var brickRowCount = 3;
    var brickColumnCount = 5;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;

    var score = 0;

    var lives = 3;

    var playing = false;

    var bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = {x: 0, y: 0, status: 1};
        }
    }

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    document.addEventListener('mousemove', mouseMoveHandler, false);

    function keyDownHandler(e) {
        if (e.key == 'Right' || e.key == 'ArrowRight') {
            rightPressed = true;
        } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key == 'Right' || e.key == 'ArrowRight') {
            rightPressed = false;
        } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        let relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth/2
        }
    }

    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if (score == brickColumnCount*brickRowCount) {
                            alert('YOU WIN, CONGRATULATIONS!');
                            playing = false;
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

    function drawLives() {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#CB4154';
        ctx.fillText('Lives: '+lives, canvas.width-65, 20)
    }

    function drawScore() {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#CB4154';
        ctx.fillText("Score: "+score, 8, 20)
    }

    function drawStart() {
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        ctx.font = '28px Arial';
        ctx.fillStyle = '#CB4154';
        ctx.fillText("Click to Play", (canvas.width/2)-75, (canvas.height/2)+14)
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = '#0095DD';
        ctx.strokeStyle = 'black';
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = '#CB4154';
        ctx.strokeStyle = 'black';
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = '#CB4154';
                    ctx.strokeStyle = 'black';
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                lives--;
                if (!lives) {
                    alert('GAME OVER');
                    playing = false;
                    document.location.reload();
                } else {
                    x = canvas.width/2;
                    y = canvas.height-30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.width-paddleWidth)/2
                }
               
            }            
        }

        if (rightPressed) {
            paddleX += 5;
            if (paddleX + paddleWidth > canvas.width) {
                paddleX = canvas.width - paddleWidth;
            }
        } else if (leftPressed) {
            paddleX -= 5;
            if (paddleX < 0) {
                paddleX = 0;
            }
        }

        x += dx;
        y += dy;

        requestAnimationFrame(draw);
    }

    // var interval = setInterval(draw, 10);
    ctx.canvas.addEventListener('click', () => {
        if (!playing) {
            playing = true
            draw();
        }
    })
    drawStart();

});