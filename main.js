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

    // Mario-style ground (2 rows to cover bottom completely)
    platforms = this.physics.add.staticGroup();
    const tileWidth = 64;
    const platformHeight = 64; // adjust to your platform.png height
    const groundY1 = 600 - platformHeight / 2;      // bottom row
    const groundY2 = 600 - platformHeight - platformHeight / 2; // row above

    for (let x = 0; x < 800; x += tileWidth) {
        platforms.create(x + tileWidth / 2, groundY1, 'platform').setVisible(false);
        platforms.create(x + tileWidth / 2, groundY2, 'platform').setVisible(false);
    }

    // Player (start on top of bottom row)
    player = this.physics.add.sprite(100, groundY2 - platformHeight / 2, 'kitty');
    player.setCollideWorldBounds(true);
    player.setVisible(false);

    // Collider
    this.physics.add.collider(player, platforms);

    // Input
    cursors = this.input.keyboard.createCursorKeys();

    // Enter key hides menu and starts game
    this.input.keyboard.on('keydown-ENTER', () => {
        // Hide menu
        menuBoxBorder.setVisible(false);
        menuBoxInner.setVisible(false);
        menuText.setVisible(false);
        menuActive = false;

        // Show platforms and player
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
