<!-- eslint-disable vue/no-v-model-argument -->
<template>
    <RouterLink to="/dev/">
        <Button style="margin: 0.5rem" alt="To dev pages overview">
            <PhArrowLeft />
        </Button>
    </RouterLink>

    <Card title="Timeline">
        <template #content>
            <div class="flex">
                <Slider v-model="timeline1ViewStart" :min="0" />
                <Slider v-model="timeline1ViewEnd" :max="120" />
            </div>
            <Button @click="timeline1.resizeToFitAll()">Fit</Button>
            <SLTimeline
                ref="timeline1"
                v-model="timeline1Items"
                v-model:start="timeline1ViewStart"
                v-model:end="timeline1ViewEnd"
                v-model:selectedItems="timeline1Selection"
                class="h-96"
                @item-click="
                    (item) => {
                        if (!timeline1Selection?.includes(item)) timeline1Selection?.push(item);
                    }
                "
            >
                <template #layerControls="{ index }">
                    <Button outlined>
                        <template #icon>
                            <PhEye size="12" />
                        </template>
                    </Button>
                    {{ index }}
                </template>
            </SLTimeline>
            <Listbox :options="timeline1Selection" data-key="id" />
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
import { v4 as uuidv4 } from 'uuid';
import { type TimelineComponentItem } from '../../@core/components/Timeline/SLTimeline.vue';
import Listbox from 'primevue/listbox';
import Button from 'primevue/button';
import { RouterLink } from 'vue-router';

const showDownloadLoading = ref(false);
const showDownloadSuccess = ref(false);
const showDownloadFail = ref(false);

function ClickDownload() {
    showDownloadLoading.value = true;
    useTimeoutFn(() => {
        showDownloadLoading.value = false;

        if (Math.random() > 0.5) showDownloadSuccess.value = true;
        else {
            showDownloadFail.value = true;
        }
        useTimeoutFn(() => {
            showDownloadSuccess.value = false;
            showDownloadFail.value = false;
        }, 1000);
    }, 1000);
}

const timeline1 = ref();
const timeline1Selection = ref<TimelineComponentItem[]>();
const timeline1ViewStart = ref(0);
const timeline1ViewEnd = ref(120);
const timeline1Items = ref<TimelineComponentItem[]>([]);

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

<route lang="json">
{ "name": "UI Components" }
</route>
