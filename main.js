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
    scene: { preload, create, update }
};

new Phaser.Game(config);

let player;
let cursors;
let ground;

function preload() {
    // background image
    this.load.image('bg', 'assetfolder/background/background.png');

    // ground/platform tile
    this.load.image('platformTile', 'assetfolder/platforms/platform.png');

    // player sprite: CAPY
    this.load.image('capy', 'assetfolder/characters/capy.png');
}

function create() {
    // --- BACKGROUND ---
    this.add.image(400, 300, 'bg').setDepth(-10);

    // --- GROUND ---
    ground = this.physics.add.staticGroup();

    // measure platform tile
    const temp = this.add.image(0, 0, 'platformTile').setVisible(false);
    const tileW = temp.width;
    const tileH = temp.height;
    temp.destroy();

    const groundY = 600 - tileH / 2; // bottom of canvas

    // fill bottom with tiles
    for (let x = 0; x < 800; x += tileW) {
        ground.create(x + tileW / 2, groundY, 'platformTile');
    }

    // --- PLAYER ---
    player = this.physics.add.sprite(200, 200, 'capy');
    player.setScale(0.6);        // adjust size
    player.setDepth(10);         // in front of everything
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, ground);

    // input
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    player.setVelocityX(0);

    // left/right movement
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
