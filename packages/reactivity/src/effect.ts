export function effect(fn, options?) {
    //创建一个响应式effect 数据变化后可以重新执行
    //创建之后，每一次effect里面回调函数依赖的数据变了就重新执行
    //创建一个effect,只要依赖的属性变化了就要执行回调
    const _effect = new ReactiveEffect(fn, () => {
        // scheduler
        _effect.run()
    })
    // effect默认就要执行一次
    _effect.run()

    return _effect
}

// 这个变量就是一个接口，通过这个接口在proxy中访问到effect中涉及的属性
export let activeEffect;

class ReactiveEffect {
    // 用于记录当前effect执行了几次
    _trackId = 0;
    // 创建的effect是响应式的
    public active = true;
    // fn用户编写的函数
    // 如果fn中依赖的数据发生变化后，需要重新调用 -> run()
    constructor(public fn, public scheduler) {

    }

    run() {
        // 不是激活的，执行后什么都不用做
        if (!this.active) {
            return this.fn()
        }
        let lastEffect = activeEffect;
        try {
            activeEffect = this;
            // 是激活的做依赖收集（让该effect和effect回调中用到的属性对应起来）
            return this.fn()
        } finally {
            activeEffect = lastEffect;
        }

    }
}


export function trackEffect(effect, dep) {
    dep.set(effect, effect._trackId)
}
