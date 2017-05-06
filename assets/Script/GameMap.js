cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.node.on('GameControl:ShowRange', function (event) {
            this.showRange(event);
        }.bind(this));       
    },

    showRange: function(event) {
        // cc.log('Level1 Map On Move Robot');
        var self = this;
        var map = self.getComponent(cc.TiledMap);
        var ground = map.getLayer('ground');
        // var robot = event.detail.robot;
        var x = event.detail.x;
        var y = event.detail.y;
        // var x = 10;
        // var y = 15;
        // cc.log('tilex = ' + x + ', tiley = ' + y);
        var maneuver = event.detail.maneuver;
        // var maneuver = 5;
        // cc.log('maneuver = ' + maneuver);
        // var color = new cc.Color(255, 255, 255);
        if (event.detail.show) {
            var color = new cc.Color(160, 160, 160);
        }
        else {
            var color = new cc.Color(255, 255, 255);
        }
        for (var j = 0; j <= maneuver; j++) {
            for (var i = 0; i <= maneuver - j; i++) {
                if (x + i < 20 && y + j < 30) {
                    // cc.log('tilex = ' + (x + i) + ', tiley = ' + (y + j));
                    var tileRightTop = ground.getTileAt(cc.p(x + i, y + j));
                    if (tileRightTop) {
                        tileRightTop.color = color;
                    }
                }
                if (x - i >= 0 && y + j < 30) {
                    // cc.log('tilex = ' + (x - i) + ', tiley = ' + (y + j));
                    var tileLeftTop = ground.getTileAt(cc.p(x - i, y + j));
                    if (tileLeftTop) {
                        tileLeftTop.color = color;
                    }
                }
                if (x + i < 20 && y - j >= 0) {
                    // cc.log('tilex = ' + (x + i) + ', tiley = ' + (y - j));
                    var tileRightBottom = ground.getTileAt(cc.p(x + i, y - j));
                    if (tileRightBottom) {
                        tileRightBottom.color = color;
                    }
                }
                if (x - i >= 0 && y - j >= 0) {
                    // cc.log('tilex = ' + (x - i) + ', tiley = ' + (y - j));
                    var tileLeftBottom = ground.getTileAt(cc.p(x - i, y - j));
                    if (tileLeftBottom) {
                        tileLeftBottom.color = color;
                    }
                }
            }
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
