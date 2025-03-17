<template>
    <Card>
        <template #subtitle>
            <RouterLink to="/dev">
                <Button icon="i-ph-arrow-left" />
            </RouterLink>
        </template>
        <template #content>
            <Tabs
                value="Safelight"
                @update:value="
                    (e) => {
                        // Give some time to the animation of the tabview and to show the skeleton
                        showDisclaimer = e.toString() == 'disclaimer';
                    }
                "
            >
                <TabList>
                    <Tab
                        v-for="(_deps, project) in allPackagesPerProject"
                        :key="project"
                        :value="project"
                    >
                        {{ project }}
                    </Tab>
                    <Tab value="disclaimer">Disclaimer</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel
                        v-for="(deps, project) in allPackagesPerProject"
                        :key="project"
                        :header="project.toString()"
                        :value="project"
                    >
                        <DataView
                            :value="deps"
                            data-key="name"
                            layout="grid"
                            lazy
                            style="max-height: 72vh; overflow-y: scroll"
                        >
                            <template #grid="slotProps: { items: DependencyWithName[] }">
                                <div
                                    class="grid"
                                    style="
                                        grid-template-columns: repeat(
                                            auto-fill,
                                            minmax(325px, 1fr)
                                        );
                                    "
                                >
                                    <div
                                        v-for="item in slotProps.items"
                                        :key="item.name"
                                        class="m-2 h-55 flex flex-col border-white/10 border-rounded rounded-md border-solid p-4"
                                        style="border-width: 1px"
                                    >
                                        <a
                                            :href="
                                                item.homepage ??
                                                `https://www.npmjs.com/package/${item.name}`
                                            "
                                            target="_blank"
                                            class="text-xl text-white font-semibold"
                                            style="
                                                text-decoration: none;
                                                text-decoration-line: none;
                                            "
                                        >
                                            <i
                                                v-if="item.isDev"
                                                v-tooltip.top="{
                                                    value: 'Development package',
                                                    pt: { root: { style: 'margin-left: 9px;' } }
                                                }"
                                                style="width: 20px"
                                                class="i-ph-dev-to-logo align-text-top"
                                            />
                                            {{ item.from }}
                                            <i class="i-ph-arrow-square-out align-text-top" />
                                        </a>
                                        <span
                                            v-if="item.author || item.license"
                                            class="text-sm text-primary font-medium"
                                        >
                                            <template v-if="item.author">
                                                {{ item.author?.name }} -
                                            </template>
                                            <a
                                                :href="
                                                    'https://opensource.org/license/' +
                                                    (typeof item.license === 'string'
                                                        ? item.license
                                                        : item.license.type)
                                                "
                                                target="_blank"
                                                class="text-primary"
                                            >
                                                {{
                                                    typeof item.license === 'string'
                                                        ? item.license
                                                        : item.license.type
                                                }}
                                            </a>
                                        </span>
                                        <div class="line-clamp-3 mt-2 grow">
                                            {{ item.description }}
                                        </div>
                                        <div class="mt-4 flex flex-col gap-4">
                                            <div class="flex gap-2">
                                                <Button
                                                    v-if="item.homepage"
                                                    role="link"
                                                    icon="i-ph-house"
                                                    @click="openUrl(item.homepage)"
                                                />
                                                <Button
                                                    v-if="item.repository"
                                                    outlined
                                                    :title="'Open code repository for ' + item.from"
                                                    role="link"
                                                    icon="i-ph-git-branch"
                                                    @click="
                                                        openUrl(
                                                            item.repository!.replace('git+', '')
                                                        )
                                                    "
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </DataView>
                    </TabPanel>
                    <TabPanel header="Disclaimer" value="disclaimer">
                        <div
                            :overflow-y="disclaimer.data.value ? 'auto' : 'clip'"
                            style="max-height: 72vh"
                        >
                            <template v-if="!disclaimer.data.value">
                                <template v-for="i in 100" :key="i">
                                    <Skeleton
                                        shape="rectangle"
                                        :width="Math.random() * 100 + '%'"
                                        :mb="Math.random() > 0.5 ? '2' : '4'"
                                    />
                                </template>
                            </template>
                            <vue-markdown
                                v-else
                                :options="{
                                    linkify: true
                                }"
                                :source="disclaimer.data.value"
                                class="m-2"
                            >
                            </vue-markdown>
                        </div>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </template>
    </Card>
