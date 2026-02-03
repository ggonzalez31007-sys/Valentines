const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 1800 }, debug: false }
    },
    scene: { preload, create, update }
};

new Phaser.Game(config);

let player;
let cursors;
let ground;

function preload() {
    // Background
    this.load.image('bg', 'assetfolder/background/background.png');

    // Ground platform
    this.load.image('ground', 'assetfolder/platforms/platform.png');

    // Player sprite (Capy)
    this.load.image('capy', 'assetfolder/characters/capy.png');
}

function create() {
    // BACKGROUND
    this.add.image(400, 300, 'bg').setDepth(-10);

    // GROUND - single long platform at bottom
    ground = this.physics.add.staticGroup();
    const temp = this.add.image(0, 0, 'ground').setVisible(false);
    const tileH = temp.height;
    temp.destroy();
    const groundY = 600 - tileH / 2; // bottom of canvas
    ground.create(400, groundY, 'ground');

    // PLAYER - Capy
    player = this.physics.add.sprite(200, groundY - 64, 'capy'); // spawn above ground
    player.setScale(0.6);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, ground);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    player.setVelocityX(0);

    // LEFT/RIGHT movement
    if (cursors.left.isDown) {
        player.setVelocityX(-260);
    } else if (cursors.right.isDown) {
        player.setVelocityX(260);
    }

    // JUMP
    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-760);
    }
}
