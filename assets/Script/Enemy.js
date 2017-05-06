cc.Class({
    extends: cc.Component,

    properties: {
        GameData: {
            default: null,
            type: require('GameData')            
        },
        HPLabel: {
            default: null,
            type: cc.Label
        },
        HPChange: {
            default: null,
            type: cc.Label
        },
        id: 0,
        robotName: '',
        driverName: '',
        tilex: 0,
        tiley: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.isSelected= false;
        this.isMoved = false;
        this.isAlive = true;
        this.HPLabel.string = this.getHp();
        this.node.on('GameControl:Move', function(event) {
            // cc.log('Robot Move');
            this.move(event);
        }.bind(this));
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
        var followAction = cc.follow(this.node, cc.rect(0, 0, 256 * 2 - 100, 240));
        event.detail.map.runAction(followAction);         
        this.isMoved = true;
    },

    setHp: function(hp) {
        this.GameData.setHp(this.id, hp);
    },

    getHp: function() {
        return this.GameData.getHp(this.id);
    },

    getDefence: function() {
        return this.GameData.getDefence(this.id);
    },

    getManeuver: function() {
        return this.GameData.getManeuver(this.id);
    },

    getArm: function(i) {
        return this.GameData.getRobotArm(this.id, i);
    },

    injure: function(strength) {
        var self = this;
        var hp0 = self.getHp();
        var defence = self.getDefence();
        // cc.log('before injure self.hp = ' + hp0 + ', arm.strength = ' + strength + ', self.defence = ' + defence);
        var hp = hp0 - strength + defence;
        var dhp = 0;
        if (hp < 0) {
            dhp = -hp0;
            hp = 0;
            self.setHp(hp);
            self.HPChange.string = -hp0;
            self.isAlive = false;
            var fadeout = cc.fadeOut(0.5);
            self.node.runAction(fadeout);            
        }
        else {
            dhp = hp - hp0;
            self.setHp(hp);
            self.HPChange.string = dhp;
        }
        var moveBy1 = cc.moveBy(0.05, cc.p(0.3, 0.3));
        var moveBy2 = cc.moveBy(0.05, cc.p(-0.3, -0.3));
        var seq = cc.sequence(moveBy1, moveBy2, moveBy2, moveBy1).repeat(5);
        self.node.runAction(seq);
        var fadeIn = cc.fadeIn(1.5).easing(cc.easeCubicActionIn());
        var fadeout = cc.fadeOut(1.5).easing(cc.easeCubicActionOut()); 
        var callback = cc.callFunc(function () {
            self.HPLabel.string = self.getHp();
        });
        var seq = cc.sequence(fadeIn, callback, fadeout);
        self.HPChange.node.runAction(seq);        
        // cc.log('after injure self.hp = ' + self.getHp() + ', dhp = ' + dhp);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
