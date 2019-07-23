namespace MonodroneBot {
    class MarkdownDirective implements ng.IDirective {
        require = 'ngModel';
        restrict = 'A';

        link($scope: ng.IScope, elm: JQLite, attr: ng.IAttributes, ngModel: ng.INgModelController) : void {
            $(elm).markdown({
                savable : false,
                onChange : (e) => {
                    ngModel.$setViewValue(e.getContent());
                }
            })

        }

        static instance(): ng.IDirective {
            return new MarkdownDirective();
        }

    }

    interface IEnterKeyPressAttributes extends ng.IAttributes {
        ngEnter: string
    }

    angular.module('MonodroneBot').directive('markdownEditor', MarkdownDirective.instance)
}