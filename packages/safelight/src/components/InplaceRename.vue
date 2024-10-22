<template>
    <slot v-if="!isOpen" name="default">
        <label class="cursor-pointer select-none" @dblclick="open()">{{ value }}</label>
    </slot>
    <slot v-else name="content" :cur-value="curValue" :close="close">
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
import { ref } from 'vue';

defineSlots<{
    default: [];
    content: {
        close: () => void;
        curValue: string;
    };
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
