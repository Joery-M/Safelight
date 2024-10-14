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
                <Column field="size" :header="$t('general.descriptions.size')" expander />
            </TreeTable>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { PhArrowLeft } from '@phosphor-icons/vue';
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
onMounted(() => {
    const storage = new IndexedDbStorageController();
    const formatter = new Intl.NumberFormat(undefined, { style: 'unit', unit: 'megabyte' });
    storage.getAllMedia().then((m) => {
        m.forEach((media) => {
            treeItems.push({
                key: media.id,
                data: {
                    name: media.name,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-expect-error
                    size: formatter.format(Number(media.getMetadata('file.size')) / 1024 / 1024)
                }
            });
        });
    });
});
</script>
