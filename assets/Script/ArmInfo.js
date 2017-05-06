cc.Class({
    extends: cc.Component,

    properties: {
        GameData: {
            default: null,
            type: require('GameData')            
        },
        arms: {
            default: [],
            type: [cc.Node]
        },
        selector: {
            default: null,
            type: cc.Node
        },
        pos: {
            default: [],
            type: [cc.Node]            
        },
        infos: {
            default: [],
            type: [cc.Label]
        }, 
    },

    // use this for initialization
    onLoad: function () {
        this.isMoved = false;
        this.isFixed = true;
        this.accUp = false;
        this.accDown = false;
        this.selectedID = 0;
        this.armsID = [-1, -1];
        this.selectedArm = {
            hitRate: 0,
            hitRange: 0,
            strengthAir: 0,
            strengthLand: 0,
            strengthSea: 0,
        };
        this.node.on('GameControl:ShowArmInfo', function ( event ) {
            this.showArmInfo(event);
            // this.unfixed(event.detail.robot);
        }.bind(this));      
        this.setInputControl();
    },

    setInputControl: function () {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.s:
                        self.accUp = false;
                        self.accDown = true;
                        break;
                    case cc.KEY.w:
                        self.accUp = true;
                        self.accDown = false;
                        break;
                }
            },
            onKeyReleased: function (keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.s:
                        self.accDown = false;
                        break;
                    case cc.KEY.w:
                        self.accUp = false;
                        break;
                }
            }
        }, self.node);
    },

    unfixed: function(robot) {
        // cc.log('robot info unfixed');
        var self = this;
        if (self.isFixed) {
            var dt = cc.director.getAnimationInterval();
            // cc.log('dt = ' + dt);
            var interval = cc.delayTime(dt);
            var callback = cc.callFunc(function () {
                if (self.accDown) {
                    // cc.log('self.isMoved = ' + self.isMoved);
                    if (!self.isMoved) {
                        this.selectedID = 1;
                        self.selectedArm.hitRange = robot.armTwoRange;
                        self.selectedArm.hitRate = robot.armTwoHitRate;
                        self.selectedArm.strengthAir = robot.armTwoStrengthAir;
                        self.selectedArm.strengthLand = robot.armTwoStrengthLand;
                        self.selectedArm.strengthSea = robot.armTwoStrengthSea;
                        self.selector.x = self.pos[1].x;
                        self.selector.y = self.pos[1].y;
                        self.arms[0].opacity = 0;
                        self.arms[1].opacity = 255;
                        self.isMoved = true;                             
                    }
                } else if (self.accUp) {
                    // cc.log('self.isMoved = ' + self.isMoved);
                    if (self.isMoved) {
                        this.selectedID = 0;
                        self.selectedArm.hitRange = robot.armOneRange;
                        self.selectedArm.hitRate = robot.armOneHitRate;
                        self.selectedArm.strengthAir = robot.armOneStrengthAir;
                        self.selectedArm.strengthLand = robot.armOneStrengthLand;
                        self.selectedArm.strengthSea = robot.armOneStrengthLand;
                        self.selector.x = self.pos[0].x;
                        self.selector.y = self.pos[0].y;                        
                        self.arms[0].opacity = 255;
                        self.arms[1].opacity = 0;
                        self.isMoved = false;                             
                    }    
                }
            }, self);
            var sequence = cc.sequence(callback, interval);
            self.node.runAction(sequence.repeatForever());
            self.isFixed = false;
        }
    },

    fixed: function() {
        var self = this;
        if (!self.isFixed) {
            self.node.stopAllActions();
            self.selectedID = 0;
            self.selector.x = self.pos[0].x;
            self.selector.y = self.pos[0].y;             
            self.isFixed = true;
        }
    },

    showArmInfo: function(event) {
        var self = this;
        if (!event.detail.show) {
            self.node.opacity = 0;
            self.fixed();
            return;
        }
        self.node.opacity = 255;
        var robot = event.detail.robot;
        self.unfixed(robot);

        var infosIndex = [
            'NAME',
            'RATE',
            'RANGE',
            'AIR',
            'LAND',
            'SEA',
        ];
        var j = 0;
        var armsID = self.GameData.getArmsID(robot.id);
        for (var k = 0; k < armsID.length; k++) {
            var id = armsID[k];
            self.armsID[k] = id;
            var arm = self.GameData.getArm(id);
            for (var i = 0; i < infosIndex.length; i++) {
                self.infos[j].string = arm[infosIndex[i]];
                j++;
            }
        }                                                                                       
    },

    getArm: function() {
        return this.GameData.getArm(this.armsID[this.selectedID]);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
