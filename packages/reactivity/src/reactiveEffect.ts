import { activeEffect, trackEffect, triggerEffects } from "./effect";

const targetMap = new WeakMap();

export const createDep = (cleanup, key) => {
    const dep = new Map() as any;
    dep.cleanup = cleanup;
    dep.name = key;
    return dep
}

export function track(target, key) {
    //activeEffect 有这个属性说明这个key是在effect中访问的，没有说明在effect之外访问的不用收集
    if (activeEffect) {
        let depsMap = targetMap.get(target);

        if (!depsMap) {
            // 新增的
            targetMap.set(target, (depsMap = new Map()))
        }

        let dep = depsMap.get(key)

        if (!dep) {
            depsMap.set(
                key,
                (dep = createDep(() => depsMap.delete(key), key))
            )
        }
        // 将当前的effect放入到dep(映射表)中，后续可以根据值得变化触发此dep中存放的effect
        trackEffect(activeEffect, dep)
        console.log(targetMap);
    }
}


export function trigger(target,key,newValue,oldValue){
   const  depsMap =  targetMap.get(target)
   if(!depsMap){
    return
   }
   let dep = depsMap.get(key);
   if(dep){
        // 修改的属性对应了更新
        triggerEffects(dep)
   }
}