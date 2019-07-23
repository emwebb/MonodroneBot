var MonodroneBot;
(function (MonodroneBot) {
    var SearchFeatureController = /** @class */ (function () {
        function SearchFeatureController(featureService) {
            this.featureService = featureService;
            this.searchFeatures = [
                'blah',
                'darkvision',
                'minecraft'
            ];
        }
        ;
        SearchFeatureController.prototype.submit = function (name) {
            var _this = this;
            this.featureService.search(name).then(function (result) {
                _this.features = result.data;
            }).catch(function (reason) {
                alert(JSON.stringify(reason));
            });
        };
        SearchFeatureController.prototype.search = function (name) {
            this.featureService.search(name).then(function (result) {
                return result.data.map(function (value) {
                    return value.name;
                });
            }).catch(function (reason) {
                alert(JSON.stringify(reason));
            });
        };
        SearchFeatureController.$inject = ['FeatureService'];
        return SearchFeatureController;
    }());
    MonodroneBot.SearchFeatureController = SearchFeatureController;
    angular.module('MonodroneBot').controller('SearchFeatureController', SearchFeatureController);
})(MonodroneBot || (MonodroneBot = {}));
