var MonodroneBot;
(function (MonodroneBot) {
    var EffectService = /** @class */ (function () {
        function EffectService($http) {
            this.$http = $http;
        }
        EffectService.prototype.get = function (effectId) {
            return this.$http.get('/api/effect/' + effectId);
        };
        EffectService.prototype.delete = function (effectId) {
            return this.$http.delete('/api/effect/' + effectId);
        };
        EffectService.prototype.search = function (query) {
            return this.$http.get('/api/effect/?' + $.param(query));
        };
        EffectService.prototype.update = function (effect) {
            return this.$http.put('/api/effect/' + effect._id, effect);
        };
        EffectService.prototype.save = function (effect) {
            return this.$http.post('/api/effect/', effect);
        };
        EffectService.$inject = ['$http'];
        return EffectService;
    }());
    angular.module('MonodroneBot').service('EffectService', EffectService);
})(MonodroneBot || (MonodroneBot = {}));