</template>

<script setup lang="ts">
import type { Dependency, DependencyWithName, Packages } from '@@/types/packages';
import { useDebounce, useFetch } from '@vueuse/core';
import Button from 'primevue/button';
import Card from 'primevue/card';
import DataView from 'primevue/dataview';
import Skeleton from 'primevue/skeleton';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';
import { onMounted, reactive, ref, watch } from 'vue';
import VueMarkdown from 'vue-markdown-render';
import { RouterLink } from 'vue-router';

const showDisclaimer = ref(false);
const showDisclaimerThrottle = useDebounce(showDisclaimer, 1000);

const disclaimerUrl = new URL('@/generated/disclaimer.txt', import.meta.url);
const disclaimer = useFetch<string>(disclaimerUrl.href, { immediate: false });

const allPackagesPerProject = reactive<{
    [project: string]: DependencyWithName[];
}>({
    Safelight: [],
    Darkroom: [],
    Timeline: [],
    Workspace: []
});

watch(showDisclaimerThrottle, async () => {
    if (!disclaimer.data.value) {
        disclaimer.execute();
    }
});

onMounted(() => {
    fetch(new URL('@/generated/packages-workspace.json', import.meta.url))
        .then((r) => r.json())
        .then((packages: Packages) => {
            allPackagesPerProject['Workspace'] = [
                ...convertDepsToDepsWithNames(packages.dependencies),
                ...convertDepsToDepsWithNames(packages.devDependencies, true)
            ];
        });
    fetch(new URL('@/generated/packages-darkroom.json', import.meta.url))
        .then((r) => r.json())
        .then((packages: Packages) => {
            allPackagesPerProject['Darkroom'] = [
                ...convertDepsToDepsWithNames(packages.dependencies),
                ...convertDepsToDepsWithNames(packages.devDependencies, true),
                ...convertDepsToDepsWithNames(packages.optionalDependencies, true)
            ];
        });
    fetch(new URL('@/generated/packages-safelight.json', import.meta.url))
        .then((r) => r.json())
        .then((packages: Packages) => {
            allPackagesPerProject['Safelight'] = [
                ...convertDepsToDepsWithNames(packages.dependencies),
                ...convertDepsToDepsWithNames(packages.devDependencies, true)
            ];
        });
    fetch(new URL('@/generated/packages-timeline.json', import.meta.url))
        .then((r) => r.json())
        .then((packages: Packages) => {
            allPackagesPerProject['Timeline'] = [
                ...convertDepsToDepsWithNames(packages.dependencies),
                ...convertDepsToDepsWithNames(packages.devDependencies, true)
            ];
        });
    fetch(new URL('@/generated/packages-tswebm.json', import.meta.url))
        .then((r) => r.json())
        .then((packages: Packages) => {
            allPackagesPerProject['tswebm'] = [
                ...convertDepsToDepsWithNames(packages.dependencies),
                ...convertDepsToDepsWithNames(packages.devDependencies, true)
            ];
        });
    fetch(new URL('@/generated/packages-daguerreo.json', import.meta.url))
        .then((r) => r.json())
        .then((packages: Packages) => {
            allPackagesPerProject['daguerreo'] = [
                ...convertDepsToDepsWithNames(packages.dependencies),
                ...convertDepsToDepsWithNames(packages.devDependencies, true)
            ];
        });
});

function openUrl(link: string) {
    window.open(link, '_blank');
}

function convertDepsToDepsWithNames(
    deps?: { [key: string]: Dependency },
    isDev = false
): DependencyWithName[] {
    if (!deps) {
        return [];
    }
    // Add isDev flag, then sort by name, and remove workspace packages
    return Object.entries(deps)
        .map((dep) => ({ ...dep[1], name: dep[0], isDev }))
        .sort((a, b) =>
            a.from.localeCompare(b.from, undefined, {
                ignorePunctuation: true,
                sensitivity: 'base'
            })
        )
        .filter((dep) => !dep.name.includes('safelight'));
}
</script>
