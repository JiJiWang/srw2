cc.Class({
    extends: cc.Component,

    properties: () => ({
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
    }),

    onLoad: function () {
        this.isMoved = false;
        this.isFixed = true;
        this.selectedID = 0;
        this.armsID = [-1, -1];     
    },

    unfixed: function() {
        var self = this;
        if (self.isFixed) {            
            var interval = cc.delayTime(self.GameData.KeySensibility);
            var callback = cc.callFunc(function () {
                if (self.GameData.down) {
                    self.GameData.down = false;
                    if (!self.isMoved) {
                        self.selectArm(1);
                        self.isMoved = true;                             
                    }
                } else if (self.GameData.up) {
                    self.GameData.up = false;
                    if (self.isMoved) {
                        self.selectArm(0);
                        self.isMoved = false;                             
                    }    
                }
            }, self);
            var sequence = cc.sequence(callback, interval);
            self.node.runAction(sequence.repeatForever());
            self.isFixed = false;
        }
    },

    selectArm: function(i) {
        var self = this;
        self.selectedID = i;
        self.selector.x = self.pos[i].x;
        self.selector.y = self.pos[i].y;                        
        self.arms[1].opacity = i ? 255 : 0;
        self.arms[0].opacity = i ? 0 : 255;
        self.isMoved = false;
    },

    fixed: function() {
        var self = this;
        if (!self.isFixed) {
            self.node.stopAllActions();            
            self.isFixed = true;
        }
    },

    showArmInfo: function(robot, show) {
        var self = this;
        if (!show) {
            self.node.opacity = 0;
            self.fixed();
            return;
        }
        self.node.opacity = 255;
        self.selectArm(0);
        self.unfixed();

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
});
