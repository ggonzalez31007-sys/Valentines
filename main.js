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
let menuActive = true;
let menuText;
let menuBoxBorder;
let menuBoxInner;

function preload() {
    // Background & platforms
    this.load.image('background', 'assetfolder/background/background.png');
    this.load.image('platform', 'assetfolder/platforms/platform.png');

    // Player
    this.load.image('kitty', 'assetfolder/characters/hello-kitty.png');
}

function create() {
    const centerX = 400;
    const centerY = 300;
    const menuWidth = 600;
    const menuHeight = 200;
    const borderWidth = 10;

    // White background outside menu
    this.cameras.main.setBackgroundColor(0xffffff);

    // Menu border (pink)
    menuBoxBorder = this.add.rectangle(centerX, centerY, menuWidth, menuHeight, 0xff6fa8);

    // Inner box (salmon pink)
    menuBoxInner = this.add.rectangle(centerX, centerY, menuWidth - borderWidth * 2, menuHeight - borderWidth * 2, 0xffa6c9);

    // Menu text
    menuText = this.add.text(centerX, centerY, 'Hey Gorgeous! Press Enter To Start!', {
        font: '28px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5);

    // Background image (behind gameplay)
    const bg = this.add.image(400, 300, 'background').setDepth(-1);

    // Mario-style ground (full bottom)
    platforms = this.physics.add.staticGroup();
    const tileWidth = 64;
    const groundY = 600 - 32; // assuming platform.png height ~64, adjust if needed
    for (let x = 0; x < 800; x += tileWidth) {
        platforms.create(x + tileWidth / 2, groundY, 'platform').setVisible(false);
    }

    // Player (invisible until menu is gone)
    player = this.physics.add.sprite(100, groundY - 32, 'kitty'); // start on top of ground
    player.setCollideWorldBounds(true);
    player.setVisible(false);
    this.physics.add.collider(player, platforms);

    // Input
    cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on('keydown-ENTER', () => {
        // Hide menu completely
        menuBoxBorder.setVisible(false);
        menuBoxInner.setVisible(false);
        menuText.setVisible(false);
        menuActive = false;

        // Show ground and player
        platforms.getChildren().forEach(p => p.setVisible(true));
        player.setVisible(true);
    });
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

    // Jump
    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-500);
    }
}
