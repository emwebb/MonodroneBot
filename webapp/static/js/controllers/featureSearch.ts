namespace MonodroneBot {

    export class SearchFeatureController {
        static $inject = ['FeatureService'];
        features: Feature[];
        searchFeatures = [
            'blah',
            'darkvision',
            'minecraft'
        ]
        constructor(private featureService: IFeatureService) {

        };

        submit(name : {}) {
            this.featureService.search(name).then((result : ng.IHttpPromiseCallbackArg<Feature[]>) => {
                this.features = result.data;
            }).catch((reason) => {
                alert(JSON.stringify(reason));
            });
        }

        search(name : {}) {
            this.featureService.search(name).then((result : ng.IHttpPromiseCallbackArg<Feature[]>) => {
                return result.data.map((value) => {
                    return value.name;
                });
            }).catch((reason) => {
                alert(JSON.stringify(reason));
            });
        }
    }

    angular.module('MonodroneBot').controller('SearchFeatureController',SearchFeatureController)
}