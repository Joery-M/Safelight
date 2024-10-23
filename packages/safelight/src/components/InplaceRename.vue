<template>
    <slot v-if="!isOpen" name="default" :open="open">
        <label
            class="cursor-pointer select-none"
            tabindex="0"
            @dblclick="open()"
            @keypress.enter="open()"
            >{{ value }}</label
        >
    </slot>
    <slot
        v-else
        name="content"
        :cur-value="curValue"
        :close="close"
        :send-value="sendValue"
        :set-cur-value="
            (value: string | undefined) => (value !== undefined ? (curValue = value) : undefined)
        "
    >
        <div v-focustrap>
            <InputText
                v-model="curValue"
                autofocus
                @focusout="close()"
                @keyup.enter="sendValue(true)"
                @keyup.escape="close()"
            />
        </div>
    </slot>
</template>

<script lang="ts" setup>
import InputText from 'primevue/inputtext';
import { ref, type VNode } from 'vue';

defineSlots<{
    default: (scope: { open: () => void }) => VNode[];
    content: (scope: {
        close: () => void;
        sendValue: (forceClose: boolean) => void;
        curValue: string;
        setCurValue: (value: string | undefined) => void;
    }) => VNode[];
}>();

const props = defineProps<{
    value: string;
    closeOnChange?: boolean;
}>();

const isOpen = ref(false);

const curValue = ref(props.value);

const emit = defineEmits<{
    change: [string];
}>();

function open() {
    curValue.value = props.value;
    isOpen.value = true;
}
function close() {
    isOpen.value = false;
    curValue.value = props.value;
}
function sendValue(forceClose = false) {
    emit('change', curValue.value);
    if (props.closeOnChange || forceClose) close();
}
</script>
