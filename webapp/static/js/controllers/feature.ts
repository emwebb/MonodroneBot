namespace MonodroneBot {

    interface IRouteParams extends ng.route.IRouteParamsService {
        featureId? : string
    }

    export class FeatureController {
        static $inject = ['$routeParams','FeatureService','EffectService'];
        feature: Feature;
        allFeatures : Feature[];
        allEffects : Effect[];
        constructor($routeParams: IRouteParams, private featureService: IFeatureService, private effectService : IEffectService) {
            if($routeParams.featureId) {
                featureService.get($routeParams.featureId).then((result : ng.IHttpPromiseCallbackArg<Feature>) => {
                    this.feature = result.data;
                }).catch((reason) => {
                   alert(JSON.stringify(reason)); 
                });
            } else {
                this.feature = new Feature();
            }

            featureService.search({}).then((result : ng.IHttpPromiseCallbackArg<Feature[]>) => {
                this.allFeatures = result.data;
            });

            effectService.search({}).then((result : ng.IHttpPromiseCallbackArg<Effect[]>) => {
                this.allEffects = result.data;
            });
        };

        get(featureId : string) {
            this.featureService.get(featureId).then((result : ng.IHttpPromiseCallbackArg<Feature>) => {
                this.feature = result.data;
            }).catch((reason) => {
               alert(JSON.stringify(reason)); 
            });
        }

        save() {
            if(this.feature._id) {
                this.featureService.update(this.feature).then((result : ng.IHttpPromiseCallbackArg<Feature>) => {
                    this.feature = result.data;
                }).catch((reason) => {
                   alert(JSON.stringify(reason)); 
                });
            } else {
                this.featureService.save(this.feature).then((result : ng.IHttpPromiseCallbackArg<Feature>) => {
                    this.feature = result.data;
                }).catch((reason) => {
                   alert(JSON.stringify(reason)); 
                });
            }
        }

        addOption() {
            if(!this.feature.options) {
                this.feature.options = new Array<String>();
            }
            this.feature.options.push("");
        }

        removeOption(index : number) {
            this.feature.options.splice(index, 1);
        }

        addEffect() {
            if(!this.feature.effects) {
                this.feature.effects = new Array<String>();
            }
            this.feature.effects.push("");
        }

        removeEffect(index : number) {
            this.feature.effects.splice(index, 1);
        }
    }

    angular.module('MonodroneBot').controller('FeatureController',FeatureController)
}