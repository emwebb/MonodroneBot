var MonodroneBot;
(function (MonodroneBot) {
    var Navbar = /** @class */ (function () {
        function Navbar() {
            this.isCollapsed = false;
        }
        ;
        return Navbar;
    }());
    MonodroneBot.Navbar = Navbar;
    angular.module('MonodroneBot').controller('Navbar', Navbar);
})(MonodroneBot || (MonodroneBot = {}));
