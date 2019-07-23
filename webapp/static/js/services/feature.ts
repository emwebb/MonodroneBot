namespace MonodroneBot {
    export interface IFeatureService {
        get(featureId : string) : ng.IPromise<{}>;
        delete(featureId : string) : ng.IPromise<{}>;
        search(query : {}) : ng.IPromise<{}>;
        update(feature : Feature) : ng.IPromise<{}>;
        save(feature : Feature) : ng.IPromise<{}>;
    }

    class FeatureService implements IFeatureService {
        static $inject = ['$http']
        constructor(private $http : ng.IHttpService) {

        }

        get(featureId : string) : ng.IPromise<{}> {
            return this.$http.get('/api/feature/' + featureId);
        }

        delete(featureId : string) : ng.IPromise<{}> {
            return this.$http.delete('/api/feature/' + featureId);
        }

        search(query : {}) : ng.IPromise<{}> {
            return this.$http.get('/api/feature/?' + $.param(query));
        }

        update(feature : Feature) : ng.IPromise<{}> {
            return this.$http.put('/api/feature/' + feature._id,feature)
        }

        save(feature : Feature) : ng.IPromise<{}> {
            return this.$http.post('/api/feature/', feature)
        }
    }

    angular.module('MonodroneBot').service('FeatureService', FeatureService);
}