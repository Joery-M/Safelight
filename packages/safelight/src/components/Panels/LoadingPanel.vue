<template>
    <div class="grid size-full place-content-center">
        <i
            id="loading"
            class="i-ph-circle-notch size-12 animate-spin"
            :aria-label="$t('general.loading')"
        />
    </div>
</template>

<style lang="scss" scoped>
// for first 150ms, don't show spinner nothing
#loading {
    @apply op-100 transition-delay-150;
    @starting-style {
        opacity: 0;
    }
}
</style>
