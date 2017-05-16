cc.Class({
    extends: cc.Component,

    properties: () => ({
        GameData: {
            default: null,
            type: require('GameData')            
        },          
        overMusic: {
            default: null,
            url: cc.AudioClip                 
        }, 
    }),

    onLoad: function () {
        this.isFixed = true;
        this.audioID = -1;
    },

    onGameOver: function() {
        var self = this;
        this.audioID = cc.audioEngine.play(this.overMusic, false, 1);

        var fadein = cc.fadeIn(2).easing(cc.easeCubicActionIn());
        var callback = cc.callFunc(function() {
            this.unfixed();
        }.bind(self));
        var sequence = cc.sequence(fadein, callback);
        self.node.runAction(sequence);    
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
            var interval = cc.delayTime(self.GameData.KeySensibility);
            var callback = cc.callFunc(function () {
                if (self.GameData.ok) {
                    self.GameData.ok = false;
                    self.gameStart();
                }
                else if (self.GameData.cancle) {
                    self.GameData.cancle = false;
                    self.gameStart();
                }
            }, self);
            var sequence = cc.sequence(callback, interval);
            self.node.runAction(sequence.repeatForever());
            self.isFixed = false;
        }
    },

    gameStart: function() { 
        cc.audioEngine.stop(this.audioID);       
        cc.director.loadScene('Level1');
    },
});
