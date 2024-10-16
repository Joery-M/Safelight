<template>
    <Card>
        <template #subtitle>
            <RouterLink to="/dev/storage">
                <Button>
                    <template #icon>
                        <PhArrowLeft />
                    </template>
                </Button>
            </RouterLink>
        </template>
        <template #content>
            <TreeTable :value="treeItems">
                <Column field="name" :header="$t('general.descriptions.name')" expander />
                <Column field="size" :header="$t('general.descriptions.size')" />
                <Column :header="$t('general.actions.delete')">
                    <template #body="{ node: { data } }">
                        <Button v-if="data?.isMedia" rounded @click="deleteMedia(data.id)">
                            <template #icon>
                                <PhTrash />
                            </template>
                        </Button>
                    </template>
                </Column>
            </TreeTable>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { PhArrowLeft, PhTrash } from '@phosphor-icons/vue';
import type {
    ChunkOffset,
    MediaFileAudioTrack,
    MediaFileVideoTrack
} from '@safelight/shared/Media/ChunkedMediaFile';
import { IndexedDbStorageController } from '@safelight/shared/Storage/LocalStorage/IndexedDbStorage';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import type { TreeNode } from 'primevue/treenode';
import TreeTable from 'primevue/treetable';
import { onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const treeItems = reactive<TreeNode[]>([]);
const i18n = useI18n();

function formatByteValue(n: number) {
    const UNITS = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte'];

    const i = n == 0 ? 0 : Math.floor(Math.log(n) / Math.log(1024));
    const value = n / Math.pow(1024, i);
    const unit = UNITS[i];

    const formatter = new Intl.NumberFormat(undefined, {
        notation: 'standard',
        style: 'unit',
        unit: unit,
        unitDisplay: 'narrow',
        maximumFractionDigits: 1
    });
    return formatter.format(value);
}

const storage = new IndexedDbStorageController();
onMounted(() => {
    loadMedia();
});

async function deleteMedia(id: string) {
    await storage.deleteMedia(id);
    loadMedia();
}

function loadMedia() {
    storage.getAllMedia().then((m) => {
        while (treeItems.length > 0) {
            treeItems.shift();
        }
        m.forEach((media) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            const tracks = (Object.values(media.getMetadata('source.tracks')) ?? []) as (
                | MediaFileAudioTrack
                | MediaFileVideoTrack
            )[];
            const chunksPerTrack: { [key: number]: number } = {};

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            const chunks = (media.getMetadata('source.chunkOffsets') ?? []) as ChunkOffset[];
            chunks.forEach((c) => {
                chunksPerTrack[c.trackIndex] ||= 0;
                chunksPerTrack[c.trackIndex]++;
            });

            treeItems.push({
                key: media.id,
                data: {
                    isMedia: true,
                    id: media.id,
                    name: media.name,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-expect-error
                    size: formatByteValue(Number(media.getMetadata('file.size')))
                },
                children: tracks.map((track) => {
                    return {
                        key: track.trackIndex.toString(),
                        data: {
                            name:
                                track.type == 'video'
                                    ? `${track.trackIndex}: ${track.codec} @ ${track.width}x${track.height}` +
                                      (track.framerate ? `, ${track.framerate}fps` : '')
                                    : `${track.trackIndex}: ${track.codec} @ ${i18n.n(track.sampleRate)}hz, ${track.channels} channels`,
                            size: `${i18n.n(chunksPerTrack[track.trackIndex])} chunks`
                        }
                    };
                })
            });
        });
    });
}
</script>
