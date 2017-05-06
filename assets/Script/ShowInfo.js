cc.Class({
    extends: cc.Component,

    properties: {
        GameData: {
            default: null,
            type: require('GameData')            
        },
        selector: {
            default: null,
            type: cc.Node
        },
        pos: {
            default: [],
            type: [cc.Node]
        },  
        robotHead: {
            default: null,
            type: cc.Node
        },        
        robotInfo: {
            default: null,
            type: require('RobotInfo')
        },         
        driverInfo: {
            default: null,
            type: require('DriverInfo')
        }, 
        armInfo: {
            default: null,
            type: require('ArmInfo')
        },                      
    },

    // use this for initialization
    onLoad: function () {
        this.isInfoOut = false;
        this.isMoved = false;
        this.isFixed = true;
        this.accLeft = false;
        this.accRight = false;
        this.node.on('GameControl:ShowRobotInfo', function ( event ) {
            this.showInfo(event);
        }.bind(this));      
        this.setInputControl();
        this.PosIndex = cc.Enum({
            ROBOT_INFO_LEFT: 0,
            ROBOT_INFO_CENTER: 1,
            ARM_INFO_CENTER: 2,
            ARM_INFO_RIGHT: 3,
            DRIVER_INFO_CENTER: 4,
            DRIVER_INFO_RIGHT: 5,
        });
    },

    setInputControl: function () {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.d:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                }
            },
            onKeyReleased: function (keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d:
                        self.accRight = false;
                        break;
                }
            }
        }, self.node);
    },

    unfixed: function(robot) {
        var self = this;
        if (self.isFixed) {
            var dt = cc.director.getAnimationInterval();
            var interval = cc.delayTime(dt);
            var callback = cc.callFunc(function () {
                if (self.accRight) {
                    if (!self.isInfoOut) {
                        var outpos = self.pos[self.PosIndex.ROBOT_INFO_LEFT];
                        self.robotInfo.node.runAction(cc.moveTo(1, cc.p(outpos.x, outpos.y)));
                        self.isInfoOut = true;

                        var inpos = self.pos[self.PosIndex.ARM_INFO_CENTER];
                        self.armInfo.node.runAction(cc.moveTo(1, cc.p(inpos.x, inpos.y)));
                        // self.armInfo.unfixed(robot);

                        var inpos = self.pos[self.PosIndex.DRIVER_INFO_CENTER];
                        self.driverInfo.node.runAction(cc.moveTo(1, cc.p(inpos.x, inpos.y)));                                               
                        // self.fixed();                            
                    }
                } else if (self.accLeft) {
                    if (self.isInfoOut) {
                        var inpos = self.pos[self.PosIndex.ROBOT_INFO_CENTER];
                        self.robotInfo.node.runAction(cc.moveTo(1, cc.p(inpos.x, inpos.y)));
                        self.isInfoOut = false;

                        var outpos = self.pos[self.PosIndex.ARM_INFO_RIGHT];
                        self.armInfo.node.runAction(cc.moveTo(1, cc.p(outpos.x, outpos.y)));
                        // self.armInfo.fixed();

                        var outpos = self.pos[self.PosIndex.DRIVER_INFO_RIGHT];
                        self.driverInfo.node.runAction(cc.moveTo(1, cc.p(outpos.x, outpos.y)));                                      
                        // self.unfixed();  
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
            self.isFixed = true;
        }
    },

    showInfo: function(event) {
        var self = this;
        if (!event.detail.show) {
            self.node.opacity = 0;
            self.fixed();
            return;
        }
        self.node.opacity = 255;
        var robot = event.detail.robot;
        self.unfixed(robot);
        // cc.log('robot.robotHead = ' + robot.robotHead);
        cc.loader.loadRes(robot.robotHead, cc.SpriteFrame, function (err, spriteFrame) {
            self.robotHead.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        self.armInfo.showArmInfo(event);
        self.robotInfo.showRobotInfo(event);
        self.driverInfo.showDriverInfo(event);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
