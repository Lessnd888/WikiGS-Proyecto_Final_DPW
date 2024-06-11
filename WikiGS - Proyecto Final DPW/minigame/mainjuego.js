const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game;
let catcher;
let fruits;
let cursors;
let score = 0;
let scoreText;
let lives = 3;
let livesText;
let fruitTimer;
let gameOver = false;
let backgroundMusic;
let victoryMusic;
let defeatMusic;
let goodFruitSound;
let badFruitSound;

document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('instructions').style.display = 'none';
    game = new Phaser.Game(config);
});

document.getElementById('retry-button').addEventListener('click', () => {
    location.reload();
});

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('game-over-modal').style.display = 'none';
});

function showModal(message) {
    document.getElementById('modal-text').innerText = message;
    document.getElementById('game-over-modal').style.display = 'block';
}

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('catcher', 'assets/path_to_catcher_image.png');
    this.load.image('fruit', 'assets/path_to_fruit_image.png');
    this.load.image('badFruit', 'assets/path_to_bad_fruit_image.png');
    this.load.audio('backgroundMusic', 'assets/path_to_background_music.mp3');
    this.load.audio('victoryMusic', 'assets/path_to_victory_music.mp3');
    this.load.audio('defeatMusic', 'assets/path_to_defeat_music.mp3');
    this.load.audio('goodFruitSound', 'assets/path_to_good_fruit_sound.mp3');
    this.load.audio('badFruitSound', 'assets/path_to_bad_fruit_sound.mp3');
}

function create() {
    this.add.image(400, 300, 'sky');
    backgroundMusic = this.sound.add('backgroundMusic');
    backgroundMusic.loop = true;
    backgroundMusic.setVolume(0.2);
    backgroundMusic.play();

    victoryMusic = this.sound.add('victoryMusic');
    victoryMusic.setVolume(0.5);
    defeatMusic = this.sound.add('defeatMusic');
    goodFruitSound = this.sound.add('goodFruitSound');
    badFruitSound = this.sound.add('badFruitSound');
    badFruitSound.setVolume(1.0);

    catcher = this.physics.add.sprite(400, 550, 'catcher').setCollideWorldBounds(true);
    catcher.setScale(0.3);

    fruits = this.physics.add.group({
        runChildUpdate: true
    });

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
    livesText = this.add.text(16, 50, 'Lives: ' + lives, { fontSize: '32px', fill: '#fff' });

    fruitTimer = this.time.addEvent({
        delay: 1000,
        callback: dropFruit,
        callbackScope: this,
        loop: true
    });

    this.physics.add.overlap(catcher, fruits, collectFruit, null, this);
}

function update() {
    if (gameOver) return;

    let speed = 300;
    if (cursors.up.isDown) {
        speed *= 1.3;
    }

    if (cursors.left.isDown) {
        catcher.setVelocityX(-speed);
        catcher.setFlipX(true);
    } else if (cursors.right.isDown) {
        catcher.setVelocityX(speed);
        catcher.setFlipX(false);
    } else {
        catcher.setVelocityX(0);
    }
}

function dropFruit() {
    if (gameOver) return;

    const x = Phaser.Math.Between(50, 750);
    const type = Phaser.Math.Between(0, 1);
    let fruit;
    if (type === 0) {
        fruit = fruits.create(x, 0, 'fruit');
        fruit.setData('type', 'good');
        fruit.setScale(0.09);
    } else {
        fruit = fruits.create(x, 0, 'badFruit');
        fruit.setData('type', 'bad');
        fruit.setScale(0.15);
    }
    fruit.setVelocityY(Phaser.Math.Between(200, 200));
    fruit.checkWorldBounds = true;
    fruit.outOfBoundsKill = true;
    fruit.update = function() {
        if (this.y > 600) {
            if (this.getData('type') === 'good') {
                this.disableBody(true, true);
                loseLife(this.scene);
            } else if (this.getData('type') === 'bad') {
                this.disableBody(true, true);
            }
        }
    }
}

function collectFruit(catcher, fruit) {
    fruit.disableBody(true, true);

    if (fruit.getData('type') === 'good') {
        score += 1;
        scoreText.setText('Score: ' + score);
        goodFruitSound.play();

        if (score >= 15) {
            endGame(this, '¡GANASTE! Puntaje: ' + score, true);
        }
    } else if (fruit.getData('type') === 'bad') {
        badFruitSound.play();
        loseLife(this);
    }
}

function loseLife(scene) {
    lives -= 1;
    livesText.setText('Lives: ' + lives);

    if (lives <= 0) {
        endGame(scene, 'GAME OVER! Puntaje: ' + score, false);
    }
}

function endGame(scene, message, victory) {
    gameOver = true;
    backgroundMusic.stop();
    scene.physics.pause();
    fruitTimer.remove(false);
    fruits.clear(true, true);
    if (victory) {
        victoryMusic.play();
    } else {
        defeatMusic.play();
    }
    showModal(message);
}
