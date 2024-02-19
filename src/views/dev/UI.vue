<template>
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
        <input v-model="timeline1ViewStart" type="number" /> -
        <input v-model="timeline1ViewEnd" type="number" />
        <SLTimeline
            v-model="timeline1Items"
            :start="timeline1ViewStart"
            :end="timeline1ViewEnd"
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
import { PhCheck, PhDownload, PhFileVue, PhPlus, PhX } from '@phosphor-icons/vue';
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

const timeline1ViewStart = ref(0);
const timeline1ViewEnd = ref(120);
const timeline1Items = ref<TimelineComponentItem[]>([]);

onMounted(() => {
    for (let i = 0; i < 10; i++) {
        const start = Math.random() * 80;
        timeline1Items.value.push({
            title: (i + 1).toString(),
            layer: Math.floor(Math.random() * 5),
            start,
            end: start + Math.random() * 10 + 10
        });
    }
});
</script>
