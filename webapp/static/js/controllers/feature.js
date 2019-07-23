var MonodroneBot;
(function (MonodroneBot) {
    var FeatureController = /** @class */ (function () {
        function FeatureController($routeParams, featureService, effectService) {
            var _this = this;
            this.featureService = featureService;
            this.effectService = effectService;
            if ($routeParams.featureId) {
                featureService.get($routeParams.featureId).then(function (result) {
                    _this.feature = result.data;
                }).catch(function (reason) {
                    alert(JSON.stringify(reason));
                });
            }
            else {
                this.feature = new MonodroneBot.Feature();
            }
            featureService.search({}).then(function (result) {
                _this.allFeatures = result.data;
            });
            effectService.search({}).then(function (result) {
                _this.allEffects = result.data;
            });
        }
        ;
        FeatureController.prototype.get = function (featureId) {
            var _this = this;
            this.featureService.get(featureId).then(function (result) {
                _this.feature = result.data;
            }).catch(function (reason) {
                alert(JSON.stringify(reason));
            });
        };
        FeatureController.prototype.save = function () {
            var _this = this;
            if (this.feature._id) {
                this.featureService.update(this.feature).then(function (result) {
                    _this.feature = result.data;
                }).catch(function (reason) {
                    alert(JSON.stringify(reason));
                });
            }
            else {
                this.featureService.save(this.feature).then(function (result) {
                    _this.feature = result.data;
                }).catch(function (reason) {
                    alert(JSON.stringify(reason));
                });
            }
        };
        FeatureController.prototype.addOption = function () {
            if (!this.feature.options) {
                this.feature.options = new Array();
            }
            this.feature.options.push("");
        };
        FeatureController.prototype.removeOption = function (index) {
            this.feature.options.splice(index, 1);
        };
        FeatureController.prototype.addEffect = function () {
            if (!this.feature.effects) {
                this.feature.effects = new Array();
            }
            this.feature.effects.push("");
        };
        FeatureController.prototype.removeEffect = function (index) {
            this.feature.effects.splice(index, 1);
        };
        FeatureController.$inject = ['$routeParams', 'FeatureService', 'EffectService'];
        return FeatureController;
    }());
    MonodroneBot.FeatureController = FeatureController;
    angular.module('MonodroneBot').controller('FeatureController', FeatureController);
})(MonodroneBot || (MonodroneBot = {}));
