cc.Class({
    extends: cc.Component,

    properties: () => ({
        GameControl: {
            default: null,
            type: require('GameControl')            
        },
        GameData: {
            default: null,
            type: require('GameData')            
        },          
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
    }),

    onLoad: function () {
        this.isFixed = true;
        this.unfixed();
        this.isSelected = false;
        this.isBlockedLeft = false;
        this.isBlockedRight = false;
        this.isBlockedTop = false;
        this.isBlockedBottom = false;
        this.robotSelected = null;
        this.node.on('GameControl:Fixed', function(event) {
            this.fixed();
        }.bind(this));
        this.node.on('GameControl:Unfixed', function(event) {
            this.unfixed();
        }.bind(this));
    },

    unfixed: function() {
        var self = this;
        if (self.isFixed) {
            var interval = cc.delayTime(self.GameData.KeySensibility);
            var callback = cc.callFunc(function () {
                if (self.GameData.left) {
                    self.GameData.left = false;
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
                } else if (self.GameData.right) {
                    self.GameData.right = false;
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
                if (self.GameData.down) {
                    self.GameData.down = false;
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
                } else if (self.GameData.up) {
                    self.GameData.up = false;
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
                var enemys = self.GameData.enemys;
                var isSelectedRed = false;
                for (var i = 0; i < enemys.length; i++) {
                    if (enemys[i].tilex == self.tilex && enemys[i].tiley == self.tiley) {
                        self.GameControl.onSelectRed(enemys[i]);
                        isSelectedRed = true;                      
                        break;                      
                    }
                }
                var robots = self.GameData.robots;
                var isSelectedBlue = false;
                for (var i = 0; i < robots.length; i++) {
                    if (robots[i].tilex == self.tilex && robots[i].tiley == self.tiley) {
                        self.GameControl.onSelectBlue(robots[i]);                        
                        isSelectedBlue = true;
                        break;                      
                    }                                   
                }  
                if (!isSelectedBlue && !isSelectedRed) {
                    self.GameControl.onUnselect();
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
        if (other.node.group == 'Block') {
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
        if (other.node.group == 'Block') {
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
});
