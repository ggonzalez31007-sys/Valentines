const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1800 },
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

new Phaser.Game(config);

let player;
let cursors;
let ground;

function preload() {
    // background
    this.load.image('bg', 'assetfolder/background/background.png');

    // ground tile
    this.load.image('ground', 'assetfolder/platforms/platform.png');

    // player sprite
    this.load.image('player', 'assetfolder/characters/hello-kitty.png');
}

function create() {
    // --- BACKGROUND ---
    this.add.image(400, 300, 'bg').setDepth(0);

    // --- GROUND (FULL BOTTOM, MARIO STYLE) ---
    ground = this.physics.add.staticGroup();

    // safely measure tile size
    const temp = this.add.image(0, 0, 'ground').setVisible(false);
    const tileWidth = temp.width;
    const tileHeight = temp.height;
    temp.destroy();

    // IMPORTANT: tile bottom touches canvas bottom
    const groundY = 600 - tileHeight / 2;

    for (let x = 0; x < 800; x += tileWidth) {
        ground.create(x + tileWidth / 2, groundY, 'ground');
    }

    // --- PLAYER ---
    player = this.physics.add.sprite(
        120,
        groundY - tileHeight,
        'player'
    );

    player.setScale(0.6);          // protects against oversized PNGs
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, ground);

    // input
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    player.setVelocityX(0);

    // left / right
    if (cursors.left.isDown) {
        player.setVelocityX(-260);
    } else if (cursors.right.isDown) {
        player.setVelocityX(260);
    }

    // jump (Mario-style)
    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-760);
    }
}
