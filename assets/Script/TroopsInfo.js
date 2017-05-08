cc.Class({
    extends: cc.Component,

    properties: () => ({
        GameData: {
            default: null,
            type: require('GameData')            
        },       
        infos: {
            default: [],
            type: [cc.Label]
        },                  
    }),

    onLoad: function () {
        this.isFixed = true;
    },

    unfixed: function() {
        var self = this;
        if (self.isFixed) {
            var interval = cc.delayTime(self.GameData.KeySensibility);
            var callback = cc.callFunc(function () {
                if (this.GameData.ok) {
                    this.GameData.ok = false;
                    this.showTroopsInfo(null, false);
                } else if (this.GameData.cancle) {
                    this.GameData.cancle = false;
                    this.showTroopsInfo(null, false);
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

    showTroopsInfo: function(robots, show) {
        var self = this;

        if (!show) {
            self.node.opacity = 0;
            self.fixed();
            return;
        }

        self.node.opacity = 255;

        self.unfixed();

        var k = 0;
        for (var i = 0; i < robots.length; i++) {
            var robot = self.GameData.getRobot(robots[i].id);
            self.infos[k + 0].string = robot.NAME;
            self.infos[k + 1].string = robot.LEVEL;
            self.infos[k + 2].string = robot.HP + '/' + robot.HPMAX;
            k = k + 3;
        }
    },
});
