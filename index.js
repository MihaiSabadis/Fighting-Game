
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);


const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/images/background.png'
})
const shop = new Sprite({
    position: {
        x: 600,
        y: 122
    },
    imageSrc: './assets/images/shop.png',
    scale: 2.8,
    numFrames: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/samuraiMack/Idle.png',
    numFrames: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './assets/samuraiMack/Idle.png',
            numFrames: 8
        },
        run: {
            imageSrc: './assets/samuraiMack/Run.png',
            numFrames: 8
        },
        jump: {
            imageSrc: './assets/samuraiMack/Jump.png',
            numFrames: 2
        },
        fall: {
            imageSrc: './assets/samuraiMack/Fall.png',
            numFrames: 2
        },
        attack1: {
            imageSrc: './assets/samuraiMack/Attack1.png',
            numFrames: 6
        },
        takeHit: {
            imageSrc: './assets/samuraiMack/TakeHitWhite.png',
            numFrames: 4
        },
        death: {
            imageSrc: './assets/samuraiMack/Death.png',
            numFrames: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 150,
        height: 50
    }
});
const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './assets/kenji/Idle.png',
    numFrames: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './assets/kenji/Idle.png',
            numFrames: 4
        },
        run: {
            imageSrc: './assets/kenji/Run.png',
            numFrames: 8
        },
        jump: {
            imageSrc: './assets/kenji/Jump.png',
            numFrames: 2
        },
        fall: {
            imageSrc: './assets/kenji/Fall.png',
            numFrames: 2
        },
        attack1: {
            imageSrc: './assets/kenji/Attack1.png',
            numFrames: 4
        },
        takeHit: {
            imageSrc: './assets/kenji/Take Hit.png',
            numFrames: 3
        },
        death: {
            imageSrc: './assets/kenji/Death.png',
            numFrames: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
});

player.draw()
enemy.draw()

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    j: {
        pressed: false,
    },
    i: {
        pressed: false,
    },
    l: {
        pressed: false,
    }
}



decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    background.update();
    shop.update();
    c.fillStyle = 'rgba(255,255,255,0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update();
    enemy.update();

    //for player
    setVelocity({ left: keys.a, right: keys.d, actor: player });
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    }
    else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }
    //for enemy
    setVelocity({ left: keys.j, right: keys.l, actor: enemy });
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    }
    else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    //detect collision & enemy gets hit
    if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
        player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
        enemy.takeHit();
        gsap.to('#eHealth', {
            width: enemy.health + '%'
        })

    }

    //detect collision & player gets hit
    if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
        enemy.isAttacking && player.framesCurrent === 2) {
        enemy.isAttacking = false;
        player.takeHit();
        gsap.to('#pHealth', {
            width: player.health + '%'
        })
    }

    //if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }


    //end game based on health
    if (enemy.health <= 0) {
        enemy.handleDeath();
    }
    else if (player.health <= 0) {
        player.handleDeath();
    }
}

animate();

window.addEventListener('keydown', (event) => {
    if (!player.isDead)
        switch (event.key) {
            case 'w': keys.w.pressed = true;
                if (player.velocity.y === 0) { player.velocity.y = -20; } break;
            case 'a': keys.a.pressed = true; player.lastKey = 'a'; break;
            case 'd': keys.d.pressed = true; player.lastKey = 'd'; break;
            case 's': player.attack(); break;
        }

    if (!enemy.isDead)
        switch (event.key) {
            case 'i': keys.w.pressed = true;
                if (enemy.velocity.y === 0) { enemy.velocity.y = -20; } break;
            case 'j': keys.j.pressed = true; enemy.lastKey = 'j'; break;
            case 'l': keys.l.pressed = true; enemy.lastKey = 'l'; break;
            case 'k': enemy.attack(); break;
        }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        //for player
        case 'w': keys.w.pressed = false; break;
        case 'a': keys.a.pressed = false; break;
        case 'd': keys.d.pressed = false; break;

        //for enemy
        case 'i': keys.i.pressed = false; break;
        case 'j': keys.j.pressed = false; break;
        case 'l': keys.l.pressed = false; break;
    }
})