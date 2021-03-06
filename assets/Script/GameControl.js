cc.Class({
    extends: cc.Component,

    properties: () => ({
        GameData: {
            default: null,
            type: require('GameData')            
        },  
        gameSelector:{
            default: null,
            type: require('GameSelector')
        },
        map:{
            default: null,
            type: require('GameMap')
        },        
        robotMenu: {
            default: null,
            type: require('RobotMenu')
        },
        robotInfo: {
            default: null,
            type: require('ShowInfo')
        },
        armInfo: {
            default: null,
            type: require('ArmInfo')
        },
        troopsInfo: {
            default: null,
            type: require('TroopsInfo')
        },
        goal: {
            default: null,
            type: require('Talk')
        },
        save: {
            default: null,
            type: require('Talk')
        }, 
        switchs: {
            default: null,
            type: require('Talk')
        }, 
        tools: {
            default: null,
            type: require('Talk')
        },
        blueMusic: {
            default: null,
            url: cc.AudioClip    
        },  
        redMusic: {
            default: null,
            url: cc.AudioClip    
        },                                
    }),

    onLoad: function () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.isFixed = true;
        this.isSelectedSth = false;
        this.gameState = this.GameData.GameState.GAME_START;
        this.selectingRobot = null;
        this.selectingEnemy = null;
        // this.audioID = [0, 0];
        this.GameData.roundReset();
    },

    onGameStart: function() {
        this.GameData.gameStart.fixed();
        this.gameState = this.GameData.GameState.NONE;
        this.GameData.gameScene.active = true;
        this.unfixed(); 
        cc.audioEngine.stopAll();
        // this.audioID[0] = cc.audioEngine.play(this.blueMusic, true, 1);
        cc.audioEngine.play(this.blueMusic, true, 1);  
    },

    onGameOver: function() {
        this.gameState = this.GameData.GameState.NONE;
        this.fixed(); 
        cc.audioEngine.stopAll();
        var fadeout = cc.fadeOut(2).easing(cc.easeCubicActionIn());
        this.GameData.gameScene.runAction(fadeout);
        this.GameData.gameOver.onGameOver();
    },

    onRobotMoved: function(robot) {
        var self = this; 
        if (robot.node.group == "Blue"){
            if (self.selectingRobot.isMoved) {
                var menu;
                if (self.isAttackable(self.selectingRobot, self.GameData.enemys)) {
                    // cc.log('isAttackable = true');
                    menu = [
                        [self.GameData.MenuID.ATTACK, self.GameData.MenuID.STANDBY, self.GameData.MenuID.NONE],
                        [self.GameData.MenuID.NONE, self.GameData.MenuID.NONE, self.GameData.MenuID.NONE]
                    ];                      
                }
                else {
                    // cc.log('isAttackable = false');
                    menu = [
                        [self.GameData.MenuID.STANDBY, self.GameData.MenuID.NONE, self.GameData.MenuID.NONE],
                        [self.GameData.MenuID.NONE, self.GameData.MenuID.NONE, self.GameData.MenuID.NONE]
                    ];               
                }
                self.robotMenu.showRobotMenu(self.selectingRobot, menu, true, 1);                
                self.gameSelector.fixed();
                self.gameState = self.GameData.GameState.SHOW_ROBOT_MENU;
            } 
        }
    },

    onSelectRed: function(robot) {
        if (this.gameState == this.GameData.GameState.NONE 
            || this.gameState == this.GameData.GameState.SELECTING_ROBOT
            || this.gameState == this.GameData.GameState.SELECTING_ENEMY) {
            this.selectingEnemy = robot;
            this.isSelectedSth = true;
            this.gameState = this.GameData.GameState.SELECTING_ENEMY;
        }         
    },

    onSelectBlue: function(robot) {       
        if (this.gameState == this.GameData.GameState.NONE 
            || this.gameState == this.GameData.GameState.SELECTING_ROBOT
            || this.gameState == this.GameData.GameState.SELECTING_ENEMY) {
            this.selectingRobot = robot;
            this.isSelectedSth = true;
            this.gameState = this.GameData.GameState.SELECTING_ROBOT;
        } 
    },

    onUnselect: function() {
        if (this.gameState == this.GameData.GameState.SELECTING_ROBOT) {
            this.selectingRobot = null;
            this.isSelectedSth = false;
            this.gameState = this.GameData.GameState.NONE;
        }
        if (this.gameState == this.GameData.GameState.SELECTING_ENEMY) {
            this.selectingEnemy = null;
            this.isSelectedSth = false;
            this.gameState = this.GameData.GameState.NONE;
        }                
    },

    fixed: function() {
        var self = this;
        if (!self.isFixed) {
            self.node.stopAllActions();
            self.isFixed = true;
        }
    },

    unfixed: function() {
        var self = this;
        if (self.isFixed) {
            var keySensibility = self.GameData.KeySensibility;
            var interval = cc.delayTime(keySensibility);
            var callback = cc.callFunc(function () {
                if (self.GameData.ok) {
                    self.onOK();
                    self.GameData.ok = false;
                    cc.log(self.GameData.getGameState(self.gameState));
                }
                else if (self.GameData.cancle) {
                    self.onCancle();
                    self.GameData.cancle = false;
                    cc.log(self.GameData.getGameState(self.gameState));
                }
            }, self);
            var sequence = cc.sequence(callback, interval);
            self.node.runAction(sequence.repeatForever());
            self.isFixed = false;
        }
    },

    onCancle: function() {
        var self = this;
        switch(self.gameState) {
            case self.GameData.GameState.NONE:
                break;
            case self.GameData.GameState.SELECTING_ROBOT:           
                break;            
            case self.GameData.GameState.SELECTING_ENEMY:
                self.robotInfo.showInfo(self.selectingEnemy, false);   
                self.gameSelector.unfixed();               
                break;    
            case self.GameData.GameState.SHOW_ROBOT_MENU:
                self.robotMenu.showRobotMenu(self.selectingRobot, null, false, 1);
                self.gameSelector.unfixed();
                if (self.isSelectedSth) {
                    self.gameState = self.GameData.GameState.SELECTING_ROBOT;
                }
                else {
                    self.gameState = self.GameData.GameState.NONE;
                }
                break;        
            case self.GameData.GameState.SHOW_GAME_MENU:
                if (self.isSelectedSth) {
                    self.gameState = self.GameData.GameState.SELECTING_ROBOT;
                }
                else {
                    self.gameState = self.GameData.GameState.NONE;
                }            
                break;            
            case self.GameData.GameState.MOVE_ROBOT:
                var x = self.selectingRobot.tilex;    
                var y = self.selectingRobot.tiley; 
                var maneuver = self.selectingRobot.getManeuver();   
                self.map.showRange(x, y, maneuver, false);         
                if (self.isSelectedSth) {
                    self.gameState = self.GameData.GameState.SELECTING_ROBOT;
                }
                else {
                    self.gameState = self.GameData.GameState.NONE;
                }
                break; 
            case self.GameData.GameState.SHOW_ROBOT_INFO:
                self.robotInfo.showInfo(self.selectingRobot, false);                 
                self.gameSelector.unfixed();
                if (self.isSelectedSth) {
                    self.gameState = self.GameData.GameState.SELECTING_ROBOT;
                }
                else {
                    self.gameState = self.GameData.GameState.NONE;
                }                         
                break;   
            case self.GameData.GameState.SHOW_ARM_INFO:
                self.armInfo.showArmInfo(self.selectingRobot, false);                   
                self.gameSelector.unfixed();
                if (self.isSelectedSth) {
                    self.gameState = self.GameData.GameState.SELECTING_ROBOT;
                }
                else {
                    self.gameState = self.GameData.GameState.NONE;
                }                         
                break; 
            case self.GameData.GameState.SELECT_ARM:
                var arm = self.armInfo.getArm();
                var x = self.selectingRobot.tilex;    
                var y = self.selectingRobot.tiley; 
                var maneuver = arm.RANGE;   
                self.map.showRange(x, y, maneuver, false);                 
                self.armInfo.showArmInfo(self.selectingRobot, false);
                self.gameSelector.unfixed();
                if (self.isSelectedSth) {
                    self.gameState = self.GameData.GameState.SELECTING_ROBOT;
                }
                else {
                    self.gameState = self.GameData.GameState.NONE;
                }                         
                break;
            case self.GameData.GameState.ATTACK:
                var arm = self.armInfo.getArm();
                var x = self.selectingRobot.tilex;    
                var y = self.selectingRobot.tiley; 
                var maneuver = arm.RANGE;   
                self.map.showRange(x, y, maneuver, false);  
                self.gameSelector.unfixed();
                if (self.isSelectedSth) {
                    self.gameState = self.GameData.GameState.SELECTING_ROBOT;
                }
                else {
                    self.gameState = self.GameData.GameState.NONE;
                }                         
                break;  
            case self.GameData.GameState.SHOW_TROOPS:  
                self.troopsInfo.showTroopsInfo(self.GameData.robots, false);
                self.gameSelector.unfixed();
                self.gameState = self.GameData.GameState.NONE;            
                break;  
            case self.GameData.GameState.SHOW_GOAL: 
                self.gameSelector.unfixed();
                self.goal.showTalk(null, false);
                self.gameState = self.GameData.GameState.NONE;                 
                break; 
            case self.GameData.GameState.SHOW_SAVE: 
                self.gameSelector.unfixed();
                self.save.showTalk(null, false);
                self.gameState = self.GameData.GameState.NONE;                 
                break;
            case self.GameData.GameState.SHOW_SWITCHS: 
                self.gameSelector.unfixed();
                self.switchs.showTalk(null, false);
                self.gameState = self.GameData.GameState.NONE;                 
                break;
            case self.GameData.GameState.SHOW_TOOLS: 
                self.gameSelector.unfixed();
                self.tools.showTalk(null, false);
                self.gameState = self.GameData.GameState.NONE;                 
                break;                                                                                                                                       
        }
    },

    onOK: function() {
        var self = this;
        switch(self.gameState) {
            case self.GameData.GameState.NONE:
                var menu = [
                    [self.GameData.MenuID.ROUND_OVER, self.GameData.MenuID.TOOLS, self.GameData.MenuID.SAVE],
                    [self.GameData.MenuID.TROOPS, self.GameData.MenuID.SWITCH, self.GameData.MenuID.GOAL]
                ];                    
                self.robotMenu.showRobotMenu(self.selectingRobot, menu, true, 0);
                self.gameSelector.fixed();
                self.gameState = self.GameData.GameState.SHOW_ROBOT_MENU;
                break;
            case self.GameData.GameState.SELECTING_ROBOT:    
                if (self.isSelectedSth) {
                    if (!self.selectingRobot.isMoved) {
                        if (self.isAttackable(self.selectingRobot, self.GameData.enemys)) {
                            var menu = [
                                [self.GameData.MenuID.MOVE, self.GameData.MenuID.INFO, self.GameData.MenuID.NONE],
                                [self.GameData.MenuID.ATTACK, self.GameData.MenuID.ARM, self.GameData.MenuID.NONE]
                            ]; 
                        }
                        else {
                            var menu = [
                                [self.GameData.MenuID.MOVE, self.GameData.MenuID.INFO, self.GameData.MenuID.NONE],
                                [self.GameData.MenuID.ARM, self.GameData.MenuID.NONE, self.GameData.MenuID.NONE]
                            ];                             
                        }                   
                        self.robotMenu.showRobotMenu(self.selectingRobot, menu, true, 1);
                        self.gameSelector.fixed();
                        self.gameState = self.GameData.GameState.SHOW_ROBOT_MENU;
                    }
                    else {
                        self.robotInfo.showInfo(self.selectingRobot, true);                   
                        self.gameSelector.fixed();                                    
                        self.gameState = self.GameData.GameState.SHOW_ROBOT_INFO;                          
                    }  
                }
                else {
                    var menu = [
                        [self.GameData.MenuID.ROUND_OVER, self.GameData.MenuID.TOOLS, self.GameData.MenuID.SAVE],
                        [self.GameData.MenuID.TROOPS, self.GameData.MenuID.SWITCH, self.GameData.MenuID.GOAL]
                    ];                    
                    self.robotMenu.showRobotMenu(self.selectingRobot, menu, true, 0);
                    self.gameSelector.fixed();
                    self.gameState = self.GameData.GameState.SHOW_ROBOT_MENU;                    
                }   
                break;
            case self.GameData.GameState.SELECTING_ENEMY:
                self.robotInfo.showInfo(self.selectingEnemy, true);
                self.gameSelector.fixed();                    
                break;
            case self.GameData.GameState.SHOW_ROBOT_MENU:
                self.robotMenu.showRobotMenu(self.selectingRobot, null, false, 1);
                var menu = self.robotMenu;
                var menuid = menu.getMenuID();
                // cc.log('menuid = ' + menuid);
                switch(menuid) {
                    case self.GameData.MenuID.NONE:
                        break;
                    case self.GameData.MenuID.MOVE:
                        self.gameSelector.unfixed();            
                        if (!self.selectingRobot.isMoved) {
                            var x = self.selectingRobot.tilex;    
                            var y = self.selectingRobot.tiley; 
                            var maneuver = self.selectingRobot.getManeuver();   
                            self.map.showRange(x, y, maneuver, true);                                     
                            self.gameState = self.GameData.GameState.MOVE_ROBOT;  
                        }
                        break;
                    case self.GameData.MenuID.INFO:
                        self.robotInfo.showInfo(self.selectingRobot, true);                   
                        self.gameSelector.fixed();                                    
                        self.gameState = self.GameData.GameState.SHOW_ROBOT_INFO;              
                        break;
                    case self.GameData.MenuID.ATTACK:
                        self.armInfo.showArmInfo(self.selectingRobot, true);                  
                        self.gameSelector.fixed();                     
                        self.gameState = self.GameData.GameState.SELECT_ARM;                 
                        break;
                    case self.GameData.MenuID.ARM:  
                        self.armInfo.showArmInfo(self.selectingRobot, true);                 
                        self.gameSelector.fixed();                     
                        self.gameState = self.GameData.GameState.SHOW_ARM_INFO;              
                        break;                        
                    case self.GameData.MenuID.STANDBY:
                        self.gameSelector.unfixed();            
                        self.gameState = self.GameData.GameState.SELECTING_ROBOT;              
                        break;                        
                    case self.GameData.MenuID.ROUND_OVER:   
                        self.roundOver();
                        cc.audioEngine.stopAll();  
                        // self.audioID[1] = cc.audioEngine.play(self.redMusic, true, 1);
                        cc.audioEngine.play(self.redMusic, true, 1);                   
                        self.enemyAction(self.GameData.enemys, self.GameData.robots);
                        break;                        
                    case self.GameData.MenuID.TOOLS:
                        self.gameSelector.unfixed();
                        self.tools.showTalk('没有工具', true);
                        self.gameState = self.GameData.GameState.SHOW_TOOLS;                       
                        break;                        
                    case self.GameData.MenuID.SAVE:
                        self.gameSelector.unfixed();
                        self.save.showTalk('不能储存', true);
                        self.gameState = self.GameData.GameState.SHOW_SAVE;                      
                        break;                        
                    case self.GameData.MenuID.TROOPS:
                        self.troopsInfo.showTroopsInfo(self.GameData.robots, true);
                        self.gameSelector.fixed();
                        self.gameState = self.GameData.GameState.SHOW_TROOPS;
                        break;                        
                    case self.GameData.MenuID.SWITCH:
                        // self.onGameOver();
                        self.gameSelector.unfixed();
                        self.switchs.showTalk('强制关闭动画', true);
                        self.gameState = self.GameData.GameState.SHOW_SWITCHS;                         
                        break;                        
                    case self.GameData.MenuID.GOAL:
                        self.gameSelector.fixed();
                        self.goal.showTalk('全歼敌人即胜利！', true);
                        self.gameState = self.GameData.GameState.SHOW_GOAL;                    
                        break;                                               
                }
                break;
            case self.GameData.GameState.SHOW_GAME_MENU:
                break;
            case self.GameData.GameState.MOVE_ROBOT:
                if (self.isMoveable(self.selectingRobot, self.gameSelector)) {
                    var x = self.selectingRobot.tilex;    
                    var y = self.selectingRobot.tiley; 
                    var maneuver = self.selectingRobot.getManeuver();   
                    self.map.showRange(x, y, maneuver, false);   
                    self.selectingRobot.move(self.gameSelector.tilex, self.gameSelector.tiley);
                }
                break;            
            case self.GameData.GameState.SHOW_ROBOT_INFO:            
                break;
            case self.GameData.GameState.SHOW_ARM_INFO:  
                break;  
            case self.GameData.GameState.SELECT_ARM:
                var arm = self.armInfo.getArm();
                var x = self.selectingRobot.tilex;    
                var y = self.selectingRobot.tiley; 
                var maneuver = arm.RANGE;   
                self.map.showRange(x, y, maneuver, true);                  
                self.armInfo.showArmInfo(self.selectingRobot, false);
                self.gameSelector.unfixed();                     
                self.gameState = self.GameData.GameState.ATTACK;              
                break;                                      
            case self.GameData.GameState.ATTACK:  
                var arm = self.armInfo.getArm();
                var isAttackedSuc = self.attack(self.selectingRobot, self.GameData.enemys, arm, self.gameSelector);
                if (isAttackedSuc) { 
                    var x = self.selectingRobot.tilex;    
                    var y = self.selectingRobot.tiley; 
                    var maneuver = arm.RANGE;   
                    self.map.showRange(x, y, maneuver, false);                    
                    self.selectingRobot.node.color = new cc.Color(160, 160, 160);
                    self.selectingRobot.isMoved = true;
                    self.gameState = self.GameData.GameState.NONE;
                }                       
                break;                             
            case self.GameData.GameState.ENEMY_ACTION:  
                break;      
            case self.GameData.GameState.SHOW_TROOPS:  
                self.troopsInfo.showTroopsInfo(self.GameData.robots, false);
                self.gameSelector.unfixed();
                self.gameState = self.GameData.GameState.NONE;            
                break;  
            case self.GameData.GameState.SHOW_GOAL: 
                self.gameSelector.unfixed();
                self.goal.showTalk(null, false);
                self.gameState = self.GameData.GameState.NONE;                 
                break;  
            case self.GameData.GameState.SHOW_SAVE: 
                self.gameSelector.unfixed();
                self.save.showTalk(null, false);
                self.gameState = self.GameData.GameState.NONE;                 
                break;
            case self.GameData.GameState.SHOW_SWITCHS: 
                self.gameSelector.unfixed();
                self.switchs.showTalk(null, false);
                self.gameState = self.GameData.GameState.NONE;                 
                break;
            case self.GameData.GameState.SHOW_TOOLS: 
                self.gameSelector.unfixed();
                self.tools.showTalk(null, false);
                self.gameState = self.GameData.GameState.NONE;                 
                break;                                                                       
        }
    },

    isAttackable: function(robot, enemys) {
        for (var i = 0; i < enemys.length; i++) {
            var enemy = enemys[i];
            if (enemy.isAlive) {
                var dx = Math.abs(enemy.tilex - robot.tilex);
                var dy = Math.abs(enemy.tiley - robot.tiley);
                var ds = dx + dy;
                var arm1 = robot.getArm(0);
                if (arm1.RANGE >= ds) {
                    return true;
                }
                var arm2 = robot.getArm(1);
                if (arm2.RANGE >= ds) {
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
        if (ds > 0 && ds <= robot.getManeuver()) {
            return true;
        } 
        return false;         
    },

    attack: function(robot, enemys, arm, gameSelector) {
        for (var i = 0; i < enemys.length; i++) {
            var enemy = enemys[i];
            if (enemy.isAlive) {
                if (enemy.tilex == gameSelector.tilex && enemy.tiley == gameSelector.tiley) {
                    enemy.injure(arm.AIR);
                    return true;
                } 
            }           
        }
        return false;
    },

    enemyAction: function(enemys, robots) {
        var self = this;
        var repeatTimes = self.GameData.enemysAvailableCount;
        // cc.log('repeatTimes = ' + repeatTimes);
        var dt = 3.5;
        var delay = cc.delayTime(dt);
        var callback = cc.callFunc(function() {
            for (var i = 0; i < enemys.length; i++) {
                var enemy = enemys[i];
                var isNoneAlive = this.isNoneAlive(robots);
                if (isNoneAlive) {
                    this.onGameOver();
                }                
                cc.log(enemy.getRobotName() + ' ' + i);
                if (enemy.isMoved) {
                    continue;
                }
                if (this.enemyAttack(enemy, robots)) {
                    return;
                }               
                this.enemyMove(enemy, enemys, robots);
                if (!enemy.isMoved) {
                    enemy.isMoved = true;
                    enemy.node.color = new cc.Color(160, 160, 160);                    
                }
                break; 
            }
        }.bind(self));
        var seq = cc.sequence(callback, delay).repeat(repeatTimes);
        self.node.runAction(seq);       

        var delay = cc.delayTime(dt * repeatTimes);
        var callback = cc.callFunc(function () {
            self.roundReset();
            cc.audioEngine.stopAll();
            // self.audioID[0] = cc.audioEngine.play(self.blueMusic, true, 1);
            cc.audioEngine.play(self.blueMusic, true, 1);            
        }.bind(self));
        var seq = cc.sequence(delay, callback);
        self.node.runAction(seq);
    },

    roundReset: function() {
        var self = this;
        self.GameData.roundReset();
        self.GameData.map.stopAllActions();
        self.GameData.map.x = -32;
        self.GameData.map.y = 120;
        self.gameSelector.node.x = 8;
        self.gameSelector.node.y = 0;
        self.gameSelector.tilex = 12;
        self.gameSelector.tiley = 22;
        self.gameSelector.unfixed();
        self.gameSelector.node.opacity = 255;
        self.selectingRobot = null;
        self.selectingEnemy = null;            
        self.gameState = self.GameData.GameState.NONE;
    },

    roundOver: function() {
        // cc.log('GameControl:roundOver');
        var self = this;
        self.GameData.roundOver();
        self.gameSelector.fixed();
        self.gameSelector.node.opacity = 0;   
    },

    isNoneAlive: function(robots) {
        var isNoneAlive = true;
        for (var i = 0; i < robots.length; i++) {
            var robot = robots[i];
            if (robot.isAlive) {
                isNoneAlive = false;
                break;
            }
        }
        return isNoneAlive;
    },

    enemyAttack: function(enemy, robots) {
        // cc.log('GameControl:enemyAttack');
        var self = this;
        for (var i = 0; i < robots.length; i++) {
            var robot = robots[i];
            if (robot.isAlive) {
                var dx = Math.abs(robot.tilex - enemy.tilex);
                var dy = Math.abs(robot.tiley - enemy.tiley);
                var ds = dx + dy;
                // cc.log('ds = ' + ds);
                var arm1 = enemy.getArm(0);
                if (arm1.RANGE >= ds) {
                    robot.injure(arm1.AIR);
                    enemy.isMoved = true;
                    enemy.node.color = new cc.Color(160, 160, 160);
                    return true;
                }
                var arm2 = enemy.getArm(1);
                if (arm2.RANGE >= ds) {
                    robot.injure(arm2.AIR);
                    enemy.isMoved = true;
                    enemy.node.color = new cc.Color(160, 160, 160);
                    return true;
                }     
            }       
        }
        return false;    
    },

    enemyMove: function(enemy, enemys, robots) {
        // cc.log('GameControl:enemyMove');
        var self = this;
        //closed robot array
        var cra = new Array();
        for (var i = 0; i < robots.length; i++) {
            var robot = robots[i];
            if (robot.isAlive) {
                var dx = Math.abs(robot.tilex - enemy.tilex);
                var dy = Math.abs(robot.tiley - enemy.tiley);
                var ds = dx + dy;
                cra.push([i, ds]);
            }
        }
        for (var k = 0; k < cra.length; k++) {
            for (var i = k + 1; i < cra.length; i++) {
                var tmp = [cra[i][0], cra[i][1]];
                if (cra[k][1] > cra[i][1]) {
                    cra[i][0] = cra[k][0];
                    cra[i][1] = cra[k][1];
                    cra[k][0] = tmp[0];
                    cra[k][1] = tmp[1];                    
                }
            }
        }
        for (var a = 0; a < cra.length; a++) {
            var closedRobot = robots[cra[a][0]];
            if (cra[a][1] <= 1) {
                return ;
            }            
            // cc.log('closedRobot.name = ' + closedRobot.getRobotName());
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
                    var endx = closedRobot.tilex + self.GameData.SquarePos[i].x;
                    var endy = closedRobot.tiley + self.GameData.SquarePos[i].y;
                    var dx = endx - enemy.tilex;
                    var dy = endy - enemy.tiley;
                    var dxa = Math.abs(endx - enemy.tilex);
                    var dya = Math.abs(endy - enemy.tiley);
                    var ds = dxa + dya;
                    var maneuver = enemy.getManeuver();
                    var dd = ds - maneuver;
                    if (dd > 0) {
                        var sx = 0;
                        if (dx != 0) {
                            sx = dx / dxa;
                        }
                        var sy = 0;
                        if (dy != 0) {
                            sy = dy / dya;
                        }                    
                        // cc.log('sx = ' + sx + ', sy = ' + sy + ', enemy.maneuver = ' + maneuver);
                        // cc.log('enemy.tilex = ' + enemy.tilex + ', enemy.tiley = ' + enemy.tiley);
                        var pa = new Array();
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
                                // cc.log('pa[' + index + '] = (' + x + ' , ' + y + ')');
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
                        // cc.log('paAvailable.mindi = ' + mindi + ', paAvailable.minds = ' + minds);
                        if (mindi < 0) {
                            return;
                        }                    
                        endx = paAvailable[mindi][0];                        
                        endy = paAvailable[mindi][1];                        
                    }

                    var followAction = cc.follow(enemy.node, cc.rect(0, 0, 256 * 2, 480));
                    self.GameData.map.runAction(followAction);         
                    enemy.move(endx, endy);
                    var callback = cc.callFunc(function() {
                        self.enemyAttack(enemy, robots);
                    }, enemy);
                    var delay = cc.delayTime(1.2);
                    var seq = cc.sequence(delay, callback);
                    self.node.runAction(seq);                    
                    return ;
                }
            }            
        }
    },
    
});
