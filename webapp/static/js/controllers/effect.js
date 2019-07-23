var MonodroneBot;
(function (MonodroneBot) {
    var EffectController = /** @class */ (function () {
        function EffectController($routeParams, effectService) {
            var _this = this;
            this.effectService = effectService;
            if ($routeParams.featureId) {
                effectService.get($routeParams.featureId).then(function (result) {
                    _this.effect = result.data;
                }).catch(function (reason) {
                    alert(JSON.stringify(reason));
                });
            }
            else {
                this.effect = new MonodroneBot.Effect();
            }
            this.abilities = new Array();
            this.types = new Array();
            for (var ability in MonodroneBot.EffectAbility) {
                this.abilities.push(MonodroneBot.EffectAbility[ability]);
            }
            for (var type in MonodroneBot.EffectType) {
                this.types.push(MonodroneBot.EffectType[type]);
            }
        }
        ;
        EffectController.prototype.get = function (featureId) {
            var _this = this;
            this.effectService.get(featureId).then(function (result) {
                _this.effect = result.data;
            }).catch(function (reason) {
                alert(JSON.stringify(reason));
            });
        };
        EffectController.prototype.save = function () {
            var _this = this;
            if (this.effect._id) {
                this.effectService.update(this.effect).then(function (result) {
                    _this.effect = result.data;
                }).catch(function (reason) {
                    alert(JSON.stringify(reason));
                });
            }
            else {
                this.effectService.save(this.effect).then(function (result) {
                    _this.effect = result.data;
                }).catch(function (reason) {
                    alert(JSON.stringify(reason));
                });
            }
        };
        EffectController.$inject = ['$routeParams', 'EffectService'];
        return EffectController;
    }());
    MonodroneBot.EffectController = EffectController;
    angular.module('MonodroneBot').controller('EffectController', EffectController);
})(MonodroneBot || (MonodroneBot = {}));
