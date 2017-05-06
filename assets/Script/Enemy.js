cc.Class({
    extends: cc.Component,

    properties: {
        HPLabel: {
            default: null,
            type: cc.Node
        },
        HPChange: {
            default: null,
            type: cc.Node
        },
        robotName: '',
        driverName: '',
        post: '',
        driver: 0,
        level: 0,
        maneuver: 0,  
        strength: 0,
        defence: 0, 
        speed: 0,
        spirit: 0,
        spiritMax: 0,
        hp: 0,
        hpMax: 0,
        exp: 0,
        expNeed: 0,
        armOneName: '',
        armTwoName: '',
        armOneID: 0,
        armOneRange: 0,
        armOneHitRate: 0,
        armOneStrengthSea: 0,
        armOneStrengthLand: 0,
        armOneStrengthAir: 0,
        armTwoID: 0,
        armTwoRange: 0,
        armTwoHitRate: 0,
        armTwoStrengthSea: 0,
        armTwoStrengthLand: 0,
        armTwoStrengthAir: 0,
        tilex: 0,
        tiley: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.GameData = this.getGameData();
        this.isSelected= false;
        this.isMoved = false;
        this.isAlive = true;
        this.HPLabel.getComponent(cc.Label).string = this.hp;
        this.node.on('GameControl:Move', function(event) {
            // cc.log('Robot Move');
            this.move(event);
        }.bind(this));
    },

    getGameData: function() {
        var root = cc.find('Canvas');
        if (root) {
            var gameData = root.getComponent('GameData');
            return gameData;
        }
        else {
            cc.log('root is null');
            return null;
        }
    },
    
    onCollisionEnter: function (other, self) {
        this.isSelected = true;
        // cc.log('this.isSelected = ' + this.isSelected );
        if (!this.isMoved) {
            var blinkAction = cc.blink(1,1).repeatForever()
            blinkAction.setTag(26);
            self.node.runAction(blinkAction);
        }
        var root = cc.find('Canvas');
        if (root) {
            var enemy = self.node.getComponent('Enemy');
            root.emit('Enemy:onCollisionEnter', {
                enemy: enemy,
            });
        }
        // cc.log('Enemy: on collision enter');
    },

    onCollisionStay: function (other, self) {
        // cc.log('Enemy: on collision stay');
    },

    onCollisionExit: function (other, self) {
        this.isSelected = false;
        if (!this.isMoved) {
            self.node.stopActionByTag(26);
            self.node.opacity = 255;
        }
        // cc.log('Enemy: on collision exit');
    },
    
    move: function (event) {
        // var dx = (this.tilex - event.detail.x) * 16;
        // var dy = (this.tiley - event.detail.y) * 16;
        var dx = (event.detail.x - this.tilex) * 16;
        var dy = (this.tiley - event.detail.y) * 16;
        this.tilex = event.detail.x;
        this.tiley = event.detail.y;
        var sx = Math.abs(dx);
        var sy = Math.abs(dy);
        var sxy = sx + sy;
        var movex = cc.moveBy(sx / sxy, dx, 0).easing(cc.easeCubicActionIn());
        var movey = cc.moveBy(sy / sxy, 0, dy).easing(cc.easeCubicActionOut());
        var callback = cc.callFunc(function() {
            this.node.color = new cc.Color(160, 160, 160);
        }, this);
        var delay = cc.delayTime(0.2);
        var seq = cc.sequence(movex, movey, delay, callback);
        this.node.runAction(seq);
        var followAction = cc.follow(this.node, cc.rect(0, 0, 320 * 2 - 100, 480));
        event.detail.map.runAction(followAction);         
        this.isMoved = true;
    },

    injure: function(strength) {
        var self = this;
        cc.log('before injure self.hp = ' + self.hp + 'arm.strength = ' + strength + 'self.defence = ' + self.defence);
        var hp = self.hp - strength + self.defence;
        var dhp = 0;
        if (hp <= 0) {
            self.hp = 0;
            dhp = -self.hp;
            // self.HPLabel.getComponent(cc.Label).string = self.hp;
            self.HPChange.getComponent(cc.Label).string = -self.hp;
            var fadeout = cc.fadeOut(0.5);
            self.node.runAction(fadeout);
            self.isAlive = false;
            cc.log('self.GameData = ' +  self.GameData);
            self.GameData.enemysAvailableCount--;
            // self.GameData.decEnemysAvailableCount();
        }
        else {
            dhp = hp - self.hp;
            self.hp = hp;
            // self.HPLabel.getComponent(cc.Label).string = self.hp;
            self.HPChange.getComponent(cc.Label).string = dhp;
        }
        var moveBy1 = cc.moveBy(0.05, cc.p(0.3, 0.3));
        var moveBy2 = cc.moveBy(0.05, cc.p(-0.3, -0.3));
        var seq = cc.sequence(moveBy1, moveBy2, moveBy2, moveBy1).repeat(5);
        self.node.runAction(seq);
        var fadeIn = cc.fadeIn(1.5).easing(cc.easeCubicActionIn());
        var fadeout = cc.fadeOut(1.5).easing(cc.easeCubicActionOut()); 
        var callback = cc.callFunc(function () {
            self.HPLabel.getComponent(cc.Label).string = self.hp;
        });
        var seq = cc.sequence(fadeIn, callback, fadeout);
        self.HPChange.runAction(seq);        
        cc.log('after injure self.hp = ' + self.hp + 'dhp = ' + dhp);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
