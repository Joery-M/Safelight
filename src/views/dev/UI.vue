<!-- eslint-disable vue/no-v-model-argument -->
<template>
    <SLButton to="/dev/" style="margin: 0.5rem"><PhArrowLeft /></SLButton>
    <SLCard title="Buttons">
        <SLButton size="sm"> Small </SLButton>
        <SLButton size="md"> Medium </SLButton>
        <SLButton size="lg"> Large </SLButton>
        <SLButton size="xl"> Extra Large </SLButton>

        <h2>Wide</h2>
        <SLButton wide>Wide</SLButton>

        <h2>States</h2>
        <SLButton outline>Outline</SLButton>
        <SLButton square>Colorado</SLButton>
        <SLButton circle>Circle</SLButton>
        <SLButton active>Active</SLButton>
        <SLButton disabled>Disabled</SLButton>

        <h2>Icons</h2>
        <SLButton loading />
        <SLButton loading>Loading text</SLButton>
        <SLButton loading square />
        <SLButton square>
            <PhFileVue />
        </SLButton>
        <SLButton circle>
            <PhPlus />
        </SLButton>
        <SLButton
            :loading="showDownloadLoading"
            :disabled="showDownloadLoading"
            :type="showDownloadSuccess ? 'success' : showDownloadFail ? 'fail' : undefined"
            @click="ClickDownload"
        >
            <template #icon>
                <PhCheck v-if="showDownloadSuccess" />
                <PhX v-else-if="showDownloadFail" />
                <PhDownload v-else />
            </template>
            Download
        </SLButton>
    </SLCard>

    <SLCard title="Timeline">
        <p>View range:</p>
        <input v-model="timeline1ViewStart" type="number" min="0" /> -
        <input v-model="timeline1ViewEnd" type="number" min="0" />
        <SLButton @click="timeline1.resizeToFitAll()">Fit</SLButton>
        <SLTimeline
            ref="timeline1"
            v-model="timeline1Items"
            v-model:start="timeline1ViewStart"
            v-model:end="timeline1ViewEnd"
            class="h-64"
        />
    </SLCard>

    <SLCard title="Lists">
        <SLList v-slot="{ item }" :items="'abcdefghijklmnopqrstuvwxyz'.split('')">
            <div>{{ item }}</div>
        </SLList>
        <SLList v-slot="{ item }" scrollable search :items="'abcdefghijklmnopqrstuvwxyz'.split('')">
            <div>{{ item }}</div>
        </SLList>
    </SLCard>
</template>

<script setup lang="ts">
import { PhArrowLeft, PhCheck, PhDownload, PhFileVue, PhPlus, PhX } from '@phosphor-icons/vue';
import { type TimelineComponentItem } from '../../@core/components/Timeline/SLTimeline.vue';

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
