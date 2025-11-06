/// <reference types="vue/macros-global" />
import { VNode, RendererNode, RendererElement, HTMLAttributes } from 'vue';

declare global {
    namespace JSX {
        // Vue 的 JSX 类型定义
        interface Element extends VNode { }
        interface ElementClass {
            $props: any;
        }
        interface ElementAttributesProperty {
            $props: any;
        }
        interface IntrinsicElements {
          [elem: string]: HTMLAttributes;
        }
    }
}
