var MonodroneBot;
(function (MonodroneBot) {
    var EnterKeyPressDirective = /** @class */ (function () {
        function EnterKeyPressDirective() {
            this.require = '?ngModel';
            this.restrict = 'A';
        }
        EnterKeyPressDirective.prototype.link = function ($scope, elm, attr, ngModel) {
            var element = angular.element(elm);
            element.on('keydown keypress', function (event) {
                if (event.keyCode == 13) {
                    $scope.$apply(function () {
                        $scope.$eval(attr.ngEnter);
                    });
                }
                event.preventDefault();
            });
        };
        EnterKeyPressDirective.instance = function () {
            return new EnterKeyPressDirective();
        };
        return EnterKeyPressDirective;
    }());
    angular.module('MonodroneBot').directive('ngEnter', EnterKeyPressDirective.instance);
})(MonodroneBot || (MonodroneBot = {}));
