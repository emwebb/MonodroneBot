/// <reference path="../../node_modules/@types/angular/index.d.ts"/>
/// <reference path="../../node_modules/@types/angular-route/index.d.ts"/>

namespace MonodroneBot {
    'use strict'
    function routes($routeProvider : ng.route.IRouteProvider) {
        $routeProvider.when('/featureSearch', {
                templateUrl : '/static/views/_featureSearch.html',
                controller : 'SearchFeatureController',
                controllerAs : 'vm'
            });
        $routeProvider.when('/feature/:featureId', {
            templateUrl : '/static/views/_feature.html',
            controller : 'FeatureController',
            controllerAs : 'vm'
        });
        $routeProvider.when('/feature/', {
            templateUrl : '/static/views/_feature.html',
            controller : 'FeatureController',
            controllerAs : 'vm'
        });

        $routeProvider.when('/effectSearch', {
                templateUrl : '/static/views/_effectSearch.html',
                controller : 'SearchEffectController',
                controllerAs : 'vm'
            });
        $routeProvider.when('/effect/:effectId', {
            templateUrl : '/static/views/_effect.html',
            controller : 'EffectController',
            controllerAs : 'vm'
        });
        $routeProvider.when('/effect/', {
            templateUrl : '/static/views/_effect.html',
            controller : 'EffectController',
            controllerAs : 'vm'
        });
    }

    routes.$inject = ['$routeProvider']
    angular.module('MonodroneBot').config(routes);
}