namespace MonodroneBot {
    export interface IEffectService {
        get(effectId : string) : ng.IPromise<{}>;
        delete(effectId : string) : ng.IPromise<{}>;
        search(query : {}) : ng.IPromise<{}>;
        update(effect : Effect) : ng.IPromise<{}>;
        save(effect : Effect) : ng.IPromise<{}>;
    }

    class EffectService implements IEffectService {
        static $inject = ['$http']
        constructor(private $http : ng.IHttpService) {

        }

        get(effectId : string) : ng.IPromise<{}> {
            return this.$http.get('/api/effect/' + effectId);
        }

        delete(effectId : string) : ng.IPromise<{}> {
            return this.$http.delete('/api/effect/' + effectId);
        }

        search(query : {}) : ng.IPromise<{}> {
            return this.$http.get('/api/effect/?' + $.param(query));
        }

        update(effect : Effect) : ng.IPromise<{}> {
            return this.$http.put('/api/effect/' + effect._id,effect)
        }

        save(effect : Effect) : ng.IPromise<{}> {
            return this.$http.post('/api/effect/', effect)
        }
    }

    angular.module('MonodroneBot').service('EffectService', EffectService);
}