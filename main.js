const config = {
    type: Phaser.AUTO,
    parent: 'game-container', // CRITICAL
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
let ground;

function preload() {
    this.load.image(
        'background',
        'asset folder/characters/background/background.png'
    );

    this.load.image(
        'platform',
        'asset folder/characters/platforms/platform.png'
    );

    this.load.image(
        'kitty',
        'asset folder/characters/hello-kitty.png'
    );
}

function create() {
    // Background
    this.add.image(400, 300, 'background');

    // Ground (Mario-style, long)
    ground = this.physics.add.staticGroup();

    for (let x = 0; x <= 1600; x += 64) {
        ground.create(x, 540, 'platform')
            .setOrigin(0, 0)
            .refreshBody();
    }

    // Player (GUARANTEED visible)
    player = this.physics.add.sprite(100, 300, 'kitty');
    player.setScale(1);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, ground);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (!player) return;

    player.setVelocityX(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-250);
    }

    if (cursors.right.isDown) {
        player.setVelocityX(250);
    }

    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-600);
    }
}
