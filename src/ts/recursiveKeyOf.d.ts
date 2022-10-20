
type RecursiveKeyofInternal<O extends object,splitKey extends string = '.',F = true> = {
  [K in keyof O  & string]:RecursiveGetValue<F extends true ? K : `${splitKey}${K}`,O[K],splitKey> 
}[keyof O & string]
type RecursiveGetValue<K extends (string | number),Value,splitKey extends string> = Value extends (infer U)[]  
  ? U extends object 
    ? `${K}${RecursiveKeyofInternal<U,splitKey,false>}` | K 
    : K
  : Value extends object 
    ? `${K}${RecursiveKeyofInternal<Value,splitKey,false>}` | K
    : K
/**
 * Get the posibles recursives keys separated with "splitKey"
 */
export type RecursiveKeyOf<O extends object,splitKey extends string = '.'> = RecursiveKeyofInternal<O,splitKey,true>