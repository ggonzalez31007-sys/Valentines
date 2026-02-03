const config = {
    type: Phaser.AUTO,
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
let platforms;
let blocks;
let menuActive = true;
let menuText;

function preload() {
    // Background & platforms
    this.load.image('background', 'assetfolder/background/background.png');
    this.load.image('platform', 'assetfolder/platforms/platform.png');

    // Blocks
    this.load.image('capyblock', 'assetfolder/blocks/capyblock.png');
    this.load.image('powerupblock', 'assetfolder/blocks/powerup.png');

    // Powerups
    this.load.image('berry', 'assetfolder/powerups/berry.png');

    // Characters
    this.load.image('kitty', 'assetfolder/characters/hello-kitty.png');
    this.load.image('kerropi', 'assetfolder/characters/kerropi.png');
}

function create() {
    const centerX = 400;
    const centerY = 300;
    const menuWidth = 600;
    const menuHeight = 200;
    const borderWidth = 10;

    // White background outside menu box
    this.cameras.main.setBackgroundColor(0xffffff);

    // Menu border (pink)
    this.add.rectangle(centerX, centerY, menuWidth, menuHeight, 0xff6fa8);

    // Inner box (salmon pink)
    this.add.rectangle(centerX, centerY, menuWidth - borderWidth * 2, menuHeight - borderWidth * 2, 0xffa6c9);

    // Menu text
    menuText = this.add.text(centerX, centerY, 'Hey Gorgeous! Press Enter To Start!', {
        font: '28px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5);

    // Background image behind gameplay (will show after menu)
    const bg = this.add.image(400, 300, 'background').setDepth(-1);

    // Mario-style ground
    platforms = this.physics.add.staticGroup();
    const tileWidth = 64;
    for (let x = 0; x < 800; x += tileWidth) {
        platforms.create(x + tileWidth / 2, 568, 'platform');
    }

    // Player
    player = this.physics.add.sprite(100, 450, 'kitty');
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    // Blocks
    blocks = this.physics.add.staticGroup();
    blocks.create(400, 400, 'capyblock');
    blocks.create(500, 350, 'powerupblock');
    this.physics.add.collider(player, blocks, hitBlock, null, this);

    // Keroppi
    const kerropi = this.physics.add.sprite(700, 500, 'kerropi').setImmovable(true);
    this.physics.add.collider(player, kerropi);

    // Keroppi text
    const kerropiText = this.add.text(kerropi.x, kerropi.y - 50, 'Find your boyfriend!', {
        font: '20px Arial',
        fill: '#000000'
    }).setOrigin(0.5).setVisible(false);

    this.physics.add.overlap(player, kerropi, () => {
        kerropiText.setVisible(true);
    }, null, this);

    this.physics.add.overlap(player, kerropi, null, () => {
        if (Phaser.Math.Distance.Between(player.x, player.y, kerropi.x, kerropi.y) > 50) {
            kerropiText.setVisible(false);
        }
        return false;
    });

    // Input
    cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on('keydown-ENTER', () => {
        menuActive = false;
        menuText.setVisible(false);
        // hide rectangles (menu)
        this.children.each(child => {
            if (child.type === 'Rectangle') child.setVisible(false);
        });
    });
}

function hitBlock(player, block) {
    // Only trigger if hitting from below
    if (player.body.touching.up && block.body.touching.down) {
        if (block.texture.key === 'powerupblock') {
            const berry = blocks.scene.physics.add.sprite(block.x, block.y - 32, 'berry');
            berry.setVelocityY(-300);
        }
    }
}

function update() {
    if (menuActive) return;

    player.setVelocityX(0);

    // Left/right movement
    if (cursors.left.isDown) {
        player.setVelocityX(-250);
    } else if (cursors.right.isDown) {
        player.setVelocityX(250);
    }

    // Jump (press up)
    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-500);
    }
}
