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

        this.PosIndex = cc.Enum({            
            HALF_TITLE_TOP: 0,
            HALF_TITLE_BOT: 1,
            SELECTOR_START: 2,
            SELECTOR_CONTINUE: 3,
            SELECTOR_LOAD_DATA: 4,
            HALF_TITLE_TOP_START: 5,
            HALF_TITLE_BOT_START: 6,            
        });

        this.TitleIndex = cc.Enum({
            HALF_TITLE_TOP: 0,
            HALF_TITLE_BOT: 1,
            BLUE_TITLE: 2,
        });

        this.onGameStart();
    },

    onDestroy () {
        // cc.log('GameStart:onDestroy');
    },

    onGameStart: function() {
        var self = this;
        self.node.opacity = 255;

        var PosIndex = self.PosIndex;
        var TitleIndex = self.TitleIndex;

        var x = self.pos[PosIndex.HALF_TITLE_TOP].x;
        var y = self.pos[PosIndex.HALF_TITLE_TOP].y;
        var pos = cc.p(x, y);
        var moveTo = cc.moveTo(0.5, pos);
        self.title[TitleIndex.HALF_TITLE_TOP].runAction(moveTo);

        var x = self.pos[PosIndex.HALF_TITLE_BOT].x;
        var y = self.pos[PosIndex.HALF_TITLE_BOT].y;
        var pos = cc.p(x, y);
        var moveTo = cc.moveTo(0.5, pos);
        self.title[TitleIndex.HALF_TITLE_BOT].runAction(moveTo);

        var delay = cc.delayTime(1);
        var scale1 = cc.scaleTo(0.1, 1.1, 1.1);
        var scale2 = cc.scaleTo(0.1, 1.0, 1.0);
        var callback = cc.callFunc(function() {
            this.opacity = 255;
        }.bind(self.title[TitleIndex.BLUE_TITLE]));
        var sequence = cc.sequence(delay, callback, scale1, scale2);
        self.title[TitleIndex.BLUE_TITLE].runAction(sequence);

        var delay = cc.delayTime(1);
        var callback = cc.callFunc(function() {
            this.opacity = 255;
        }.bind(self.selector));
        var sequence = cc.sequence(delay, callback);
        self.selector.runAction(sequence);

        cc.audioEngine.playEffect(self.titleMusic, false);

        var delay = cc.delayTime(1);
        var callback = cc.callFunc(function() {
            this.unfixed();
        }.bind(self));
        var sequence = cc.sequence(delay, callback);
        self.node.runAction(sequence);
    },

    fixed: function() {
        var self = this;
        if (!self.isFixed) {
            var PosIndex = self.PosIndex;
            var TitleIndex = self.TitleIndex;
                       
            self.node.stopAllActions();
            self.node.opacity = 0;

            self.title[TitleIndex.BLUE_TITLE].opacity = 0;

            self.selector.opacity = 0;

            var x = self.pos[PosIndex.HALF_TITLE_TOP_START].x;
            var y = self.pos[PosIndex.HALF_TITLE_TOP_START].y; 
            self.title[TitleIndex.HALF_TITLE_TOP].x = x;        
            self.title[TitleIndex.HALF_TITLE_TOP].y = y; 

            var x = self.pos[PosIndex.HALF_TITLE_BOT_START].x;
            var y = self.pos[PosIndex.HALF_TITLE_BOT_START].y; 
            self.title[TitleIndex.HALF_TITLE_BOT].x = x;        
            self.title[TitleIndex.HALF_TITLE_BOT].y = y;

            self.isFixed = true;
        }
    },

    unfixed: function() {
        var self = this;
        if (self.isFixed) {
            var offset = self.PosIndex.SELECTOR_START - self.MenuID.START;
            var interval = cc.delayTime(self.GameData.KeySensibility);
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
                            self.GameData.GameControl.onGameStart();
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