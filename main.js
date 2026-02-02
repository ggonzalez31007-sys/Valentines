// ----- Phaser game configuration -----
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 500 }, debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Create Phaser game
const game = new Phaser.Game(config);

let player;
let cursors;

// ----- Load assets -----
function preload() {
    // Load your Hello Kitty PNG
    this.load.spritesheet('kitty', 'assets/characters/hello-kitty.png', { frameWidth: 32, frameHeight: 48 });
}

// ----- Create game objects -----
function create() {
    // Add player sprite
    player = this.physics.add.sprite(400, 500, 'kitty');
    player.setCollideWorldBounds(true);

    // Create simple walk animation
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('kitty', { start: 1, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    // Input: cursor keys
    cursors = this.input.keyboard.createCursorKeys();
}

// ----- Game loop -----
function update() {
    player.setVelocityX(0);

    // Left/right movement
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('walk', true);
        player.setFlipX(true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('walk', true);
        player.setFlipX(false);
    } else {
        player.anims.stop();
    }

    // Jump
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}
