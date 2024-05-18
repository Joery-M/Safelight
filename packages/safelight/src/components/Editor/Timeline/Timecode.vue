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
import Timecode from '@safelight/shared/Timecode';
import type Inplace from 'primevue/inplace';

const timeline = CurrentProject.project.value!.timeline;
const timecodeVal = computed(() =>
    timeline.value
        ? Timecode.fromFrames(timeline.value.pbPos.value, timeline.value.framerate.value)
        : 0
);

const inplace = ref<Inplace>();

function onChange(ev: Event) {
    const val = (ev.target as HTMLInputElement)?.value;
    console.log(val);
    if (val) {
        const res = Timecode.fromFormattedTimecode(val);
        console.log(res);
        timeline.value!.pbPos.value = Math.round(res / timeline.value!.framerate.value);
    }
    if (inplace.value) {
        inplace.value.$emit('close', new Event('close'));
        inplace.value.$props.active = false;
    }
}
</script>
