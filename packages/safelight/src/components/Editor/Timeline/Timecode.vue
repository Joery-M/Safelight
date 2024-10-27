<template>
    <Inplace ref="inplace" closable>
        <template #display>
            {{ Timecode.toFormattedTimecode(timecodeVal) }}
        </template>
        <template #content>
            <InputMask
                v-focustrap
                :slot-char="Timecode.toFormattedTimecode(timecodeVal)"
                mask="99:99:99.999"
                @change="onChange"
            />
        </template>
    </Inplace>
</template>

<script setup lang="ts">
import { useProject } from '@/stores/useProject';
import Timecode from '@safelight/shared/Timecode';
import Inplace from 'primevue/inplace';
import InputMask from 'primevue/inputmask';
import { computed, ref, type ComponentInstance } from 'vue';

const project = useProject();

const timecodeVal = computed(() =>
    project.timeline
        ? Timecode.fromFrames(project.timeline.pbPos.value, project.timeline.framerate.value)
        : 0
);

const inplace = ref<ComponentInstance<typeof Inplace>>();

function onChange(ev: Event) {
    if (!project.timeline) return;

    const val = (ev.target as HTMLInputElement)?.value;
    console.log(val);
    if (val) {
        const res = Timecode.fromFormattedTimecode(val);
        console.log(res);
        project.timeline.pbPos.value = Math.round(res / project.timeline.framerate.value);
    }
    if (inplace.value) {
        inplace.value.$emit('close', new Event('close'));
        inplace.value.$props.active = false;
    }
}
</script>
