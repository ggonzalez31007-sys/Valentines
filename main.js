const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#ffb6c1', // hot pink = Phaser is alive
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: true // 👈 SHOW PHYSICS BODIES
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
    console.log('PRELOAD STARTED');

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
    console.log('CREATE STARTED');

    // BIG RED DEBUG LINE (GROUND LOCATION)
    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0xff0000);
    graphics.lineBetween(0, 520, 800, 520);

    // GROUND
    ground = this.physics.add.staticGroup();
    ground.create(400, 550, 'platform')
        .setScale(10, 1)
        .refreshBody();

    // PLAYER DEBUG BOX (EVEN IF IMAGE FAILS)
    player = this.physics.add.sprite(200, 200, 'kitty');
    player.setDisplaySize(64, 64); // FORCE VISIBILITY
    player.setTint(0xffffff);      // ENSURE NOT TRANSPARENT
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, ground);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (!player) return;

    player.setVelocityX(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    }
    if (cursors.right.isDown) {
        player.setVelocityX(200);
    }
    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-500);
    }
}
