import { activeEffect } from "./effect";
import { track, trigger } from "./reactiveEffect";

export enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive", //基本上唯一
}

// proxy需要搭配reflect来使用
// reflect可以在代码执行的时候修改代码的行为
export const mutableHandlers: ProxyHandler<any> = {
    get(target, key, recevier) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        }
        // 当取值的时候，应该让响应式属性和effect映射起来
        // 依赖收集
        // 收集这个对象上的这个属性，和effect关联在一起
        track(target, key)

        return Reflect.get(target, key, recevier)

    },
    set(target, key, value, recevier) {
        // 找到属性，让对应的effect重新执行
        let oldValue = target[key];
        let result = Reflect.set(target, key, value, recevier)
        if(oldValue !== value){
        // 触发更新 
            trigger(target,key,value,oldValue)
        }
        

        return result
    }
}
