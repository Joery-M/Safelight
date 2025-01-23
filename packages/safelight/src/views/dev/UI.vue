<!-- eslint-disable vue/no-v-model-argument -->
<template>
    <RouterLink to="/dev">
        <Button icon="ph ph-arrow-left" />
    </RouterLink>

    <Card title="Timeline">
        <template #content>
            <div class="flex">
                <Slider v-model="timeline1ViewRange" :max="120" range />
            </div>
            <Button @click="timeline1.resizeToFitAll()">Fit</Button>
        </template>
    </Card>

    <Card title="Lists">
        <template #content>
            <label id="noSearchLb">No search</label>
            <Listbox
                aria-labelledby="#noSearchLb"
                :options="'abcdefghijklmnopqrstuvwxyz'.split('')"
            >
            </Listbox>
            <label id="searchLb">With search</label>
            <Listbox
                aria-labelledby="#searchLb"
                filter
                :options="'abcdefghijklmnopqrstuvwxyz'.split('')"
            >
            </Listbox>
        </template>
    </Card>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Card from 'primevue/card';
import Listbox from 'primevue/listbox';
import Slider from 'primevue/slider';
import { v4 as uuidv4 } from 'uuid';
import { onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';

const timeline1 = ref();
// const timeline1Selection = ref<any[]>();
const timeline1ViewStart = ref(0);
const timeline1ViewEnd = ref(120);
const timeline1ViewRange = ref([0, 120]);
const timeline1Items = ref<any[]>([]);

watch(timeline1ViewRange, () => {
    timeline1ViewStart.value = timeline1ViewRange.value[0];
    timeline1ViewEnd.value = timeline1ViewRange.value[1];
});
watch(timeline1ViewStart, () => {
    timeline1ViewRange.value[0] = timeline1ViewStart.value;
});
watch(timeline1ViewStart, () => {
    timeline1ViewRange.value[1] = timeline1ViewEnd.value;
});

onMounted(() => {
    for (let i = 0; i < 20; i++) {
        let tries = 0;

        while (tries < 100) {
            tries++;

            const start = Math.random() * 90;
            const end = start + Math.random() * 10 + 10;
            const layer = Math.floor(Math.random() * 20);
            let spotTaken = timeline1Items.value.some((item) => {
                if (
                    item.layer == layer &&
                    Math.max(item.end, end) - Math.min(item.start, start) <
                        item.end - item.start + (end - start)
                ) {
                    return true;
                }
            });
            if (spotTaken) continue;

            timeline1Items.value.push({
                id: uuidv4(),
                title: (i + 1).toString(),
                layer,
                start,
                end,
                isGhost: false
            });
            break;
        }
    }
});
</script>
