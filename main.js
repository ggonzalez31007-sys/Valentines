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
    this.load.image('bg', 'assetfolder/background/background.png');
    this.load.image('ground', 'assetfolder/platforms/platform.png');
    this.load.image('capy', 'assetfolder/characters/capy.png');
}

function create() {
    // BACKGROUND (always behind)
    this.add.image(400, 300, 'bg').setDepth(-10);

    // GROUND — full bottom like classic Mario
    ground = this.physics.add.staticGroup();

    const temp = this.add.image(0, 0, 'ground').setVisible(false);
    const tileW = temp.width;
    const tileH = temp.height;
    temp.destroy();

    const groundY = 600 - tileH / 2;

    for (let x = 0; x < 800; x += tileW) {
        ground.create(x + tileW / 2, groundY, 'ground');
    }

    // PLAYER — CAPY, forced visible
    player = this.physics.add.sprite(400, 200, 'capy');
    player.setScale(0.6);
    player.setDepth(10);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, ground);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    player.setVelocityX(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-260);
    } else if (cursors.right.isDown) {
        player.setVelocityX(260);
    }

    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-760);
    }
}
