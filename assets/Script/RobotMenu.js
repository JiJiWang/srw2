cc.Class({
    extends: cc.Component,

    properties: {
        selector: {
            default: null,
            type: cc.Node
        },
        robotInfo: {
            default: null,
            type: cc.Node            
        },
        gameInfo: {
            default: null,
            type: cc.Node            
        },        
    },

    // use this for initialization
    onLoad: function () {
        var root = cc.find('Canvas');
        if (root) {
            this.GameData = root.getComponent('GameData');
        }
        this.menux = 1;
        this.menuy = 1;
        this.isExist = [
            [false, false, false],
            [false, false, false]
        ];
        this.menuID = [
            [this.GameData.MenuID.NONE, this.GameData.MenuID.NONE, this.GameData.MenuID.NONE], 
            [this.GameData.MenuID.NONE, this.GameData.MenuID.NONE, this.GameData.MenuID.NONE]
        ];
        this.isFixed = true;
        this.accLeft = false;
        this.accRight = false;
        this.accUp = false;
        this.accDown = false;
        this.node.on('GameControl:ShowRobotMenu', function ( event ) {
            this.showRobotMenu(event);
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
  
    unfixed: function() {
        var self = this;
        if (self.isFixed) {
            // cc.log('self.keySensibility = ' + self.keySensibility);
            var interval = cc.delayTime(self.keySensibility);
            var callback = cc.callFunc(function () {
                if (self.accLeft) {
                    self.moveSelector(-1, 0);
                } else if (self.accRight) {
                    self.moveSelector(1, 0);
                }
                if (self.accDown) {
                    self.moveSelector(0, 1);
                } else if (self.accUp) {
                    self.moveSelector(0, -1);
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
            self.gameInfo.opacity = 0;
            self.robotInfo.opacity = 0;
        }
    },

    moveSelector: function(dx, dy) {
        var self = this;
        var menux = self.menux + dx;
        var menuy = self.menuy + dy;
        // cc.log('Canvas/KW_UI_PANEL_ROBOT_MENU/KW_UI_POS_MENU_' + menux + '_' + menuy);
        var findnode = cc.find('Canvas/KW_UI_PANEL_ROBOT_MENU/KW_UI_POS_MENU_' + menux + '_' + menuy);
        if (findnode && self.isExist[menux - 1][menuy - 1]) {
            // cc.log('isExist[' + (menux - 1) + '][' + (menuy - 1) + '] = ' + self.isExist[menux - 1][menuy - 1]);
            self.selector.x = findnode.x;
            self.selector.y = findnode.y;
            self.menux = menux;
            self.menuy = menuy;
        }
        // else {
        //     cc.log('findnode is null');
        // }
    },

    getMenuID: function() {
        return this.menuID[this.menux - 1][this.menuy - 1];
    },

    showRobotMenu: function(event) {
        if (!event.detail.show) {
            this.node.opacity = 0;
            this.fixed();
            return;
        }
        // cc.log('showRobotMenu');
        var self = this;
        self.node.opacity = 255;
        var robot = event.detail.robot;
        this.unfixed();
        // cc.log(robot.robotName);
        // cc.log('robot = ' + robot);
        // cc.log('event.detail.robotsIndex = ' + event.detail.robotsIndex);
        if (event.detail.flag) {
            self.robotInfo.opacity = 255;           
            var name = cc.find('Canvas/KW_UI_PANEL_ROBOT_MENU/KW_UI_PANEL_ROBOT_INFO/KW_UI_TEXT_ROBOT_NAME');
            if (name) {
                // cc.log('find name');
                name.getComponent(cc.Label).string = robot.robotName;
            }
            var hp = cc.find('Canvas/KW_UI_PANEL_ROBOT_MENU/KW_UI_PANEL_ROBOT_INFO/KW_UI_TEXT_ROBOT_HP');
            if (hp) {
                // cc.log('find hp');
                hp.getComponent(cc.Label).string = robot.hp + '/' + robot.hpMax;
            }
            var level = cc.find('Canvas/KW_UI_PANEL_ROBOT_MENU/KW_UI_PANEL_ROBOT_INFO/KW_UI_TEXT_ROBOT_LEVEL');
            if (level) {
                // cc.log('find level');
                level.getComponent(cc.Label).string = robot.level;
            }
        }
        else {
            self.gameInfo.opacity = 255;
            var round = cc.find('Canvas/KW_UI_PANEL_ROBOT_MENU/KW_UI_PANEL_GAME_INFO/KW_UI_TEXT_ROUND_NUM');
            if (round) {
                // cc.log('find round');
                round.getComponent(cc.Label).string = self.GameData.round;
            }
            var gold = cc.find('Canvas/KW_UI_PANEL_ROBOT_MENU/KW_UI_PANEL_GAME_INFO/KW_UI_TEXT_GOLD');
            if (gold) {
                // cc.log('find gold');
                gold.getComponent(cc.Label).string = self.GameData.gold + 'G';
            }            
        }
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 3; j++) {
                var menu = cc.find('Canvas/KW_UI_PANEL_ROBOT_MENU/KW_UI_TEXT_MENU_' + (i + 1) + '_' + (j + 1));
                if (menu) {
                    // cc.log('find menu_' + (i + 1) + '_' + (j + 1) + ' , menu text = ' + event.detail.menu[i][j]);
                    menu.getComponent(cc.Label).string = self.GameData.MenuName[event.detail.menu[i][j]];
                }                 
                if (event.detail.menu[i][j] == self.GameData.MenuID.NONE) {
                    self.isExist[i][j] = false;
                }
                else {
                    self.isExist[i][j] = true;
                }
                this.menuID[i][j] = event.detail.menu[i][j];
            }
        }                
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
