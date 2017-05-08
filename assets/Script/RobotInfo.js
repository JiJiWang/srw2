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

    },

    showRobotInfo: function(robot, show) {
        var self = this;

        if (!show) {
            self.node.opacity = 0;
            return;
        }

        self.node.opacity = 255;

        var infosIndex = [
            'NAME',
            'LEVEL',
            'MANEUVER',
            'SPIRIT',
            'STRENGTH',
            'DEFENCE',
            'SPEED',
            'HP',
            'HPMAX',
            'EXP',
            'EXPNEED',
        ];
        for (var i = 0; i < self.infos.length; i++) {
            self.infos[i].string = self.GameData.getRobot(robot.id)[infosIndex[i]];
        }
    },
});
