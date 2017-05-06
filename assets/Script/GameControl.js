var GameData = require('GameData');
cc.Class({
    extends: cc.Component,

    properties: {
        GameData: {
            default: null,
            type: GameData            
        },  
        gameStart: {
            default: null,
            type: cc.Node
        },
        map: {
            default: [],
            type: [cc.Node]
        },
        gameSelector:{
            default: null,
            type: cc.Node
        },
        robotMenu: {
            default: null,
            type: cc.Node
        },
        gameMenu: {
            default: null,
            type: cc.Node
        },
        robotInfo: {
            default: null,
            type: cc.Node
        },
        robots: {
            default: [],
            type: [cc.Node]
        },
        enemys: {
            default: [],
            type: [cc.Node]            
        },
        armInfo: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        this.isFixed = true;
        this.GameData = this.node.getComponent('GameData');
        this.GameData.cacheEnemys(this.enemys);
        this.GameData.cacheRobots(this.robots);
        this.GameData.roundReset();
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.level = 0;
        this.gameState = this.GameData.GameState.GAME_START;
        this.selectingRobot = null;
        this.selectingEnemy = null;
        this.node.on('GameStart:Start', function(event) {
            cc.log('GameStart');
            // this.gameStart.destroy();
            // this.gameStart.stopAllActions();
            this.gameStart.active = false;
            this.gameState = this.GameData.GameState.NONE;
            this.map[this.level].active = true;
            this.gameSelector.active = true;
            this.unfixed();                
        }.bind(this));
        this.node.on('Robot:onCollisionEnter', function(event) {
            // cc.log('GameControl:Robot.onCollisionEnter');
            if (this.gameState != this.GameData.GameState.MOVE_ROBOT 
                && this.gameState != this.GameData.GameState.ATTACK) {
                this.selectingRobot = event.detail.robot;
                this.gameState = this.GameData.GameState.SELECTING_ROBOT;
            }
        }.bind(this));
        this.node.on('Enemy:onCollisionEnter', function(event) {
            cc.log('GameControl:Enemy.onCollisionEnter');
            if (this.gameState != this.GameData.GameState.MOVE_ROBOT) {
                this.selectingEnemy = event.detail.enemy;
                this.gameState = this.GameData.GameState.SELECTING_ENEMY;
            }
        }.bind(this));
        this.node.on('Robot:Moved', function(event) {
            // cc.log('GameControl:Robot.Moved');
            if (this.selectingRobot.isMoved) {
                var menu;
                if (this.isAttackable(this.selectingRobot, this.GameData.enemys)) {
                    // cc.log('isAttackable = true');
                    menu = [
                        [this.GameData.MenuID.ATTACK, this.GameData.MenuID.STANDBY, this.GameData.MenuID.NONE],
                        [this.GameData.MenuID.NONE, this.GameData.MenuID.NONE, this.GameData.MenuID.NONE]
                    ];                      
                }
                else {
                    // cc.log('isAttackable = false');
                    menu = [
                        [this.GameData.MenuID.STANDBY, this.GameData.MenuID.NONE, this.GameData.MenuID.NONE],
                        [this.GameData.MenuID.NONE, this.GameData.MenuID.NONE, this.GameData.MenuID.NONE]
                    ];               
                }
                this.robotMenu.emit('GameControl:ShowRobotMenu', {
                    robot: this.selectingRobot,
                    show: true,
                    flag: 1,
                    menu: menu,
                });                 
                this.gameSelector.emit('GameControl:Fixed');
                this.gameState = this.GameData.GameState.SHOW_ROBOT_MENU;
            }            
        }.bind(this));  
        // cc.log('this.gameState = ' + this.gameState);
    },

    unfixed: function() {
        var self = this;
        if (self.isFixed) {
            var keySensibility = self.GameData.KeySensibility;
            var interval = cc.delayTime(keySensibility);
            var callback = cc.callFunc(function () {
                if (self.GameData.ok) {
                    self.onKeyJReleased();
                    self.GameData.ok = false;
                    // cc.log('this.gameState = ' + self.gameState);
                }
                else if (self.GameData.cancle) {
                    self.onKeyKReleased();
                    self.GameData.cancle = false;
                    // cc.log('this.gameState = ' + self.gameState);
                }
            }, self);
            var sequence = cc.sequence(callback, interval);
            self.node.runAction(sequence.repeatForever());
            self.isFixed = false;
        }
    },

    onKeyKReleased: function() {
        var self = this;
        switch(self.gameState) {
            case self.GameData.GameState.NONE:
                self.gameSelector.emit('GameControl:Unfixed');
                // cc.log('onKeyKReleased:this.gameState.NONE');
                break;
            case self.GameData.GameState.SELECTING_ROBOT:           
                // cc.log('onKeyKReleased:this.gameState.SELECTING_ROBOT');
                break;                
            case self.GameData.GameState.SHOW_ROBOT_MENU:
                self.robotMenu.emit('GameControl:ShowRobotMenu', {
                    robot: self.selectingRobot,
                    show: false,
                });
                self.gameSelector.emit('GameControl:Unfixed');
                self.gameState = self.GameData.GameState.NONE;                
                // cc.log('onKeyKReleased:this.gameState.SHOW_ROBOT_MENU');
                break;        
            case self.GameData.GameState.SHOW_GAME_MENU:
                if (self.selectingRobot.isSelected) {
                    self.gameState = self.GameData.GameState.SELECTING_ROBOT;
                }
                else {
                    self.gameState = self.GameData.GameState.NONE;
                }            
                // cc.log('onKeyKReleased:this.gameState.SHOW_GAME_MENU');
                break;            
            case self.GameData.GameState.MOVE_ROBOT:
                self.map[self.level].emit('GameControl:ShowRange', {
                    x: self.selectingRobot.tilex,
                    y: self.selectingRobot.tiley,
                    maneuver: self.selectingRobot.maneuver,
                    show: false,
                });             
                if (self.selectingRobot.isSelected) {
                    self.gameState = self.GameData.GameState.SELECTING_ROBOT;
                }
                else {
                    self.gameState = self.GameData.GameState.NONE;
                }
                // cc.log('onKeyKReleased:this.gameState.MOVE_ROBOT');
                break; 
            case self.GameData.GameState.SHOW_ROBOT_INFO:
                self.robotInfo.emit('GameControl:ShowRobotInfo', {
                    robot: self.selectingRobot,
                    show: false,
                });                    
                self.gameSelector.emit('GameControl:Unfixed');
                if (self.selectingRobot.isSelected) {
                    self.gameState = self.GameData.GameState.SELECTING_ROBOT;
                }
                else {
                    self.gameState = self.GameData.GameState.NONE;
                }                         
                // cc.log('onKeyKReleased:this.gameState.SHOW_ROBOT_INFO');
                break;   
            case self.GameData.GameState.SHOW_ARM_INFO:
                self.armInfo.emit('GameControl:ShowArmInfo', {
                    robot: self.selectingRobot,
                    show: false,
                });                    
                self.gameSelector.emit('GameControl:Unfixed');
                if (self.selectingRobot.isSelected) {
                    self.gameState = self.GameData.GameState.SELECTING_ROBOT;
                }
                else {
                    self.gameState = self.GameData.GameState.NONE;
                }                         
                // cc.log('onKeyKReleased:this.gameState.SHOW_ROBOT_INFO');
                break; 
            case self.GameData.GameState.SELECT_ARM:
                var arm = self.armInfo.getComponent('ArmInfo').selectedArm;
                self.map[self.level].emit('GameControl:ShowRange', {
                    x: self.selectingRobot.tilex,
                    y: self.selectingRobot.tiley,
                    maneuver: arm.hitRange,
                    show: false,
                });
                self.armInfo.emit('GameControl:ShowArmInfo', {
                    robot: self.selectingRobot,
                    show: false,
                });
                self.gameSelector.emit('GameControl:Unfixed');
                if (self.selectingRobot.isSelected) {
                    self.gameState = self.GameData.GameState.SELECTING_ROBOT;
                }
                else {
                    self.gameState = self.GameData.GameState.NONE;
                }                         
                // cc.log('onKeyKReleased:this.gameState.SHOW_ROBOT_INFO');
                break;
            case self.GameData.GameState.ATTACK:
                var arm = self.armInfo.getComponent('ArmInfo').selectedArm;
                self.map[self.level].emit('GameControl:ShowRange', {
                    x: self.selectingRobot.tilex,
                    y: self.selectingRobot.tiley,
                    maneuver: arm.hitRange,
                    show: false,
                });
                self.gameSelector.emit('GameControl:Unfixed');
                if (self.selectingRobot.isSelected) {
                    self.gameState = self.GameData.GameState.SELECTING_ROBOT;
                }
                else {
                    self.gameState = self.GameData.GameState.NONE;
                }                         
                // cc.log('onKeyKReleased:this.gameState.ATTACK');
                break;                                                          
        }
    },

    onKeyJReleased: function() {
        var self = this;
        switch(self.gameState) {
            case self.GameData.GameState.NONE:
                var menu = [
                    [self.GameData.MenuID.ROUND_OVER, self.GameData.MenuID.TOOLS, self.GameData.MenuID.SAVE],
                    [self.GameData.MenuID.TROOPS, self.GameData.MenuID.SWITCH, self.GameData.MenuID.GOAL]
                ];                    
                self.robotMenu.emit('GameControl:ShowRobotMenu', {
                    robot: self.selectingRobot,
                    show: true,
                    flag: 0,
                    menu: menu,
                });
                self.gameSelector.emit('GameControl:Fixed');
                self.gameState = self.GameData.GameState.SHOW_ROBOT_MENU;
                // cc.log('onKeyJReleased:this.gameState.NONE');
                break;
            case self.GameData.GameState.SELECTING_ROBOT:    
                if (self.selectingRobot.isSelected) {
                    if (!self.selectingRobot.isMoved) {
                        var menu = [
                            [self.GameData.MenuID.MOVE, self.GameData.MenuID.INFO, self.GameData.MenuID.NONE],
                            [self.GameData.MenuID.ATTACK, self.GameData.MenuID.ARM, self.GameData.MenuID.NONE]
                        ];                    
                        self.robotMenu.emit('GameControl:ShowRobotMenu', {
                            robot: self.selectingRobot,
                            show: true,
                            flag: 1,
                            menu: menu,
                        });
                        self.gameSelector.emit('GameControl:Fixed');
                        self.gameState = self.GameData.GameState.SHOW_ROBOT_MENU;
                    }  
                }
                else {
                    var menu = [
                        [self.GameData.MenuID.ROUND_OVER, self.GameData.MenuID.TOOLS, self.GameData.MenuID.SAVE],
                        [self.GameData.MenuID.TROOPS, self.GameData.MenuID.SWITCH, self.GameData.MenuID.GOAL]
                    ];                    
                    self.robotMenu.emit('GameControl:ShowRobotMenu', {
                        robot: self.selectingRobot,
                        show: true,
                        flag: 0,
                        menu: menu,
                    });
                    self.gameSelector.emit('GameControl:Fixed');
                    self.gameState = self.GameData.GameState.SHOW_ROBOT_MENU;                    
                }   
                // cc.log('onKeyJReleased:this.gameState.SELECTING_ROBOT');
                break;
            case self.GameData.GameState.SHOW_ROBOT_MENU:
                self.robotMenu.emit('GameControl:ShowRobotMenu', {
                    robot: self.selectingRobot,
                    show: false,
                });
                var menu = self.robotMenu.getComponent('RobotMenu');
                var menuid = menu.getMenuID();
                // cc.log('menuid = ' + menuid);
                switch(menuid) {
                    case self.GameData.MenuID.NONE:
                        break;
                    case self.GameData.MenuID.MOVE:
                        // var map = self.map[self.level];
                        self.gameSelector.emit('GameControl:Unfixed');            
                        if (!self.selectingRobot.isMoved) {
                            self.map[self.level].emit('GameControl:ShowRange', {
                                x: self.selectingRobot.tilex,
                                y: self.selectingRobot.tiley,
                                maneuver: self.selectingRobot.maneuver,
                                show: true,
                            });        
                            self.gameState = self.GameData.GameState.MOVE_ROBOT;  
                        }
                        break;
                    case self.GameData.MenuID.INFO:
                        self.robotInfo.emit('GameControl:ShowRobotInfo', {
                            robot: self.selectingRobot,
                            show: true,
                        });                    
                        self.gameSelector.emit('GameControl:Fixed');                                    
                        self.gameState = self.GameData.GameState.SHOW_ROBOT_INFO;              
                        break;
                    case self.GameData.MenuID.ATTACK:
                        self.armInfo.emit('GameControl:ShowArmInfo', {
                            robot: self.selectingRobot,
                            show: true,
                        });                    
                        self.gameSelector.emit('GameControl:Fixed');                     
                        self.gameState = self.GameData.GameState.SELECT_ARM;                 
                        break;
                    case self.GameData.MenuID.ARM:
                        self.armInfo.emit('GameControl:ShowArmInfo', {
                            robot: self.selectingRobot,
                            show: true,
                        });                    
                        self.gameSelector.emit('GameControl:Fixed');                     
                        self.gameState = self.GameData.GameState.SHOW_ARM_INFO;              
                        break;                        
                    case self.GameData.MenuID.STANDBY:
                        self.gameSelector.emit('GameControl:Unfixed');            
                        break;                        
                    case self.GameData.MenuID.ROUND_OVER:   
                        self.roundOver();                   
                        self.enemyAction(self.GameData.enemys, self.GameData.robots);
                        // self.gameState = self.GameData.GameState.ENEMY_ACTION;                     
                        break;                        
                    case self.GameData.MenuID.TOOLS:
                        break;                        
                    case self.GameData.MenuID.SAVE:
                        break;                        
                    case self.GameData.MenuID.TROOPS:
                        break;                        
                    case self.GameData.MenuID.SWITCH:
                        break;                        
                    case self.GameData.MenuID.GOAL:
                        break;                        
                }
                // cc.log('onKeyJReleased:this.gameState.SHOW_ROBOT_MENU');
                break;
            case self.GameData.GameState.SHOW_GAME_MENU:
                // cc.log('onKeyJReleased:this.gameState.SHOW_GAME_MENU');
                break;
            case self.GameData.GameState.MOVE_ROBOT:
                var gameSelector = self.gameSelector.getComponent('GameSelector');
                if (self.isMoveable(self.selectingRobot, gameSelector)) {
                    self.map[self.level].emit('GameControl:ShowRange', {
                        x: self.selectingRobot.tilex,
                        y: self.selectingRobot.tiley,
                        maneuver: self.selectingRobot.maneuver,
                        show: false,
                    });  
                    self.selectingRobot.node.emit('GameControl:Move', {
                        x: gameSelector.tilex,
                        y: gameSelector.tiley,
                    });
                    self.gameState = self.GameData.GameState.NONE;
                }
                // else {
                //     cc.log('Out of robot maneuver range');
                // }
                // cc.log('onKeyJReleased:this.gameState.MOVE_ROBOT');
                break;            
            case self.GameData.GameState.SHOW_ROBOT_INFO:            
                // cc.log('onKeyJReleased:this.gameState.SHOW_ROBOT_INFO');
                break;
            case self.GameData.GameState.SHOW_ARM_INFO:  
                // cc.log('onKeyJReleased:this.gameState.SHOW_ARM_INFO');
                break;  
            case self.GameData.GameState.SELECT_ARM:
                var arm = self.armInfo.getComponent('ArmInfo').selectedArm;
                self.map[self.level].emit('GameControl:ShowRange', {
                    x: self.selectingRobot.tilex,
                    y: self.selectingRobot.tiley,
                    maneuver: arm.hitRange,
                    show: true,
                });
                self.armInfo.emit('GameControl:ShowArmInfo', {
                    robot: self.selectingRobot,
                    show: false,
                });
                self.gameSelector.emit('GameControl:Unfixed');                     
                self.gameState = self.GameData.GameState.ATTACK;              
                // cc.log('onKeyJReleased:this.gameState.SELECT_ARM');
                break;                                      
            case self.GameData.GameState.ATTACK:  
                var gameSelector = self.gameSelector.getComponent('GameSelector');
                var arm = self.armInfo.getComponent('ArmInfo').selectedArm;
                var isAttackedSuc = self.attack(self.selectingRobot, self.GameData.enemys, arm, gameSelector);
                if (isAttackedSuc) {
                    self.map[self.level].emit('GameControl:ShowRange', {
                        x: self.selectingRobot.tilex,
                        y: self.selectingRobot.tiley,
                        maneuver: arm.hitRange,
                        show: false,
                    });  
                    self.selectingRobot.node.color = new cc.Color(160, 160, 160);
                    self.selectingRobot.isMoved = true;
                    self.gameState = self.GameData.GameState.NONE;
                }                       
                // cc.log('onKeyJReleased:this.gameState.ATTACK');
                break;                             
            case self.GameData.GameState.ENEMY_ACTION:  
                // cc.log('onKeyJReleased:this.gameState.ENEMY_ACTION');
                break;                             
        }
    },

    isAttackable: function(robot, enemys) {
        for (var i = 0; i < enemys.length; i++) {
            // var enemy = enemys[i].getComponent('Enemy');
            var enemy = enemys[i];
            if (enemy.isAlive) {
                var dx = Math.abs(enemy.tilex - robot.tilex);
                var dy = Math.abs(enemy.tiley - robot.tiley);
                var ds = dx + dy;
                // cc.log('ds = ' + ds);
                if (robot.armOneRange >= ds) {
                    return true;
                }
                if (robot.armTwoRange >= ds) {
                    return true;
                }     
            }       
        }
        return false;
    },

    isMoveable: function(robot, gameSelector) {
        var dx = Math.abs(robot.tilex - gameSelector.tilex);
        var dy = Math.abs(robot.tiley - gameSelector.tiley);
        var ds = dx + dy;
        // cc.log('dx = ' + dx + ' , dy = ' + dy);                
        // cc.log('gameSelector.tilex = ' + gameSelector.tilex + ' , gameSelector.tiley = ' + gameSelector.tiley);   
        if (ds > 0 && ds <= robot.maneuver) {
            return true;
        } 
        return false;         
    },

    attack: function(robot, enemys, arm, gameSelector) {
        cc.log('gameSelector.tilex = ' + gameSelector.tilex + ', gameSelector.tiley = ' + gameSelector.tiley);
        for (var i = 0; i < enemys.length; i++) {
            // var enemy = enemys[i].getComponent('Enemy');
            var enemy = enemys[i];
            if (enemy.isAlive) {
                cc.log('enemy.tilex = ' + enemy.tilex + ', enemy.tiley = ' + enemy.tiley);
                if (enemy.tilex == gameSelector.tilex && enemy.tiley == gameSelector.tiley) {
                    enemy.injure(arm.strengthAir);
                    return true;
                } 
            }           
        }
        return false;
    },

    enemyAction: function(enemys, robots) {
        var self = this;
        var repeatTimes = self.GameData.enemysAvailableCount;
        cc.log('repeatTimes = ' + repeatTimes);
        var dt = 3;
        var delay = cc.delayTime(dt);
        var callback = cc.callFunc(function() {
            for (var i = 0; i < enemys.length; i++) {
                var enemy = enemys[i];
                if (enemy.isMoved) {
                    continue;
                }
                if (self.enemyAttack(enemy, robots)) {
                    return;
                }               
                self.enemyMove(enemy, enemys, robots);
                // cc.log('after this.enemyMove executed, enemy.isMoved = ' + enemy.isMoved);
                // self.enemyAttack(enemy, robots); 
                if (!enemy.isMoved) {
                    enemy.isMoved = true;
                    enemy.node.color = new cc.Color(160, 160, 160);                    
                }
                break; 
            }
        }.bind(self));
        var seq = cc.sequence(callback, delay).repeat(repeatTimes);
        // var seq = cc.sequence(callback, delay);
        self.node.runAction(seq);       

        var delay = cc.delayTime(dt * repeatTimes);
        var callback = cc.callFunc(function () {
            self.roundReset();
        }.bind(self));
        var seq = cc.sequence(delay, callback);
        self.node.runAction(seq);
    },

    roundReset: function() {
        var self = this;
        self.GameData.roundReset();
        self.map[self.level].stopAllActions();
        self.map[self.level].x = -32;
        self.map[self.level].y = 120;
        // cc.log('all enemy is moved');
        self.gameSelector.x = 8;
        self.gameSelector.y = 0;
        self.gameSelector.getComponent('GameSelector').tilex = 12;
        self.gameSelector.getComponent('GameSelector').tiley = 22;
        self.gameSelector.emit('GameControl:Unfixed');
        self.gameSelector.opacity = 255;
        self.selectingRobot = null;
        self.selectingEnemy = null;            
        self.gameState = self.GameData.GameState.NONE;
    },

    roundOver: function() {
        var self = this;
        self.GameData.roundOver();
        self.gameSelector.emit('GameControl:Fixed');
        self.gameSelector.opacity = 0;         
    },

    enemyAttack: function(enemy, robots) {
        // if (enemy.isMoved) {
        //     return false;
        // }
        for (var i = 0; i < robots.length; i++) {
            var robot = robots[i];
            if (robot.isAlive) {
                var dx = Math.abs(robot.tilex - enemy.tilex);
                var dy = Math.abs(robot.tiley - enemy.tiley);
                var ds = dx + dy;
                // cc.log('ds = ' + ds);
                if (enemy.armOneRange >= ds) {
                    robot.injure(enemy.armOneStrengthAir);
                    enemy.isMoved = true;
                    enemy.node.color = new cc.Color(160, 160, 160);
                    return true;
                }
                if (enemy.armTwoRange >= ds) {
                    robot.injure(enemy.armTwoStrengthAir);
                    enemy.isMoved = true;
                    enemy.node.color = new cc.Color(160, 160, 160);
                    return true;
                }     
            }       
        }    
    },

    enemyMove: function(enemy, enemys, robots) {
        var self = this;
        var cra = new Array();//closed robot array
        for (var i = 0; i < robots.length; i++) {
            // var robot = robots[i].getComponent('Robot');
            var robot = robots[i];
            if (robot.isAlive) {
                var dx = Math.abs(robot.tilex - enemy.tilex);
                var dy = Math.abs(robot.tiley - enemy.tiley);
                var ds = dx + dy;
                cra[i] = [i, ds];
            }
        }
        for (var k = 0; k < cra.length; k++) {
            for (var i = k + 1; i < cra.length; i++) {
                var tmp = cra[i];
                if (cra[k][1] > cra[i][1]) {
                    cra[i] = cra[k];
                    cra[k] = tmp;
                }
            }
        }
        for (var a = 0; a < cra.length; a++) {
            var closedRobot = robots[cra[a][0]];
            if (cra[a][1] <= 1) {
                return ;
            }            
            cc.log('closedRobot.name = ' + closedRobot.robotName);
            var isBlock = [false, false, false, false];
            for (var i = 0; i < robots.length; i++) {
                var robot = robots[i];
                if (!robot.isAlive) {
                    continue;
                }
                if (closedRobot == robot) {
                    continue;
                }
                var dx = robot.tilex - closedRobot.tilex;
                var dy = robot.tiley - closedRobot.tiley;
                var ds = Math.abs(dx) + Math.abs(dy);
                if (ds == 1) {
                    if (dx == -1) {
                        isBlock[0] = true;
                    }
                    if (dx == 1) {
                        isBlock[1] = true;
                    }  
                    if (dy == -1) {
                        isBlock[2] = true;
                    }
                    if (dy == 1) {
                        isBlock[3] = true;
                    }                                               
                }
            }
            for (var i = 0; i < enemys.length; i++) {
                var robot = enemys[i];
                if (!robot.isAlive) {
                    continue;
                }
                if (enemy == robot) {
                    continue;
                }
                var dx = robot.tilex - closedRobot.tilex;
                var dy = robot.tiley - closedRobot.tiley;
                var ds = Math.abs(dx) + Math.abs(dy);
                if (ds == 1) {
                    if (dx == -1) {
                        isBlock[0] = true;
                    }
                    if (dx == 1) {
                        isBlock[1] = true;
                    }  
                    if (dy == -1) {
                        isBlock[2] = true;
                    }
                    if (dy == 1) {
                        isBlock[3] = true;
                    }                                               
                }
            }
            for (var i = 0; i < isBlock.length; i++) {
                if (!isBlock[i]) {
                    var endx = closedRobot.tilex + this.GameData.SquarePos[i].x;
                    var endy = closedRobot.tiley + this.GameData.SquarePos[i].y;
                    var dx = endx - enemy.tilex;
                    var dy = endy - enemy.tiley;
                    var dxa = Math.abs(endx - enemy.tilex);
                    var dya = Math.abs(endy - enemy.tiley);
                    var ds = dxa + dya;
                    var dd = ds - enemy.maneuver;
                    // cc.log('ds = ' + ds + ', enemy.maneuver = ' + enemy.maneuver + ', dd = ' + dd);
                    if (dd > 0) {
                        var sx = 0;
                        if (dx != 0) {
                            sx = dx / dxa;
                        }
                        var sy = 0;
                        if (dy != 0) {
                            sy = dy / dya;
                        }                    
                        cc.log('sx = ' + sx + ', sy = ' + sy + ', enemy.maneuver = ' + enemy.maneuver);
                        cc.log('enemy.tilex = ' + enemy.tilex + ', enemy.tiley = ' + enemy.tiley);
                        var pa = new Array();
                        var maneuver = enemy.maneuver;
                        var tilex = enemy.tilex;
                        var tiley = enemy.tiley;
                        var index = 0;
                        for (var i = 0; i <= maneuver; i++) {
                            for (var j = 0; j <= maneuver - i; j++) {
                                pa[index] = new Array(2);
                                var x = tilex + sx * i;
                                var y = tiley + sy * j;
                                pa[index][0] = x;
                                pa[index][1] = y;
                                cc.log('pa[' + index + '] = (' + x + ' , ' + y + ')');
                                index++;
                                if (sy == 0) {
                                    break;
                                }
                            }
                            if (sx == 0) {
                                break;
                            }
                        }
                        var index = 0;
                        var paAvailable = new Array();
                        for (var i = pa.length - 1; i > 0; i--) {
                            // cc.log('pa[' + i + '] = (' + pa[i][0] + ' , ' + pa[i][1] + ')');
                            var isAvailable = true;
                            for (var k = 0; k < enemys.length; k++) {
                                var robot = enemys[k];
                                if (!robot.isAlive) {
                                    continue;
                                }                            
                                if (enemy == robot) {
                                    continue;
                                } 
                                if (robot.tilex == pa[i][0] && robot.tiley == pa[i][1]) {
                                    isAvailable = false;
                                    break;
                                }                                        
                            }
                            for (var k = 0; k < robots.length; k++) {
                                var robot = robots[k];
                                if (!robot.isAlive) {
                                    continue;
                                }                            
                                if (robot.tilex == pa[i][0] && robot.tiley == pa[i][1]) {
                                    isAvailable = false;
                                    break;
                                }                                        
                            }                            
                            if (isAvailable) {                                                      
                                paAvailable[index] = [pa[i][0], pa[i][1]];
                                index++;
                            }
                        } 
                        var minds = 1000;
                        var mindi = -1;
                        for (var i = 0; i < paAvailable.length; i++) {
                            var dx = Math.abs(paAvailable[i][0] - closedRobot.tilex);
                            var dy = Math.abs(paAvailable[i][1] - closedRobot.tiley);
                            var ds = dx + dy;
                            if (minds > ds) {
                                minds = ds;
                                mindi = i;
                            }                        
                        }
                        cc.log('paAvailable.mindi = ' + mindi + ', paAvailable.minds = ' + minds);
                        if (mindi < 0) {
                            return;
                        }                    
                        endx = paAvailable[mindi][0];                        
                        endy = paAvailable[mindi][1];                        
                    }
                    cc.log('endx = ' + endx + ' , endy = ' + endy);
                    var dx = (endx - enemy.tilex) * 16;
                    var dy = (enemy.tiley - endy) * 16;
                    enemy.tilex = endx;
                    enemy.tiley = endy;
                    var sx = Math.abs(dx);
                    var sy = Math.abs(dy);
                    var sxy = sx + sy;
                    var movex = cc.moveBy(sx / sxy, dx, 0).easing(cc.easeCubicActionIn());
                    var movey = cc.moveBy(sy / sxy, 0, dy).easing(cc.easeCubicActionOut());
                    var callback = cc.callFunc(function() {
                        enemy.node.color = new cc.Color(160, 160, 160);
                        self.enemyAttack(enemy, robots);
                    }, enemy);
                    var delay = cc.delayTime(0.2);
                    var seq = cc.sequence(movex, movey, delay, callback);
                    enemy.node.runAction(seq);
                    var followAction = cc.follow(enemy.node, cc.rect(0, 0, 320 * 2 - 100, 480));
                    self.map[self.level].runAction(followAction);         
                    enemy.isMoved = true;
                    return ;
                }
            }            
        }
    },
    
});
