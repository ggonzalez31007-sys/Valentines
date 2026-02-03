const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 900 },
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
    this.load.image(
        'background',
        'asset folder/characters/background/background.png'
    );

    this.load.image(
        'platform',
        'asset folder/characters/platforms/platform.png'
    );

    // IMPORTANT: Kitty is a NORMAL IMAGE, NOT spritesheet
    this.load.image(
        'kitty',
        'asset folder/characters/hello-kitty.png'
    );
}

function create() {
    // Background
    this.add.image(400, 300, 'background');

    // Platforms group
    platforms = this.physics.add.staticGroup();

    // Mario-style wide ground
    for (let x = 0; x < 1600; x += 64) {
        platforms.create(x, 568, 'platform').setOrigin(0, 0).refreshBody();
    }

    // Player (NOW VISIBLE)
    player = this.physics.add.sprite(100, 450, 'kitty');
    player.setScale(1);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (!player) return;

    player.setVelocityX(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-220);
    } else if (cursors.right.isDown) {
        player.setVelocityX(220);
    }

    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-500);
    }
}
