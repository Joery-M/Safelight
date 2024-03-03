<template>
    <SLButton to="/dev">
        <PhArrowLeft />
    </SLButton>
    <SLCard id="card" title="Thanks to these amazing open-source project">
        <template v-if="!showDisclaimer">
            <div
                v-for="(dep, title) in { ...packages.dependencies, ...packages.devDependencies }"
                :key="title"
            >
                <h4>{{ title }}</h4>
                <h5 v-if="dep.author">{{ dep.author.name }}</h5>
                <div>
                    <a v-if="dep.homepage" :href="dep.homepage" target="_blank">
                        <PhLink style="display: inline" size="20" />
                    </a>
                    <a
                        v-if="dep.repository"
                        :href="dep.repository.replace('git+', '')"
                        target="_blank"
                    >
                        <PhGitBranch style="display: inline" size="20" />
                    </a>
                    <p>
                        <PhScroll style="display: inline" size="20" />
                    </p>
                </div>
            </div>
        </template>
        <div v-else id="disclaimer">
            <p v-if="disclaimer.data" class="whitespace-break-spaces">
                {{ disclaimer.data.value }}
            </p>
        </div>

        <template #actions>
            <SLButton v-if="!showDisclaimer" @click="showDisclaimer = true">
                Show disclaimer
            </SLButton>
            <SLButton v-else @click="showDisclaimer = false"> Show packages </SLButton>
        </template>
    </SLCard>
</template>

<script setup lang="ts">
import packages from '@/generated/packages.json';
import { PhArrowLeft, PhGitBranch, PhLink, PhScroll } from '@phosphor-icons/vue';

const showDisclaimer = ref(false);

const disclaimerUrl = new URL('@/generated/disclaimer.txt', import.meta.url);
const disclaimer = useFetch<string>(disclaimerUrl.href, { immediate: false });

watch(showDisclaimer, async () => {
    if (!disclaimer.data.value) {
        disclaimer.execute();
    }
});
</script>

<style lang="scss">
#card {
    @apply max-w-4xl;

    .card-content {
        @apply flex flex-wrap overflow-y-scroll;
        height: 500px;

        > div:not(#disclaimer) {
            @apply flex h-36 basis-1/3 flex-col justify-around border-white border-opacity-25 px-4 py-2;

            &:nth-child(3n + 2) {
                @apply border-x-2;
            }

            &:not(:nth-of-type(1), :nth-of-type(2), :nth-of-type(3)) {
                @apply border-t-2;
            }

            p {
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
            }
            h4 {
                @apply text-center font-bold;
            }
            h5 {
                @apply text-center;
            }

            div {
                @apply flex justify-between;
            }
        }
    }
}
</style>
