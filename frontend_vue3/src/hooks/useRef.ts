import { ref } from 'vue';

const useRef = <T>(initialValue: T | T | null = null) => {
    return ref<T | null>(initialValue);
};

export default useRef;