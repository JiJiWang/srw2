cc.Class({
    extends: cc.Component,

    properties: {
        KeySensibility: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.ok = false;
        this.cancle = false;
        this.down = false;
        this.up = false;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.MenuID = cc.Enum({
            NONE: 0,
            MOVE: 1,
            INFO: 2,
            SPIRIT: 3,
            ARM: 4,
            ATTACK: 5,
            STANDBY: 6,
            ROUND_OVER: 7,
            TOOLS: 8,
            SAVE: 9,
            TROOPS: 10,
            SWITCH: 11,
            GOAL: 12,
        });
        this.MenuName = [
            '',
            '移动',
            '状态',
            '精神',
            '武器',
            '攻击', 
            '待命',
            '回合结束',           
            '工具',           
            '储存',           
            '部队表',           
            '开关',           
            '目标',           
        ];
        this.GameState = cc.Enum({
            NONE: 0,
            SELECTING_ROBOT: 1,
            SHOW_ROBOT_MENU: 2,
            SHOW_GAME_MENU: 3,
            MOVE_ROBOT: 4,
            SHOW_ROBOT_INFO: 5,
            SHOW_ROBOT_SPIRIT: 6,
            SELECT_ARM: 7,
            SHOW_ARM_INFO: 8,
            ATTACK: 9,
            ENEMY_ACTION: 10,
            GAME_START: 11,
        });
        this.round = 0;
        this.gold = 1000;
        this.enemys = new Array();
        this.robots = new Array();
        this.enemysAliveCount = 0;
        this.robotsAliveCount = 0;
        this.enemysAvailableCount = 0;
        this.robotsAvailableCount = 0;
        this.SquarePos = [
            cc.p(-1,  0),//left
            cc.p( 1,  0),//right
            cc.p( 0, -1),//bottom
            cc.p( 0,  1),//up
        ];
        this.RobotType = cc.Enum({
            AIR: 0,
            LAND: 1,
            SEA: 2,
        });
        this.StrRobotType = cc.Enum({
            AIR: '空',
            LAND: '陆',
            SEA: '海',
        });        
        this.Arm = [
            {
                ID: 0,
                NAME: '粒子炮',
                RATE: 95,
                RANGE: 4,
                DAMAGE: [150, 150, 0],             
            },
            {
                ID: 1,
                NAME: '20机枪',
                RATE: 120,
                RANGE: 1,
                DAMAGE: [90, 90, 90],             
            },
            {
                ID: 2,
                NAME: '导弹',
                RATE: 90,
                RANGE: 4,
                DAMAGE: [118, 118, 118],                            
            },
            {
                ID: 3,
                NAME: '修理装置',
                RATE: 0,
                RANGE: 1,
                DAMAGE: [100, 100, 100],                                           
            },            
            {
                ID: 4,
                NAME: '穿甲弹',
                RATE: 84,
                RANGE: 1,
                DAMAGE: [135, 135, 115],                                                         
            },
            {
                ID: 5,
                NAME: '光子射线',
                RATE: 115,
                RANGE: 1,
                DAMAGE: [115, 115, 0],                                                                       
            },
            {
                ID: 6,
                NAME: '盖塔战斧',
                RATE: 110,
                RANGE: 1,
                DAMAGE: [140, 110, 0],                                                                                      
            },
            {
                ID: 7,
                NAME: '盖塔射线',
                RATE: 80,
                RANGE: 1,
                DAMAGE: [160, 155, 0],                                                                                                    
            }, 
            {
                ID: 8,
                NAME: '光剑',
                RATE: 110,
                RANGE: 1,
                DAMAGE: [120, 120, 110],                                                                                                                   
            },
            {
                ID: 9,
                NAME: '光束剑',
                RATE: 85,
                RANGE: 1,
                DAMAGE: [140, 130, 0],                                                                                                                                  
            },  
            {
                ID: 10,
                NAME: '萨斯剑',
                RATE: 100,
                RANGE: 1,
                DAMAGE: [115, 115, 115],                                                                                                                                                 
            },
            {
                ID: 11,
                NAME: '左轮手枪',
                RATE: 80,
                RANGE: 1,
                DAMAGE: [130, 130, 130],                                                                                                                                                                 
            },
            {
                ID: 12,
                NAME: '三指叉',
                RATE: 110,
                RANGE: 1,
                DAMAGE: [80, 80, 80],                                                                                                                                                                 
            },
            {
                ID: 13,
                NAME: '连发枪',
                RATE: 100,
                RANGE: 1,
                DAMAGE: [90, 90, 90],                                                                                                                                                                 
            },            
        ];
        this.RobotInfo = [
            {
                ID: 0,
                NAME: '怀特',
                DRIVER: '乔',
                POST: '舰长',
                LEVEL: 1,
                TYPE: this.RobotType.AIR,
                MANEUVER: 5,
                SPIRIT: 30,
                STRENGTH: 80,
                DEFENCE: 40,
                SPEED: 35,
                HP: 400,
                HPMAX: 400,
                EXP: 0,
                EXPNEED: 30,
                ARM: [0, 1],
            },
            {
                ID: 1,
                NAME: '阿波罗A',
                DRIVER: '由美',
                POST: '驾驶员',
                LEVEL: 1,
                TYPE: this.RobotType.LAND,
                MANEUVER: 5,
                SPIRIT: 30,
                STRENGTH: 80,
                DEFENCE: 40,
                SPEED: 35,
                HP: 400,
                HPMAX: 400,
                EXP: 0,
                EXPNEED: 30,
                ARM: [2, 3],
            }, 
            {
                ID: 2,
                NAME: '金z',
                DRIVER: '加代',
                POST: '驾驶员',
                LEVEL: 1,
                TYPE: this.RobotType.AIR,
                MANEUVER: 5,
                SPIRIT: 50,
                STRENGTH: 85,
                DEFENCE: 70,
                SPEED: 45,
                HP: 360,
                HPMAX: 360,
                EXP: 0,
                EXPNEED: 30,
                ARM: [4, 5],
            },
            {
                ID: 3,
                NAME: '盖塔',
                DRIVER: '龙',
                POST: '驾驶员',
                LEVEL: 1,
                TYPE: this.RobotType.AIR,
                MANEUVER: 7,
                SPIRIT: 50,
                STRENGTH: 90,
                DEFENCE: 55,
                SPEED: 55,
                HP: 310,
                HPMAX: 310,
                EXP: 0,
                EXPNEED: 30,
                ARM: [6, 7],
            },   
            {
                ID: 4,
                NAME: '刚达',
                DRIVER: '大卫',
                POST: '驾驶员',
                LEVEL: 1,
                TYPE: this.RobotType.LAND,
                MANEUVER: 6,
                SPIRIT: 40,
                STRENGTH: 70,
                DEFENCE: 55,
                SPEED: 72,
                HP: 320,
                HPMAX: 320,
                EXP: 0,
                EXPNEED: 30,
                ARM: [8, 9],
            }, 
            {
                ID: 5,
                NAME: '泰勒',
                DRIVER: '杰克',
                POST: '驾驶员',
                LEVEL: 1,
                TYPE: this.RobotType.LAND,
                MANEUVER: 6,
                SPIRIT: 40,
                STRENGTH: 70,
                DEFENCE: 45,
                SPEED: 52,
                HP: 290,
                HPMAX: 290,
                EXP: 0,
                EXPNEED: 30,
                ARM: [10, 11],
            },  
            {
                ID: 6,
                NAME: '佐克',
                DRIVER: '士兵',
                POST: '驾驶员',
                LEVEL: 1,
                TYPE: this.RobotType.LAND,
                MANEUVER: 4,
                SPIRIT: 0,
                STRENGTH: 40,
                DEFENCE: 28,
                SPEED: 55,
                HP: 180,
                HPMAX: 180,
                EXP: 0,
                EXPNEED: 30,
                ARM: [10, 11],
            },                                                                    
        ];
    },

    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    cacheEnemys: function (enemys) {
        for (var i = 0; i < enemys.length; i++) {
            this.enemys[i] =  enemys[i].getComponent('Enemy');
        }
        this.enemysAliveCount = enemys.length;         
    },

    cacheRobots: function (robots) {
        for (var i = 0; i < robots.length; i++) {
            this.robots[i] =  robots[i].getComponent('Robot');
        }   
        this.robotsAliveCount = robots.length;           
    },

    roundReset: function() {
        this.round++;
        var array = this.enemys;
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (element.isAlive) {
                element.node.color = new cc.Color(255, 255, 255);
                element.isMoved = false;                
            }
        }
        this.robotsAvailableCount = 0;
        var array = this.robots;
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (element.isAlive) {
                element.node.color = new cc.Color(255, 255, 255);
                element.isMoved = false;
                this.robotsAvailableCount++;
            }
        }       
    },

    roundOver: function() {
        this.enemysAvailableCount = 0;
        var array = this.enemys;
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (element.isAlive) {               
                this.enemysAvailableCount++;
            }
        }
        var array = this.robots;
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (element.isAlive) {
                element.isMoved = true;
                element.node.color = new cc.Color(160, 160, 160);
            }
        }         
    },

    decEnemysAvailableCount: function() {
        this.enemysAvailableCount--;
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onKeyUp: function (event) {
        switch(event.keyCode) {
            case cc.KEY.j:
                this.ok = true;
                break;
            case cc.KEY.k:
                this.cancle = true;
                break;  
            case cc.KEY.s:
                this.down = true;
                break;
            case cc.KEY.w:
                this.up = true;
                break;                
        }
    },    
});
// module.exports = GameData;