cc.Class({
    extends: cc.Component,

    properties: {
        map: {
            default: null,
            type: cc.Node
        },
        borderRightTop: {
            default: null,
            type: cc.Node
        },
        borderLeftBottom: {
            default: null,
            type: cc.Node
        },
        mapRightTop: {
            default: null,
            type: cc.Node
        },
        mapLeftBottom: {
            default: null,
            type: cc.Node
        },
        keySensibility: 0,
        tilex: 0,
        tiley: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.isFixed = true;
        this.unfixed();
        this.accLeft = false;
        this.accRight = false;
        this.accUp = false;
        this.accDown = false;
        this.isSelected = false;
        this.isBlockedLeft = false;
        this.isBlockedRight = false;
        this.isBlockedTop = false;
        this.isBlockedBottom = false;
        this.robotSelected = null;
        this.setInputControl();
        this.node.on('GameControl:Fixed', function(event) {
            // cc.log('Fixed');
            this.fixed();
        }.bind(this));
        this.node.on('GameControl:Unfixed', function(event) {
            // cc.log('Unfixed');
            this.unfixed();
        }.bind(this));
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
                    if (self.node.x > self.borderLeftBottom.x  && !self.isBlockedLeft) {
                        self.node.x -= 16;
                        self.tilex -= 1;
                    }
                    else {
                        if (self.map.x < self.mapRightTop.x) {
                            self.map.x += 16;
                            self.node.x += 16;
                            self.tilex += 1;
                        }                        
                    }
                    // cc.log('tilex = ' + self.tilex + ', tiley = ' + self.tiley);
                } else if (self.accRight) {
                    if (self.node.x < self.borderRightTop.x  && !self.isBlockedRight) {
                        self.node.x += 16;
                        self.tilex += 1;
                    }
                    else {
                        if (self.map.x > self.mapLeftBottom.x) {
                            self.map.x -= 16;
                            self.node.x -= 16;
                            self.tilex -= 1;
                        }
                    }
                    // cc.log('tilex = ' + self.tilex + ', tiley = ' + self.tiley);
                }
                if (self.accDown) {
                    if (self.node.y > self.borderLeftBottom.y  && !self.isBlockedBottom) {
                        self.node.y -= 16;
                        self.tiley += 1;
                    }
                    else {
                        if (self.map.y < self.mapRightTop.y) {
                            self.map.y += 16;
                            self.node.y += 16;
                            self.tiley -= 1;
                        }                        
                    }
                    // cc.log('tilex = ' + self.tilex + ', tiley = ' + self.tiley);
                } else if (self.accUp) {
                    if (self.node.y < self.borderRightTop.y  && !self.isBlockedTop) {
                        self.node.y += 16;
                        self.tiley -= 1;
                    }
                    else {
                        if (self.map.y > self.mapLeftBottom.y) {
                            self.map.y -= 16;
                            self.node.y -= 16;
                            self.tiley += 1;
                        }
                    }
                    // cc.log('tilex = ' + self.tilex + ', tiley = ' + self.tiley);
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

    onCollisionEnter: function (other, self) {
        // cc.log('GameSelector: on collision enter');
        // if (other.node.group == 'Robot') {
        //     cc.log('other.node.group = Robot');
        //     this.isSelected = true;
        // }
        if (other.node.group == 'Block') {
            // cc.log('other.node.group = Block');
            switch (other.tag) {
                case 4:
                    // cc.log('block left');
                    this.isBlockedLeft = true;
                    break;
                case 2:
                    // cc.log('block right');
                    this.isBlockedRight = true;
                    break;
                case 3:
                    // cc.log('block top');
                    this.isBlockedTop = true;
                    break;
                case 1:
                    // cc.log('block bottom');
                    this.isBlockedBottom = true;
                    break;
            }
        }
    },

    onCollisionStay: function (other, self) {
        // cc.log('GameSelector: on collision stay');
    },

    onCollisionExit: function (other, self) {
        // cc.log('GameSelector: on collision exit');
        // if (other.node.group == 'Robot') {
        //     // cc.log('other.node.group = Robot');
        //     this.isSelected = false;
        // }
        if (other.node.group == 'Block') {
            // cc.log('other.node.group = Block');
            switch (other.tag) {
                case 4:
                    // cc.log('unblock left');
                    this.isBlockedLeft = false;
                    break;
                case 2:
                    // cc.log('unblock right');
                    this.isBlockedRight = false;
                    break;
                case 3:
                    // cc.log('unblock top');
                    this.isBlockedTop = false;
                    break;
                case 1:
                    // cc.log('unblock bottom');
                    this.isBlockedBottom = false;
                    break;
            }
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
