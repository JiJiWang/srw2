cc.Class({
    extends: cc.Component,

    properties: {
        talk: {
            default: null,
            type: cc.Label
        }
    },

    onLoad: function () {

    },

    showTalk: function (talk, show) {
        var self = this;
        if (!show) {
            self.node.opacity = 0;
            return ;
        }
        self.node.opacity = 255;
        self.talk.string = talk;
    }, 
});
