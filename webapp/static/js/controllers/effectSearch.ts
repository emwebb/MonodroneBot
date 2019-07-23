namespace MonodroneBot {

    export class SearchEffectController {
        static $inject = ['EffectService'];
        effects: Effect[];
        constructor(private effectService: IEffectService) {

        };

        submit(name : {}) {
            this.effectService.search(name).then((result : ng.IHttpPromiseCallbackArg<Effect[]>) => {
                this.effects = result.data;
            }).catch((reason) => {
                alert(JSON.stringify(reason));
            });
        }

        search(name : {}) {
            this.effectService.search(name).then((result : ng.IHttpPromiseCallbackArg<Effect[]>) => {
                return result.data.map((value) => {
                    return value.name;
                });
            }).catch((reason) => {
                alert(JSON.stringify(reason));
            });
        }
    }

    angular.module('MonodroneBot').controller('SearchEffectController',SearchEffectController)
}