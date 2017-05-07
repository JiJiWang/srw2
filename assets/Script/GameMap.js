cc.Class({
    extends: cc.Component,

    properties: () => ({

    }),

    onLoad: function () {
        this.node.on('GameControl:ShowRange', function (event) {
            this.showRange(event);
        }.bind(this));       
    },

    showRange: function(event) {
        var self = this;
        var map = self.getComponent(cc.TiledMap);
        var ground = map.getLayer('ground');
        var x = event.detail.x;
        var y = event.detail.y;
        var maneuver = event.detail.maneuver;
        if (event.detail.show) {
            var color = new cc.Color(160, 160, 160);
        }
        else {
            var color = new cc.Color(255, 255, 255);
        }
        for (var j = 0; j <= maneuver; j++) {
            for (var i = 0; i <= maneuver - j; i++) {
                if (x + i < 20 && y + j < 30) {
                    var tileRightTop = ground.getTileAt(cc.p(x + i, y + j));
                    if (tileRightTop) {
                        tileRightTop.color = color;
                    }
                }
                if (x - i >= 0 && y + j < 30) {
                    var tileLeftTop = ground.getTileAt(cc.p(x - i, y + j));
                    if (tileLeftTop) {
                        tileLeftTop.color = color;
                    }
                }
                if (x + i < 20 && y - j >= 0) {
                    var tileRightBottom = ground.getTileAt(cc.p(x + i, y - j));
                    if (tileRightBottom) {
                        tileRightBottom.color = color;
                    }
                }
                if (x - i >= 0 && y - j >= 0) {
                    var tileLeftBottom = ground.getTileAt(cc.p(x - i, y - j));
                    if (tileLeftBottom) {
                        tileLeftBottom.color = color;
                    }
                }
            }
        }
    },
});
