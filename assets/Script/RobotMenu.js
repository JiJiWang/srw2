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
        robotInfo: {
            default: null,
            type: cc.Node            
        },
        gameInfo: {
            default: null,
            type: cc.Node            
        },
        infos: {
            default: [],
            type: [cc.Label]
        }, 
        round: {
            default: null,
            type: cc.Label              
        }, 
        gold: {
            default: null,
            type: cc.Label              
        },        
    }),

    onLoad: function () {
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
        this.node.on('GameControl:ShowRobotMenu', function ( event ) {
            this.showRobotMenu(event);
        }.bind(this));
    },
  
    unfixed: function() {
        var self = this;
        self.menux = 1;
        self.menuy = 1; 
        self.moveSelector(0, 0);         
        if (self.isFixed) {
            var interval = cc.delayTime(self.GameData.KeySensibility);
            var callback = cc.callFunc(function () {
                if (self.GameData.left) {
                    self.moveSelector(-1, 0);
                    self.GameData.left = false;
                } else if (self.GameData.right) {
                    self.moveSelector(1, 0);
                    self.GameData.right = false;
                }
                if (self.GameData.down) {
                    self.moveSelector(0, 1);
                    self.GameData.down = false;
                } else if (self.GameData.up) {
                    self.moveSelector(0, -1);
                    self.GameData.up = false;
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
        var findnode = cc.find('KW_UI_POS_MENU_' + menux + '_' + menuy, self.node);
        if (findnode && self.isExist[menux - 1][menuy - 1]) {
            self.selector.x = findnode.x;
            self.selector.y = findnode.y;
            self.menux = menux;
            self.menuy = menuy;
        }
    },

    getMenuID: function() {
        return this.menuID[this.menux - 1][this.menuy - 1];
    },

    showRobotMenu: function(event) {
        var self = this;
        if (!event.detail.show) {
            self.node.opacity = 0;
            self.fixed();
            return;
        }
        self.node.opacity = 255;
        var robot = event.detail.robot;
        self.unfixed();
        if (event.detail.flag) {
            self.robotInfo.opacity = 255; 
            var infosIndex = [
                'NAME',
                'HP',
                'HPMAX',
                'LEVEL',
            ];
            for (var i = 0; i < self.infos.length; i++) {
                self.infos[i].string = self.GameData.getRobot(robot.id)[infosIndex[i]];
            }                      
        }
        else {
            self.gameInfo.opacity = 255;
            self.round.string = self.GameData.getRound();
            self.gold.string = self.GameData.getGold() + 'G';          
        }
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 3; j++) {
                var menu = cc.find('KW_UI_TEXT_MENU_' + (i + 1) + '_' + (j + 1), self.node);
                if (menu) {
                    menu.getComponent(cc.Label).string = self.GameData.MenuName[event.detail.menu[i][j]];
                }                 
                if (event.detail.menu[i][j] == self.GameData.MenuID.NONE) {
                    self.isExist[i][j] = false;
                }
                else {
                    self.isExist[i][j] = true;
                }
                self.menuID[i][j] = event.detail.menu[i][j];
            }
        }                
    },
});
