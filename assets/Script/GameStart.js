// var GameData = require('GameData');
cc.Class({
    extends: cc.Component,

    properties: () => ({
        GameData: {
            default: null,
            type: require('GameData')            
        },           
        title: {
            default: [],
            type: [cc.Node]
        }, 
        pos: {
            default: [],
            type: [cc.Node]
        }, 
        selector: {
            default: null,
            type: cc.Node           
        }, 
        talk: {
            default: null,
            type: cc.Node
        },                          
        titleMusic: {
            default: null,
            url: cc.AudioClip                 
        },        
    }),

    onLoad: function () {
        this.isFixed = true;

        this.MenuID = cc.Enum({
            MIN_ID: 0,
            START: 1,
            CONTINUE: 2,
            LOAD_DATA: 3,
            MAX_ID: 4,
        });
        this.menuID = this.MenuID.START;

        var PosIndex = cc.Enum({
            HALF_TITLE_TOP: 0,
            HALF_TITLE_BOT: 1,
            SELECTOR_START: 2,
            SELECTOR_CONTINUE: 3,
            SELECTOR_LOAD_DATA: 4,
        });
        this.PosIndex = PosIndex;

        var TitleIndex = cc.Enum({
            HALF_TITLE_TOP: 0,
            HALF_TITLE_BOT: 1,
            BLUE_TITLE: 2,
        });

        var x = this.pos[PosIndex.HALF_TITLE_TOP].x;
        var y = this.pos[PosIndex.HALF_TITLE_TOP].y;
        var pos = cc.p(x, y);
        var moveTo = cc.moveTo(0.5, pos);
        this.title[TitleIndex.HALF_TITLE_TOP].runAction(moveTo);

        var x = this.pos[PosIndex.HALF_TITLE_BOT].x;
        var y = this.pos[PosIndex.HALF_TITLE_BOT].y;
        var pos = cc.p(x, y);
        var moveTo = cc.moveTo(0.5, pos);
        this.title[TitleIndex.HALF_TITLE_BOT].runAction(moveTo);

        var delay = cc.delayTime(1);
        var scale1 = cc.scaleTo(0.1, 1.1, 1.1);
        var scale2 = cc.scaleTo(0.1, 1.0, 1.0);
        var callback = cc.callFunc(function() {
            this.opacity = 255;
        }.bind(this.title[TitleIndex.BLUE_TITLE]));
        var sequence = cc.sequence(delay, callback, scale1, scale2);
        this.title[TitleIndex.BLUE_TITLE].runAction(sequence);

        var delay = cc.delayTime(1);
        var callback = cc.callFunc(function() {
            this.opacity = 255;
        }.bind(this.selector));
        var sequence = cc.sequence(delay, callback);
        this.selector.runAction(sequence);

        cc.audioEngine.playEffect(this.titleMusic, false);

        var delay = cc.delayTime(1);
        var callback = cc.callFunc(function() {
            this.unfixed();
        }.bind(this));
        var sequence = cc.sequence(delay, callback);
        this.node.runAction(sequence);
    },

    onDestroy () {
        // cc.log('GameStart:onDestroy');
    },

    unfixed: function() {
        var self = this;
        if (self.isFixed) {
            // var keySensibility = 0.15;
            var keySensibility = self.GameData.KeySensibility;
            var offset = self.PosIndex.SELECTOR_START - self.MenuID.START;
            var interval = cc.delayTime(keySensibility);
            var callback = cc.callFunc(function () {
                if (self.GameData.down) {
                    var next = self.menuID + 1;
                    if (next < self.MenuID.MAX_ID) {
                        self.menuID = next;
                        self.selector.x = self.pos[self.menuID + offset].x;
                        self.selector.y = self.pos[self.menuID + offset].y;
                    }
                    self.GameData.down = false;
                } 
                else if (self.GameData.up) {
                    var next = self.menuID - 1;
                    if (next > self.MenuID.MIN_ID) {
                        self.menuID = next;
                        self.selector.x = self.pos[self.menuID + offset].x;
                        self.selector.y = self.pos[self.menuID + offset].y;
                    }
                    self.GameData.up = false;
                }
                if (self.GameData.ok) {
                    // cc.log('self.menuID = ' + self.menuID);
                    switch (self.menuID) {
                        case self.MenuID.START:
                            var root = cc.find('Canvas');
                            root.emit('GameStart:Start');
                            break;
                        case self.MenuID.CONTINUE:
                            self.talk.getComponent(cc.Label).string = 'Current version does not support archiving'; 
                            var fadeIn = cc.fadeIn(0.2).easing(cc.easeCubicActionIn());
                            var delay = cc.delayTime(3);
                            var fadeOut = cc.fadeOut(0.2).easing(cc.easeCubicActionOut());
                            var sequence = cc.sequence(fadeIn, delay, fadeOut);
                            self.talk.runAction(sequence);
                            break;
                        case self.MenuID.LOAD_DATA:
                            self.talk.getComponent(cc.Label).string = 'Current version does not support archiving'; 
                            var fadeIn = cc.fadeIn(0.2).easing(cc.easeCubicActionIn());
                            var delay = cc.delayTime(3);
                            var fadeOut = cc.fadeOut(0.2).easing(cc.easeCubicActionOut());
                            var sequence = cc.sequence(fadeIn, delay, fadeOut);
                            self.talk.runAction(sequence);
                            break;
                    }
                    self.GameData.ok = false;
                }
                else if (self.GameData.cancle) {
                    self.GameData.cancle = false;
                }
            }, self);
            var sequence = cc.sequence(callback, interval);
            self.node.runAction(sequence.repeatForever());
            self.isFixed = false;
        }
    },
});