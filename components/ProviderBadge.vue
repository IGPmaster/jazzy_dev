<template>
    <div v-if="provider" 
		class="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-t border-white/10 px-4 py-2">
		<div class="flex items-center justify-between">
			<span class="text-xs font-medium text-white/80">
				Provider
			</span>
			<span class="text-xs font-bold text-jazzy-yellow">
				{{ provider }}
			</span>
		</div>
	</div>
</template>