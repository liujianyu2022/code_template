import React, { useRef, useEffect, useLayoutEffect, forwardRef, useImperativeHandle } from 'react';
import * as echarts from 'echarts/core';
import type { EChartsType, ComposeOption, ElementEvent } from 'echarts/core';
import type { ECElementEvent } from 'echarts/types/src/util/types';

// 图表类型
import {
    BarChart,
    BarSeriesOption,
    LineChart,
    LineSeriesOption,
    ScatterChart,
    ScatterSeriesOption,
} from 'echarts/charts';

// 组件类型
import {
    TitleComponent,
    TitleComponentOption,

    TooltipComponent,
    TooltipComponentOption,

    GridComponent,
    GridComponentOption,

    DataZoomComponent,
    DataZoomComponentOption,

    DatasetComponent,
    DatasetComponentOption,

    TransformComponent,

    MarkLineComponent,
    MarkLineComponentOption,

    MarkAreaComponent,
    MarkAreaComponentOption,

    MarkPointComponent,
    MarkPointComponentOption,

    ToolboxComponent,
    ToolboxComponentOption,

    BrushComponent,
    BrushComponentOption,

    LegendComponent,
    LegendComponentOption,
} from 'echarts/components';

// 特性和渲染器
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';

// 组合 Option 类型
export type MyEchartsOption = ComposeOption<
    | BarSeriesOption
    | LineSeriesOption
    | ScatterSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | DataZoomComponentOption
    | DatasetComponentOption
    | MarkLineComponentOption
    | MarkAreaComponentOption
    | MarkPointComponentOption
    | ToolboxComponentOption
    | BrushComponentOption
    | LegendComponentOption
>;

// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    DataZoomComponent,
    MarkLineComponent,
    MarkAreaComponent,
    MarkPointComponent,
    LegendComponent,
    ToolboxComponent,
    BrushComponent,
    BarChart,
    LineChart,
    ScatterChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    SVGRenderer,
]);

export interface MyChartProps {
    /** 图表高度 */
    height: string | number;
    /** 图表宽度 */
    width: string | number;
    /** ECharts 配置项 */
    option: MyEchartsOption;
    /** 最小高度 */
    minHeight?: string | number;

    /** 是否合并配置（用于增量更新） */
    merge?: boolean;

    /** 是否显示加载状态 */
    loading?: boolean;

    /** 空状态显示内容 */
    empty?: React.ReactElement;

    /** 点击事件回调 */
    onClick?: (event: ECElementEvent | ElementEvent, xIndex?: number, radioValue?: string) => void;

    /** 刷选事件回调 */
    onBrushSelected?: (params: any) => void;
    /** 自定义样式 */
    style?: React.CSSProperties;

    /** 渲染器类型 */
    renderer?: 'canvas' | 'svg';
}

export interface MyChartRef {
    /** 获取 ECharts 实例 */
    instance(): EChartsType | undefined;
    /** 重新调整图表大小 */
    resize(): void;
    /** 显示加载状态 */
    showLoading(): void;
    /** 隐藏加载状态 */
    hideLoading(): void;
}

const MyChartInner: React.ForwardRefRenderFunction<MyChartRef, MyChartProps> = (props, ref) => {
    const {
        option,
        width = '100%',
        height = '400px',
        loading = false,
        minHeight,
        style,
        renderer = 'svg',
        onClick,
        onBrushSelected,
    } = props;

    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<EChartsType>();

    /**
     * 初始化图表实例
     */
    const initChart = () => {
        if (!chartRef.current) return;

        // 检查是否已经存在实例
        const existingInstance = echarts.getInstanceByDom(chartRef.current);
        if (existingInstance) {
            chartInstance.current = existingInstance;
            return;
        }

        // 创建新实例
        chartInstance.current = echarts.init(chartRef.current, undefined, {
            renderer,
        });

        // 绑定事件
        bindChartEvents();
    };

    /**
     * 绑定图表事件
     */
    const bindChartEvents = () => {
        if (!chartInstance.current) return;

        // 使用 getZr() 监听整个画布的点击事件
        chartInstance.current.getZr().on('click', (event: any) => {
            if (!onClick) return;

            const pointInPixel = [event.offsetX, event.offsetY];

            try {
                // 尝试将像素坐标转换为数据坐标
                const pointInData = chartInstance.current!.convertFromPixel({ seriesIndex: 0 }, pointInPixel);
                const xIndex = pointInData[0];

                onClick(event, xIndex);
            } catch (error) {
                // 如果转换失败，直接传递事件
                onClick(event, undefined);
            }
        });

        // 绑定刷选事件
        chartInstance.current.on('brushSelected', (params: any) => {
            onBrushSelected?.(params);
        });

        // 绑定鼠标悬停事件
        chartInstance.current.on('mouseover', (params: any) => {
            // 可以在这里添加鼠标悬停的额外逻辑

        });
    };

    /**
     * 更新图表配置
     */
    const updateChart = () => {
        if (!chartInstance.current || !option) return;

        chartInstance.current.setOption(option, {
            notMerge: !props.merge,
        });

        // 控制加载状态
        if (loading) {
            chartInstance.current.showLoading();
        } else {
            chartInstance.current.hideLoading();
        }
    };

    /**
     * 调整图表大小
     */
    const resizeChart = () => {
        chartInstance.current?.resize({
            animation: { duration: 300 },
        });
    };

    /**
     * 显示加载状态
     */
    const showLoading = () => {
        chartInstance.current?.showLoading();
    };

    /**
     * 隐藏加载状态
     */
    const hideLoading = () => {
        chartInstance.current?.hideLoading();
    };

    // 初始化图表
    useEffect(() => {
        initChart();
        return () => {
            // 清理图表实例
            if (chartInstance.current) {
                chartInstance.current.dispose();
                chartInstance.current = undefined;
            }
        };
    }, []);

    // 更新图表配置
    useEffect(() => {
        updateChart();
    }, [option, loading]);

    // 监听窗口大小变化
    useEffect(() => {
        window.addEventListener('resize', resizeChart);
        return () => {
            window.removeEventListener('resize', resizeChart);
        };
    }, []);

    // 监听尺寸变化
    useLayoutEffect(() => {
        resizeChart();
    }, [width, height]);

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
        instance: () => chartInstance.current,
        resize: resizeChart,
        showLoading,
        hideLoading,
    }));

    return (
        <div
            ref={chartRef}
            style={{
                width,
                height,
                minHeight,
                ...style,
            }}
        />
    );
};

// 使用 React.memo 优化性能
const MyChart = forwardRef(MyChartInner);

export default React.memo(MyChart);