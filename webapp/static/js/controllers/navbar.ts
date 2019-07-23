namespace MonodroneBot {
    export class Navbar {
        isCollapsed: boolean;
        constructor() {
            this.isCollapsed = false;
        };
    }

    angular.module('MonodroneBot').controller('Navbar',Navbar)
}