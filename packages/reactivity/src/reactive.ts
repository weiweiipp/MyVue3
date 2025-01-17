import { isObject } from "@vue/shared";
import { mutableHandlers, ReactiveFlags } from "./baseHandler";

/**
 * 注意问题
 * 1，对象不能被重复代理，取缓存
 * 2，对象如果被代理过了，再次被代理时也要做处理
 */


//用于记录我们代理后的结果，可以复用
const reactiveMap = new WeakMap();



function createReactiveObject(target) {
    //统一做判断，响应式对象必须是对象才可以
    if (!isObject(target)) {
        return target;
    }
    // 如果对象没被代理，则该判断为false，往下走
    // 如果对象被代理过了，则自动触发mutableHandlers的get方法，通过判断，直接返回这个被代理过的对象
    if (target[ReactiveFlags.IS_REACTIVE]) {
        return target
    }
    // 取缓存，如果有直接返回
    const exitsProxy = reactiveMap.get(target);
    if (exitsProxy) {
        return exitsProxy
    }
    let proxy = new Proxy(target, mutableHandlers);
    // 根据对象缓存 代理后的结果
    reactiveMap.set(target, proxy)
    return proxy
}

export function reactive(target) {
    return createReactiveObject(target);
}
