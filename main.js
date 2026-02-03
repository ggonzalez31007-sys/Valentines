const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1600 },
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

// globals
let player;
let cursors;
let ground;
let started = false;
let menuGroup;

function preload() {
    // background + world
    this.load.image('bg', 'assetfolder/background/background.png');
    this.load.image('ground', 'assetfolder/platforms/platform.png');

    // player
    this.load.image('player', 'assetfolder/characters/hello-kitty.png');
}

function create() {
    // --- BACKGROUND ---
    this.add.image(400, 300, 'bg').setDepth(0);

    // --- MENU ---
    menuGroup = this.add.group();

    const border = this.add.rectangle(400, 300, 640, 240, 0xff6fa8);
    const box = this.add.rectangle(400, 300, 600, 200, 0xffa6c9);
    const text = this.add.text(
        400,
        300,
        'Hey Gorgeous!\nPress ENTER To Start',
        {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center'
        }
    ).setOrigin(0.5);

    menuGroup.addMultiple([border, box, text]);

    // --- GROUND (MARIO-STYLE BOTTOM) ---
    ground = this.physics.add.staticGroup();

    // measure tile height safely
    const temp = this.add.image(0, 0, 'ground').setVisible(false);
    const tileWidth = temp.width;
    const tileHeight = temp.height;
    temp.destroy();

    const groundY = config.height - tileHeight / 2;

    for (let x = 0; x < config.width; x += tileWidth) {
        ground.create(x + tileWidth / 2, groundY, 'ground')
              .setDepth(2);
    }

    // --- PLAYER ---
    player = this.physics.add.sprite(
        120,
        groundY - tileHeight,
        'player'
    );

    player.setScale(0.6); // protects against huge transparent PNGs
    player.setCollideWorldBounds(true);
    player.setDepth(3);

    this.physics.add.collider(player, ground);

    // input
    cursors = this.input.keyboard.createCursorKeys();

    // start game
    this.input.keyboard.once('keydown-ENTER', () => {
        menuGroup.clear(true, true);
        started = true;
    });
}

function update() {
    if (!started) return;

    player.setVelocityX(0);

    // movement
    if (cursors.left.isDown) {
        player.setVelocityX(-260);
    } else if (cursors.right.isDown) {
        player.setVelocityX(260);
    }

    // mario-style jump (short tap vs hold works naturally with gravity)
    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-720);
    }
}
