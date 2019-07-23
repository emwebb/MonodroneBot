namespace MonodroneBot {
    class EnterKeyPressDirective implements ng.IDirective {
        require = '?ngModel';
        restrict = 'A';

        link($scope: ng.IScope, elm: JQLite, attr: IEnterKeyPressAttributes, ngModel: ng.INgModelController) : void {
            var element = angular.element(elm)
            element.on('keydown keypress', (event : JQueryEventObject) => {
                if(event.keyCode == 13) {
                    $scope.$apply(() => {
                        $scope.$eval(attr.ngEnter)
                    });
                }
                event.preventDefault()
            });

        }

        static instance(): ng.IDirective {
            return new EnterKeyPressDirective();
        }

    }

    interface IEnterKeyPressAttributes extends ng.IAttributes {
        ngEnter: string
    }

    angular.module('MonodroneBot').directive('ngEnter', EnterKeyPressDirective.instance)
}