<template>
  <div class="loading-placeholder" role="status" aria-live="polite">
    <svg class="spinner animate-spin w-12 h-12" viewBox="0 0 50 50">
      <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="3"></circle>
    </svg>
    <span class="sr-only">Loading...</span>
  </div>
</template>

<style scoped>
.loading-placeholder {
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  color: #FEB708; /* jazzy-yellow */
}

.spinner .path {
  stroke: currentColor;
  stroke-linecap: round;
}
</style> 