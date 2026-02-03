const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200 },
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let platforms;

function preload() {
    // BACKGROUND
    this.load.image('background', 'assets_characters/background/background.png');

    // PLATFORM
    this.load.image('platform', 'assets_characters/platforms/platform.png');

    // PLAYER
    this.load.image('kitty', 'assets_characters/hello-kitty.png');
}

function create() {
    // BACKGROUND
    this.add.image(400, 300, 'background');

    // MARIO-STYLE GROUND
    platforms = this.physics.add.staticGroup();

    // Create a full row of platforms along the bottom
    const tileWidth = 64; // adjust to match your platform.png width
    for (let x = 0; x < 800; x += tileWidth) {
        platforms.create(x + tileWidth / 2, 568, 'platform'); // y = 568 so player stands on it
    }

    // PLAYER
    player = this.physics.add.sprite(100, 450, 'kitty');
    player.setCollideWorldBounds(true);

    // COLLISION
    this.physics.add.collider(player, platforms);

    // INPUT
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (!player) return;

    player.setVelocityX(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-250);
    } else if (cursors.right.isDown) {
        player.setVelocityX(250);
    }

    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-500);
    }
}
