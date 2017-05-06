cc.Class({
    extends: cc.Component,

    properties: {
        selector: {
            default: null,
            type: cc.Node
        },
        pos: {
            default: [],
            type: [cc.Node]            
        }
    },

    // use this for initialization
    onLoad: function () {
        this.isMoved = false;
        this.isFixed = true;
        this.accUp = false;
        this.accDown = false;
        this.selectedID = 0;
        this.selectedArm = {
            hitRate: 0,
            hitRange: 0,
            strengthAir: 0,
            strengthLand: 0,
            strengthSea: 0,
        };
        this.node.on('GameControl:ShowArmInfo', function ( event ) {
            this.showArmInfo(event);
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
                        // var pos = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_POS_ARM_2');
                        // if (pos) {
                        //     self.selector.x = pos.x;
                        //     self.selector.y = pos.y;
                        // }                        
                        var armOneHitRate = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_HIT_RATE');
                        if (armOneHitRate) {
                            // cc.log('find armOneHitRate');
                            armOneHitRate.getComponent(cc.Label).string = robot.armTwoHitRate;
                        }   
                        var armOneRange = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_HIT_RANGE');
                        if (armOneRange) {
                            // cc.log('find armOneRange');
                            armOneRange.getComponent(cc.Label).string = robot.armTwoRange;
                        } 
                        var armOneStrengthAir = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_AIR');
                        if (armOneStrengthAir) {
                            // cc.log('find armOneStrengthAir');
                            armOneStrengthAir.getComponent(cc.Label).string = robot.armTwoStrengthAir;
                        }   
                        var armOneStrengthLand = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_LAND');
                        if (armOneStrengthLand) {
                            // cc.log('find armOneStrengthLand');
                            armOneStrengthLand.getComponent(cc.Label).string = robot.armTwoStrengthLand;
                        }  
                        var armOneStrengthSea = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_SEA');
                        if (armOneStrengthSea) {
                            // cc.log('find armOneStrengthSea');
                            armOneStrengthSea.getComponent(cc.Label).string = robot.armTwoStrengthSea;
                        }
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
                        // var pos = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_POS_ARM_1');
                        // if (pos) {
                        //     self.selector.x = pos.x;
                        //     self.selector.y = pos.y;
                        // }
                        var armOneHitRate = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_HIT_RATE');
                        if (armOneHitRate) {
                            // cc.log('find armOneHitRate');
                            armOneHitRate.getComponent(cc.Label).string = robot.armOneHitRate;
                        }   
                        var armOneRange = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_HIT_RANGE');
                        if (armOneRange) {
                            // cc.log('find armOneRange');
                            armOneRange.getComponent(cc.Label).string = robot.armOneRange;
                        } 
                        var armOneStrengthAir = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_AIR');
                        if (armOneStrengthAir) {
                            // cc.log('find armOneStrengthAir');
                            armOneStrengthAir.getComponent(cc.Label).string = robot.armOneStrengthAir;
                        }   
                        var armOneStrengthLand = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_LAND');
                        if (armOneStrengthLand) {
                            // cc.log('find armOneStrengthLand');
                            armOneStrengthLand.getComponent(cc.Label).string = robot.armOneStrengthLand;
                        }  
                        var armOneStrengthSea = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_SEA');
                        if (armOneStrengthSea) {
                            // cc.log('find armOneStrengthSea');
                            armOneStrengthSea.getComponent(cc.Label).string = robot.armOneStrengthSea;
                        }
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
        if (!event.detail.show) {
            this.node.opacity = 0;
            this.fixed();
            return;
        }
        // cc.log('ShowArmInfo');
        var self = this;
        self.node.opacity = 255;
        var robot = event.detail.robot;
        self.unfixed(robot);

        var armOneName = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_ARM_NAME_1');
        if (armOneName) {
            // cc.log('find armOneName');
            armOneName.getComponent(cc.Label).string = robot.armOneName;
        }  
        var armTwoName = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_ARM_NAME_2');
        if (armTwoName) {
            // cc.log('find armTwoName');
            armTwoName.getComponent(cc.Label).string = robot.armTwoName;
        }  
        var armOneHitRate = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_HIT_RATE');
        if (armOneHitRate) {
            // cc.log('find armOneHitRate');
            armOneHitRate.getComponent(cc.Label).string = robot.armOneHitRate;
        }   
        var armOneRange = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_HIT_RANGE');
        if (armOneRange) {
            // cc.log('find armOneRange');
            armOneRange.getComponent(cc.Label).string = robot.armOneRange;
        } 
        var armOneStrengthAir = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_AIR');
        if (armOneStrengthAir) {
            // cc.log('find armOneStrengthAir');
            armOneStrengthAir.getComponent(cc.Label).string = robot.armOneStrengthAir;
        }   
        var armOneStrengthLand = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_LAND');
        if (armOneStrengthLand) {
            // cc.log('find armOneStrengthLand');
            armOneStrengthLand.getComponent(cc.Label).string = robot.armOneStrengthLand;
        }  
        var armOneStrengthSea = cc.find('Canvas/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_SEA');
        if (armOneStrengthSea) {
            // cc.log('find armOneStrengthSea');
            armOneStrengthSea.getComponent(cc.Label).string = robot.armOneStrengthSea;
        }                                                                                           
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
