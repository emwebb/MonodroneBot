namespace MonodroneBot {

    interface IRouteParams extends ng.route.IRouteParamsService {
        featureId? : string
    }

    export class EffectController {
        static $inject = ['$routeParams','EffectService'];
        effect: Effect;
        abilities : String[];
        types : String[];
        constructor($routeParams: IRouteParams, private effectService : IEffectService) {
            if($routeParams.featureId) {
                effectService.get($routeParams.featureId).then((result : ng.IHttpPromiseCallbackArg<Effect>) => {
                    this.effect = result.data;
                }).catch((reason) => {
                   alert(JSON.stringify(reason)); 
                });
            } else {
                this.effect = new Effect();
            }

            this.abilities = new Array<String>();
            this.types = new Array<string>();

            for(let ability in EffectAbility) {
                this.abilities.push(EffectAbility[ability]);
            }

            for(let type in EffectType) {
                this.types.push(EffectType[type]);
            }

        };

        get(featureId : string) {
            this.effectService.get(featureId).then((result : ng.IHttpPromiseCallbackArg<Effect>) => {
                this.effect = result.data;
            }).catch((reason) => {
               alert(JSON.stringify(reason)); 
            });
        }

        save() {
            if(this.effect._id) {
                this.effectService.update(this.effect).then((result : ng.IHttpPromiseCallbackArg<Effect>) => {
                    this.effect = result.data;
                }).catch((reason) => {
                   alert(JSON.stringify(reason)); 
                });
            } else {
                this.effectService.save(this.effect).then((result : ng.IHttpPromiseCallbackArg<Effect>) => {
                    this.effect = result.data;
                }).catch((reason) => {
                   alert(JSON.stringify(reason)); 
                });
            }
        }
    }

    angular.module('MonodroneBot').controller('EffectController',EffectController)
}