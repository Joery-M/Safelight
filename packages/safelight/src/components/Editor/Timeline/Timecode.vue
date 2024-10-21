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
import { computed, ref } from 'vue';

const project = useProject();

const timecodeVal = computed(() => {
    const timeline = project.p?.timeline;

    return timeline?.value
        ? Timecode.fromFrames(timeline.value.pbPos.value, timeline.value.framerate.value)
        : 0;
});

const inplace = ref<typeof Inplace>();

function onChange(ev: Event) {
    const timeline = project.p?.timeline;
    if (!timeline?.value) return;

    const val = (ev.target as HTMLInputElement)?.value;
    console.log(val);
    if (val) {
        const res = Timecode.fromFormattedTimecode(val);
        console.log(res);
        timeline.value.pbPos.value = Math.round(res / timeline.value.framerate.value);
    }
    if (inplace.value) {
        inplace.value.$emit('close', new Event('close'));
        inplace.value.$props.active = false;
    }
}
</script>
