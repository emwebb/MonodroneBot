var MonodroneBot;
(function (MonodroneBot) {
    var MarkdownDirective = /** @class */ (function () {
        function MarkdownDirective() {
            this.require = 'ngModel';
            this.restrict = 'A';
        }
        MarkdownDirective.prototype.link = function ($scope, elm, attr, ngModel) {
            $(elm).markdown({
                savable: false,
                onChange: function (e) {
                    ngModel.$setViewValue(e.getContent());
                }
            });
        };
        MarkdownDirective.instance = function () {
            return new MarkdownDirective();
        };
        return MarkdownDirective;
    }());
    angular.module('MonodroneBot').directive('markdownEditor', MarkdownDirective.instance);
})(MonodroneBot || (MonodroneBot = {}));
