cc.Class({
    extends: cc.Component,

    properties: () => ({       
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
        robotHead: '',
        driverHead: '',            
        tilex: 0,
        tiley: 0,
    }),

    onLoad: function () {
        this.isSelected= false;
        this.isMoved = false;
        this.isAlive = true;
        this.HPLabel.string = this.getHp();
        this.node.on('GameControl:Move', function(event) {
            this.move(event);
        }.bind(this));
    },

    onCollisionEnter: function () {
        var self = this;
        self.isSelected = true;
        if (self.node.group == 'Blue') {
            if (!self.isMoved) {
                var blinkAction = cc.blink(1,1).repeatForever()
                blinkAction.setTag(26);
                self.node.runAction(blinkAction);
            }
        }
    },

    onCollisionExit: function () {
        var self = this;
        self.isSelected = false;
        if (self.node.group == 'Blue') {
            if (!self.isMoved) {
                self.node.stopActionByTag(26);
                self.node.opacity = 255;
            }
        }
    },
    
    move: function (event) {
        var self = this;
        var dx = (event.detail.x - self.tilex) * 16;
        var dy = (self.tiley - event.detail.y) * 16;
        self.tilex = event.detail.x;
        self.tiley = event.detail.y;
        var sx = Math.abs(dx);
        var sy = Math.abs(dy);
        var sxy = sx + sy;
        var movex = cc.moveBy(sx / sxy, dx, 0).easing(cc.easeCubicActionIn());
        var movey = cc.moveBy(sy / sxy, 0, dy).easing(cc.easeCubicActionOut());
        var callback = cc.callFunc(function() {
            this.node.color = new cc.Color(160, 160, 160);
            this.GameData.GameControl.onRobotMoved(self);          
        }, self);
        var delay = cc.delayTime(0.2);
        var seq = cc.sequence(movex, movey, delay, callback);
        self.node.runAction(seq);
        self.isMoved = true;
    },

    getRobotName: function () {
        return this.GameData.getRobotName(this.id);
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
        var hp = hp0 - strength + defence;
        var dhp = 0;
        if (hp <= 0) {
            dhp = -hp0;
            hp = 0;
            self.setHp(hp);
            self.HPChange.string = dhp;
            self.isAlive = false;          
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

        var fadeIn = cc.fadeIn(1).easing(cc.easeCubicActionIn());
        var fadeout = cc.fadeOut(1).easing(cc.easeCubicActionOut()); 
        var callback1 = cc.callFunc(function () {
            self.HPLabel.string = self.getHp();
        });
        var callback2 = cc.callFunc(function () {
            if (!this.isAlive) {
                var fadeout = cc.fadeOut(0.2);
                this.node.runAction(fadeout);     
            }        
        }.bind(this));        
        var seq = cc.sequence(fadeIn, callback1, fadeout, callback2);
        self.HPChange.node.runAction(seq);                 
    },
});
