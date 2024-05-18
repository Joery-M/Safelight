<template>
    <Inplace ref="inplace" closable>
        <template #display>
            {{ Timecode.toFormattedTimecode(timecodeVal ?? 0) }}
        </template>
        <template #content>
            <InputMask
                v-focustrap
                :slot-char="Timecode.toFormattedTimecode(timecodeVal ?? 0)"
                mask="99:99:99.999"
                @keypress.enter="onChange"
            />
        </template>
    </Inplace>
</template>

<script setup lang="ts">
import Timecode from '@safelight/shared/Timecode';
import type Inplace from 'primevue/inplace';

const timecodeVal = CurrentProject.project.value?.timeline.value?.pbPos;

const inplace = ref<Inplace>();

function onChange(ev: Event) {
    const val = (ev.target as HTMLInputElement)?.value;
    if (val) {
        const res = Timecode.fromFormattedTimecode(val);
        if (timecodeVal) {
            timecodeVal.value = res;
        }
        console.log(val, res);
    }
    if (inplace.value) {
        inplace.value.$props.active = false;
    }
}
</script>
