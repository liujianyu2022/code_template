import { ref } from 'vue';

const useState = <T>(initialState: T) => {
    const state = ref<T>(initialState);

    const setState = (newValue: T | ((prev: T) => T)) => {
        if (typeof newValue === 'function') {
            state.value = (newValue as (prev: T) => T)(state.value);
        } else {
            state.value = newValue;
        }
    };

    return [state, setState] as const; // 返回 ref 而不是 .value
};

export default useState;