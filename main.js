const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ffc0cb', // temporary pink to prove canvas works
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
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
    this.load.image(
        'background',
        'asset folder/characters/background/background.png'
    );

    // PLATFORM
    this.load.image(
        'platform',
        'asset folder/characters/platforms/platform.png'
    );

    // BLOCKS
    this.load.image(
        'capyblock',
        'asset folder/characters/blocks/capyblock.png'
    );
    this.load.image(
        'powerup',
        'asset folder/characters/blocks/powerup.png'
    );

    // ENEMY
    this.load.image(
        'evilCupcake',
        'asset folder/characters/enemies/evil-cupcake.png'
    );

    // POWERUP
    this.load.image(
        'berry',
        'asset folder/characters/powerups/berry.png'
    );

    // CHARACTERS (DIRECTLY IN FOLDER)
    this.load.spritesheet(
        'kitty',
        'asset folder/characters/hello-kitty.png',
        { frameWidth: 32, frameHeight: 48 }
    );

    this.load.image(
        'kerropi',
        'asset folder/characters/kerropi.png'
    );
}

function create() {
    // BACKGROUND
    this.add.image(400, 300, 'background').setScrollFactor(0);

    // PLATFORMS
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 580, 'platform').setScale(2, 1).refreshBody();

    // PLAYER
    player = this.physics.add.sprite(100, 450, 'kitty');
    player.setCollideWorldBounds(true);
    player.setBounce(0.1);

    this.physics.add.collider(player, platforms);

    // ANIMATION (safe even if sprite has 1 frame)
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('kitty', { start: 0, end: 0 }),
        frameRate: 1,
        repeat: -1
    });

    // INPUT
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (!player) return;

    player.setVelocityX(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-200);
        player.setFlipX(true);
        player.anims.play('walk', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
        player.setFlipX(false);
        player.anims.play('walk', true);
    } else {
        player.anims.stop();
    }

    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-450);
    }
}
