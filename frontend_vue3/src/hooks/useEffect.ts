import { watch, onUnmounted, isRef, getCurrentInstance } from 'vue';
import type { WatchSource } from 'vue';

type EffectCleanup = void | (() => void);
type Effect = () => EffectCleanup;

const useEffect = (effect: Effect, deps?: any[]): void => {
    // 确保在组件上下文中调用
    if (!getCurrentInstance()) throw new Error('useEffect must be called within a component setup function');

    let cleanup: EffectCleanup;
    let isFirstRun = true;

    const applyEffect = () => {
        if (cleanup) cleanup(); // 执行清理函数
        cleanup = effect(); // 执行 effect 并存储新的清理函数
    };

    // 处理不同依赖情况
    const getWatchSource = (): WatchSource<any> | WatchSource<any>[] => {
        if (!deps) {
            return () => { }; // 情况1：没有 deps，每次更新都执行
        } else if (deps.length === 0) {
            return () => { }; // 情况2：空数组，仅首次执行
        } else {
            return deps.map((dep) => (isRef(dep) ? dep : () => dep)); // 情况3：有依赖，依赖变化时执行
        }
    };

    const stop = watch(
        getWatchSource(),
        () => {
            if (deps?.length === 0) {
                // 对于空依赖数组的情况，只在首次执行
                if (isFirstRun) {
                    applyEffect();
                    isFirstRun = false;
                }
                return;
            }

            applyEffect(); // 其他情况正常执行
        },
        { immediate: true },
    );

    // 组件卸载时清理
    onUnmounted(() => {
        stop();
        if (cleanup) cleanup();
    });
};

export default useEffect;