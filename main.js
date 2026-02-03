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
let platforms;

function preload() {
    // background
    this.load.image('bg', 'assetfolder/background/background.png');

    // ground platform (long one)
    this.load.image('ground', 'assetfolder/platforms/platform.png');

    // short platforms
    this.load.image('shortPlatform', 'assetfolder/platforms/short-platform.png');

    // capy sprite sheet (multiple frames horizontal)
    this.load.spritesheet('capy', 
        'assetfolder/characters/capy.png', 
        { frameWidth: 64, frameHeight: 64 } // replace with actual frame size
    );
}

function create() {
    // BACKGROUND
    this.add.image(400, 300, 'bg').setDepth(-10);

    // --- GROUND (long platform) ---
    ground = this.physics.add.staticGroup();
    const groundY = 600 - 32; // adjust if your tile is taller
    ground.create(400, groundY, 'ground'); // centered long ground

    // --- SHORT PLATFORMS ---
    platforms = this.physics.add.staticGroup();
    // example positions for jumpable platforms
    platforms.create(200, 400, 'shortPlatform');
    platforms.create(600, 300, 'shortPlatform');

    // --- PLAYER ---
    player = this.physics.add.sprite(200, 200, 'capy');
    player.setScale(0.6);
    player.setDepth(10);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, ground);
    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    // --- CAPY ANIMATIONS ---
    this.anims.create({
        key: 'idle',
        frames: [{ key: 'capy', frame: 0 }],
        frameRate: 1,
        repeat: -1
    });

    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('capy', { start: 1, end: 2 }),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: 'jump',
        frames: [{ key: 'capy', frame: 3 }], // adjust if you have a jump frame
        frameRate: 1,
        repeat: -1
    });

    player.anims.play('idle');
}

function update() {
    player.setVelocityX(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-260);
        if (player.body.blocked.down) player.anims.play('walk', true);
        player.flipX = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(260);
        if (player.body.blocked.down) player.anims.play('walk', true);
        player.flipX = false;
    } else {
        if (player.body.blocked.down) player.anims.play('idle', true);
    }

    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-760);
        player.anims.play('jump', true);
    }

    // optional: switch back to idle when falling
    if (!player.body.blocked.down && player.body.velocity.y > 0) {
        player.anims.play('jump', true);
    }
}
