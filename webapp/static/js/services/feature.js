var MonodroneBot;
(function (MonodroneBot) {
    var FeatureService = /** @class */ (function () {
        function FeatureService($http) {
            this.$http = $http;
        }
        FeatureService.prototype.get = function (featureId) {
            return this.$http.get('/api/feature/' + featureId);
        };
        FeatureService.prototype.delete = function (featureId) {
            return this.$http.delete('/api/feature/' + featureId);
        };
        FeatureService.prototype.search = function (query) {
            return this.$http.get('/api/feature/?' + $.param(query));
        };
        FeatureService.prototype.update = function (feature) {
            return this.$http.put('/api/feature/' + feature._id, feature);
        };
        FeatureService.prototype.save = function (feature) {
            return this.$http.post('/api/feature/', feature);
        };
        FeatureService.$inject = ['$http'];
        return FeatureService;
    }());
    angular.module('MonodroneBot').service('FeatureService', FeatureService);
})(MonodroneBot || (MonodroneBot = {}));
