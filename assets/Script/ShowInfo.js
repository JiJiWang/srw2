cc.Class({
    extends: cc.Component,

    properties: () => ({
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
    }),

    onLoad: function () {
        this.isInfoOut = false;
        this.isMoved = false;
        this.isFixed = true;      
        this.PosIndex = cc.Enum({
            ROBOT_INFO_LEFT: 0,
            ROBOT_INFO_CENTER: 1,
            ARM_INFO_CENTER: 2,
            ARM_INFO_RIGHT: 3,
            DRIVER_INFO_CENTER: 4,
            DRIVER_INFO_RIGHT: 5,
        });
    },

    unfixed: function() {
        var self = this;
        if (self.isFixed) {
            self.isMoved = false;
            var dt = cc.director.getAnimationInterval();
            var interval = cc.delayTime(dt);
            var callback = cc.callFunc(function () {
                if (self.GameData.right) {
                    self.GameData.right = false;
                    if (!self.isInfoOut) {
                        var outpos = self.pos[self.PosIndex.ROBOT_INFO_LEFT];
                        self.robotInfo.node.runAction(cc.moveTo(1, cc.p(outpos.x, outpos.y)));
                        self.isInfoOut = true;

                        var inpos = self.pos[self.PosIndex.ARM_INFO_CENTER];
                        self.armInfo.node.runAction(cc.moveTo(1, cc.p(inpos.x, inpos.y)));

                        var inpos = self.pos[self.PosIndex.DRIVER_INFO_CENTER];
                        self.driverInfo.node.runAction(cc.moveTo(1, cc.p(inpos.x, inpos.y)));                                               
                    }
                } else if (self.GameData.left) {
                    self.GameData.left = false;
                    if (self.isInfoOut) {
                        var inpos = self.pos[self.PosIndex.ROBOT_INFO_CENTER];
                        self.robotInfo.node.runAction(cc.moveTo(1, cc.p(inpos.x, inpos.y)));
                        self.isInfoOut = false;

                        var outpos = self.pos[self.PosIndex.ARM_INFO_RIGHT];
                        self.armInfo.node.runAction(cc.moveTo(1, cc.p(outpos.x, outpos.y)));

                        var outpos = self.pos[self.PosIndex.DRIVER_INFO_RIGHT];
                        self.driverInfo.node.runAction(cc.moveTo(1, cc.p(outpos.x, outpos.y)));                                      
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

    showInfo: function(robot, show) {
        var self = this;
        if (!show) {
            self.node.opacity = 0;
            self.armInfo.showArmInfo(robot, show);
            self.robotInfo.showRobotInfo(robot, show);
            self.driverInfo.showDriverInfo(robot, show);            
            self.fixed();
            return;
        }
        self.node.opacity = 255;
        self.unfixed();
        cc.loader.loadRes(robot.robotHead, cc.SpriteFrame, function (err, spriteFrame) {
            self.robotHead.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        self.armInfo.showArmInfo(robot, show);
        self.robotInfo.showRobotInfo(robot, show);
        self.driverInfo.showDriverInfo(robot, show);
    },
});
