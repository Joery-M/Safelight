<template>
    <div class="list">
        <h3 v-if="title">{{ title }}</h3>
        <slot v-else name="title" />

        <div class="list-header">
            <input v-if="search" v-model="searchText" type="text" class="text-black" />
        </div>

        <div
            class="list-body"
            :class="{
                'list-scrollable': scrollable
            }"
        >
            <!-- <template v-if="search"> -->
            <template v-for="item in itemsFiltered">
                <slot :item="item" />
            </template>
            <!-- </template>
            <template v-else>
                <template v-for="item in items">
                    <slot :item="item" />
                </template>
            </template> -->
        </div>
    </div>
</template>

<script lang="ts" setup generic="T = any">
const props = defineProps<{
    title?: string;
    items?: T[];
    search?: boolean;
    scrollable?: boolean;
    searchKey?: keyof T;
}>();

defineSlots<{
    title(): any;
    default(props: { item: T }): any;
}>();

const searchText = ref('');

const itemsFiltered = ref<T[]>();

function updateFiltered() {
    itemsFiltered.value = props.items?.filter((elem) => {
        if (!props.searchKey) {
            if (typeof elem === typeof '') {
                return (elem as string).toLowerCase().includes(searchText.value.toLowerCase());
            }
        } else {
            const val = elem[props.searchKey];
            if (typeof val === typeof '') {
                return (val as string).toLowerCase().includes(searchText.value.toLowerCase());
            }
        }
        return true;
    });
}
watch(props, updateFiltered);
watch(searchText, updateFiltered);
onMounted(updateFiltered);
</script>

<style lang="scss" scoped>
.list-body {
    &.list-scrollable {
        @apply max-h-96 overflow-y-scroll;
    }
}
</style>
