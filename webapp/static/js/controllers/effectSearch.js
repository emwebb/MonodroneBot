var MonodroneBot;
(function (MonodroneBot) {
    var SearchEffectController = /** @class */ (function () {
        function SearchEffectController(effectService) {
            this.effectService = effectService;
        }
        ;
        SearchEffectController.prototype.submit = function (name) {
            var _this = this;
            this.effectService.search(name).then(function (result) {
                _this.effects = result.data;
            }).catch(function (reason) {
                alert(JSON.stringify(reason));
            });
        };
        SearchEffectController.prototype.search = function (name) {
            this.effectService.search(name).then(function (result) {
                return result.data.map(function (value) {
                    return value.name;
                });
            }).catch(function (reason) {
                alert(JSON.stringify(reason));
            });
        };
        SearchEffectController.$inject = ['EffectService'];
        return SearchEffectController;
    }());
    MonodroneBot.SearchEffectController = SearchEffectController;
    angular.module('MonodroneBot').controller('SearchEffectController', SearchEffectController);
})(MonodroneBot || (MonodroneBot = {}));
