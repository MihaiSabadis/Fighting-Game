function rectangularCollision({ rectangle1, rectangle2 }) {

    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle2.attackBox.position.x + rectangle2.attackBox.width >= rectangle1.position.x &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}

function setVelocity({ left, right, actor }) {

    let rightKey, leftKey;

    if (actor === player) {
        rightKey = 'd'
        leftKey = 'a'
    }
    else {
        rightKey = 'l'
        leftKey = 'j'
    }

    actor.velocity.x = 0
    if (left.pressed && actor.lastKey === leftKey) {
        actor.velocity.x = -5;
        actor.switchSprite('run')
    }
    else if (right.pressed && actor.lastKey === rightKey) {
        actor.velocity.x = 5;
        actor.switchSprite('run')
    }
    else {
        actor.switchSprite('idle');
    }
}

let timer = 10;
let timerId
let message = document.querySelector('#message')
function gameOver(timerId) {
    clearTimeout(timerId);

    if (player.health === enemy.health)
        message.textContent = "DRAW"
    else if (player.health > enemy.health)
        message.textContent = "PLAYER 1 WINS"
    else if (player.health < enemy.health)
        message.textContent = "PLAYER 2 WINS"
}

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }
    else { gameOver(timerId); }
}