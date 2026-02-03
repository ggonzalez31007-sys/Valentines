// ----- Phaser game configuration -----
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: 0xffb6c1, // pink background
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 500 }, debug: false } // no debug boxes
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Create Phaser game
const game = new Phaser.Game(config);

// ----- Global variables -----
let player;
let cursors;
let platforms;
let background;
let keroppi;
let keroppiText;

// Variable jump
let isJumping = false;
let jumpTime = 0;
const maxJumpTime = 300; // max ms you can hold jump

// ----- Preload assets -----
function preload() {
    // Background
    this.load.image('background', 'assets/backgrounds/background.png');

    // Platforms
    this.load.image('platform', 'assets/platforms/platform.png');

    // Player
    this.load.spritesheet('kitty', 'assets/characters/hello-kitty.png', {
        frameWidth: 32,
        frameHeight: 48
    });

    // Keroppi
    this.load.image('keroppi', 'assets/characters/kerropi.png');
}

// ----- Create game objects -----
function create() {
    // Background
    background = this.add.image(400, 300, 'background');
    background.setOrigin(0.5, 0.5);

    // Platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 580, 'platform').setScale(2).refreshBody(); // ground
    platforms.create(200, 450, 'platform'); // floating
    platforms.create(600, 350, 'platform'); // floating

    // Player
    player = this.physics.add.sprite(100, 500, 'kitty');
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('kitty', { start: 1, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    this.physics.add.collider(player, platforms);

    // Keroppi
    keroppi = this.physics.add.staticSprite(600, 520, 'keroppi');
    keroppiText = this.add.text(keroppi.x, keroppi.y - 50, "Find your boyfriend!", {
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setVisible(false);

    // Input keys
    cursors = this.input.keyboard.addKeys({
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
        sprint: Phaser.Input.Keyboard.KeyCodes.SHIFT
    });
}

// ----- Game loop -----
function update() {
    // Horizontal movement
    let speed = cursors.sprint.isDown ? 320 : 160;
    player.setVelocityX(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-speed);
        player.anims.play('walk', true);
        player.setFlipX(true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(speed);
        player.anims.play('walk', true);
        player.setFlipX(false);
    } else {
        player.anims.stop();
    }

    // Variable jump
    if (cursors.jump.isDown && player.body.touching.down && !isJumping) {
        player.setVelocityY(-330); // initial jump
        isJumping = true;
        jumpTime = 0;
    }

    if (cursors.jump.isDown && isJumping) {
        jumpTime += this.game.loop.delta;
        if (jumpTime < maxJumpTime) {
            player.setVelocityY(-330); // continue upward while holding
        }
    }

    if (cursors.jump.isUp) {
        isJumping = false;
    }

    // Keroppi text trigger
    let distance = Phaser.Math.Distance.Between(player.x, player.y, keroppi.x, keroppi.y);
    keroppiText.setVisible(distance < 100);
}
