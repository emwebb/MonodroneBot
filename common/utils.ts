 export function enumToArray<T>(enumClass : any) : T[] {
    return Object.keys(enumClass).map((key) => {return enumClass[key]});
 }