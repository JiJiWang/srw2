cc.Class({
    extends: cc.Component,

    properties: {
        selector: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        this.isInfoOut = false;
        this.isMoved = false;
        this.isFixed = true;
        this.accLeft = false;
        this.accRight = false;
        this.accUp = false;
        this.accDown = false;
        this.node.on('GameControl:ShowRobotInfo', function ( event ) {
            this.showRobotInfo(event);
        }.bind(this));      
        this.setInputControl();
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
                        self.accUp = false;
                        self.accDown = false;
                        break;
                    case cc.KEY.d:
                        self.accLeft = false;
                        self.accRight = true;
                        self.accUp = false;
                        self.accDown = false;
                        break;
                    case cc.KEY.s:
                        self.accLeft = false;
                        self.accRight = false;
                        self.accUp = false;
                        self.accDown = true;
                        break;
                    case cc.KEY.w:
                        self.accLeft = false;
                        self.accRight = false;
                        self.accUp = true;
                        self.accDown = false;
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
                if (self.accRight) {
                    if (!self.isInfoOut) {
                        var outpos = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_POS_ROBOT_INFO_LEFT');
                        if (outpos) {
                            var robotInfo = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_1')
                            if (robotInfo) {
                                robotInfo.runAction(cc.moveTo(1, cc.p(outpos.x, outpos.y)));
                                self.isInfoOut = true;
                            }
                        }
                        var inpos = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_POS_ROBOT_INFO_CENTER');
                        if (inpos) {
                            var armInfo = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2');
                            if (armInfo) {
                                armInfo.runAction(cc.moveTo(1, cc.p(inpos.x, inpos.y)));
                            }
                        }                            
                    }
                } else if (self.accLeft) {
                    if (self.isInfoOut) {
                        var inpos = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_POS_ROBOT_INFO_CENTER');
                        if (inpos) {
                            var robotInfo = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_1')
                            if (robotInfo) {
                                robotInfo.runAction(cc.moveTo(1, cc.p(inpos.x, inpos.y)));
                                self.isInfoOut = false;
                            }
                        }
                        var outpos = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_POS_ROBOT_INFO_RIGHT');
                        if (outpos) {
                            var armInfo = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2');
                            if (armInfo) {
                                armInfo.runAction(cc.moveTo(1, cc.p(outpos.x, outpos.y)));
                            }
                        }  
                    } 
                }
                if (self.accDown) {
                    // cc.log('self.isMoved = ' + self.isMoved);
                    if (!self.isMoved) {
                        var pos = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_POS_ARM_2');
                        if (pos) {
                            self.selector.x = pos.x;
                            self.selector.y = pos.y;
                        }                        
                        var armOneHitRate = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_HIT_RATE');
                        if (armOneHitRate) {
                            // cc.log('find armOneHitRate');
                            armOneHitRate.getComponent(cc.Label).string = robot.armTwoHitRate;
                        }   
                        var armOneRange = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_HIT_RANGE');
                        if (armOneRange) {
                            // cc.log('find armOneRange');
                            armOneRange.getComponent(cc.Label).string = robot.armTwoRange;
                        } 
                        var armOneStrengthAir = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_AIR');
                        if (armOneStrengthAir) {
                            // cc.log('find armOneStrengthAir');
                            armOneStrengthAir.getComponent(cc.Label).string = robot.armTwoStrengthAir;
                        }   
                        var armOneStrengthLand = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_LAND');
                        if (armOneStrengthLand) {
                            // cc.log('find armOneStrengthLand');
                            armOneStrengthLand.getComponent(cc.Label).string = robot.armTwoStrengthLand;
                        }  
                        var armOneStrengthSea = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_SEA');
                        if (armOneStrengthSea) {
                            // cc.log('find armOneStrengthSea');
                            armOneStrengthSea.getComponent(cc.Label).string = robot.armTwoStrengthSea;
                        }
                        self.isMoved = true;                             
                    }
                } else if (self.accUp) {
                    // cc.log('self.isMoved = ' + self.isMoved);
                    if (self.isMoved) {
                        var pos = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_POS_ARM_1');
                        if (pos) {
                            self.selector.x = pos.x;
                            self.selector.y = pos.y;
                        }
                        var armOneHitRate = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_HIT_RATE');
                        if (armOneHitRate) {
                            // cc.log('find armOneHitRate');
                            armOneHitRate.getComponent(cc.Label).string = robot.armOneHitRate;
                        }   
                        var armOneRange = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_HIT_RANGE');
                        if (armOneRange) {
                            // cc.log('find armOneRange');
                            armOneRange.getComponent(cc.Label).string = robot.armOneRange;
                        } 
                        var armOneStrengthAir = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_AIR');
                        if (armOneStrengthAir) {
                            // cc.log('find armOneStrengthAir');
                            armOneStrengthAir.getComponent(cc.Label).string = robot.armOneStrengthAir;
                        }   
                        var armOneStrengthLand = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_LAND');
                        if (armOneStrengthLand) {
                            // cc.log('find armOneStrengthLand');
                            armOneStrengthLand.getComponent(cc.Label).string = robot.armOneStrengthLand;
                        }  
                        var armOneStrengthSea = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_SEA');
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
            self.isFixed = true;
        }
    },

    showRobotInfo: function(event) {
        if (!event.detail.show) {
            this.node.opacity = 0;
            this.fixed();
            return;
        }
        // cc.log('showRobotInfo');
        var self = this;
        self.node.opacity = 255;
        var robot = event.detail.robot;
        self.unfixed(robot);
        // cc.log(robot.robotName);
        // cc.log('robot = ' + robot);
        // cc.log('event.detail.robotsIndex = ' + event.detail.robotsIndex);
        var nameNode = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_1/KW_UI_TEXT_ROBOT_NAME');
        if (nameNode) {
            // cc.log('find nameNode');
            nameNode.getComponent(cc.Label).string = robot.robotName;
        }
        var levelNode = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_1/KW_UI_TEXT_ROBOT_LEVEL');
        if (levelNode) {
            // cc.log('find levelNode');
            levelNode.getComponent(cc.Label).string = robot.level;
        } 
        var maneuverNode = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_1/KW_UI_TEXT_ROBOT_MANEUVER');
        if (maneuverNode) {
            // cc.log('find maneuverNode');
            maneuverNode.getComponent(cc.Label).string = robot.maneuver;
        } 
        var strengthNode = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_1/KW_UI_TEXT_ROBOT_STRENGTH');
        if (strengthNode) {
            // cc.log('find strengthNode');
            strengthNode.getComponent(cc.Label).string = robot.strength;
        } 
        var defenceNode = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_1/KW_UI_TEXT_ROBOT_DEFENCE');
        if (defenceNode) {
            // cc.log('find defenceNode');
            defenceNode.getComponent(cc.Label).string = robot.defence;
        }  
        var speedNode = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_1/KW_UI_TEXT_ROBOT_SPEED');
        if (speedNode) {
            // cc.log('find speedNode');
            speedNode.getComponent(cc.Label).string = robot.speed;
        }  
        var spiritNode = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_1/KW_UI_TEXT_ROBOT_SPIRIT');
        if (spiritNode) {
            // cc.log('find spiritNode');
            spiritNode.getComponent(cc.Label).string = robot.spirit + '/' + robot.spiritMax;
        }                                  
        var hpNode = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_1/KW_UI_TEXT_ROBOT_HP');
        if (hpNode) {
            // cc.log('find hpNode');
            hpNode.getComponent(cc.Label).string = robot.hp + '/' + robot.hpMax;
        }
        var expNode = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_1/KW_UI_TEXT_ROBOT_EXP');
        if (expNode) {
            // cc.log('find expNode');
            expNode.getComponent(cc.Label).string = robot.exp;
        }    
        var expNeedNode = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_1/KW_UI_TEXT_ROBOT_EXP_NEED');
        if (expNeedNode) {
            // cc.log('find expNeedNode');
            expNeedNode.getComponent(cc.Label).string = robot.expNeed;
        }

        var armOneName = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_ARM_NAME_1');
        if (armOneName) {
            // cc.log('find armOneName');
            armOneName.getComponent(cc.Label).string = robot.armOneName;
        }  
        var armTwoName = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_ARM_NAME_2');
        if (armTwoName) {
            // cc.log('find armTwoName');
            armTwoName.getComponent(cc.Label).string = robot.armTwoName;
        }  
        var armOneHitRate = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_HIT_RATE');
        if (armOneHitRate) {
            // cc.log('find armOneHitRate');
            armOneHitRate.getComponent(cc.Label).string = robot.armOneHitRate;
        }   
        var armOneRange = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_HIT_RANGE');
        if (armOneRange) {
            // cc.log('find armOneRange');
            armOneRange.getComponent(cc.Label).string = robot.armOneRange;
        } 
        var armOneStrengthAir = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_AIR');
        if (armOneStrengthAir) {
            // cc.log('find armOneStrengthAir');
            armOneStrengthAir.getComponent(cc.Label).string = robot.armOneStrengthAir;
        }   
        var armOneStrengthLand = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_LAND');
        if (armOneStrengthLand) {
            // cc.log('find armOneStrengthLand');
            armOneStrengthLand.getComponent(cc.Label).string = robot.armOneStrengthLand;
        }  
        var armOneStrengthSea = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_ARM_INFO/KW_UI_TEXT_STRENGTH_SEA');
        if (armOneStrengthSea) {
            // cc.log('find armOneStrengthSea');
            armOneStrengthSea.getComponent(cc.Label).string = robot.armOneStrengthSea;
        }   
        var post = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_DRIVER_INFO/KW_UI_TEXT_POST');
        if (post) {
            // cc.log('find post');
            post.getComponent(cc.Label).string = robot.post;
        }  
        var driverName = cc.find('Canvas/KW_UI_PANEL_INFO/KW_UI_PANEL_ROBOT_INFO_PART_2/KW_UI_PANEL_DRIVER_INFO/KW_UI_TEXT_DRIVER_NAME');
        if (driverName) {
            // cc.log('find driverName');
            driverName.getComponent(cc.Label).string = robot.driverName;
        }                                                                                        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
