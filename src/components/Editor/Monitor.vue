<template>
    <div ref="monitorContainer" class="flex flex-justify-center">
        <Renderer
            ref="renderer"
            :autoResize="false"
            :antialias="antialias ?? true"
            :width="canvasSize.width"
            :height="canvasSize.height"
        >
            <OrthographicCamera :position="position ?? new Vector3(0, 0, 1000)">
            </OrthographicCamera>
            <Scene background="#000000">
                <Mesh>
                    <MeshBasicMaterial color="blue" />
                    <BoxGeometry :width="15" :height="10" />
                </Mesh>
            </Scene>
        </Renderer>
    </div>
</template>

<script setup lang="ts">
import { Vector3, type Vector3Like } from 'three';
import { Renderer } from '@janvorisek/drie';
import BaseTimeline from '@/controllers/base/Timeline';

const monitorContainer = ref<HTMLDivElement>();

const props = defineProps<{
    timeline: BaseTimeline;
    position?: Vector3Like;
    rotation?: Vector3Like;
    width?: number;
    height?: number;
    perspective?: boolean;
    antialias?: boolean;
}>();

const monitorSize = useElementSize(monitorContainer);
const canvasSize = ref({ width: 100, height: 100 });

watch([monitorSize.width, monitorSize.height, props.timeline], () => {
    canvasSize.value = resize(
        {
            width: props.timeline.width,
            height: props.timeline.height
        },
        {
            width: monitorSize.width.value,
            height: monitorSize.height.value
        }
    );
});

function resize(size: { height: number; width: number }, max: { width: number; height: number }) {
    // can we maximize the width without exceeding height limit?
    let resize_factor =
        size.height / (size.width / max.width) <= max.height
            ? size.width / max.width
            : size.height / max.height;

    return { width: size.width / resize_factor, height: size.height / resize_factor };
}
</script>
