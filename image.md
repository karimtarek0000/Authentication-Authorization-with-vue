<template>
  <!-- Placeholder image -->
  <div class="relative">
    <img
      v-if="!isVisible"
      :src="blurSrc"
      :alt="alt"
      loading="lazy"
      class="absolute inset-0 z-50 object-cover w-full h-full transition scale-105 blur-sm"
    />
    <!-- Original image -->
    <img
      ref="imageRef"
      :srcset="generateSrcset()"
      :sizes="sizes"
      :alt="alt"
      loading="lazy"
      width="100%"
      height="100%"
      class="relative object-fill object-center w-full h-auto max-w-full transition-opacity duration-500"
      :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue';

  // Types
  interface Props {
    src: string;
    alt: string;
    cloudName?: string;
    breakpoints?: number[];
    quality?: number | string;
    sizes?: string;
    format?: string;
  }

  // Props
  const props = withDefaults(defineProps<Props>(), {
    cloudName: 'dafgi7p8c',
    breakpoints: () => [600, 768, 1024, 1280],
    quality: 'auto',
    sizes: '(max-width: 600px) 50vw, (max-width: 768px) 70vw, (max-width: 1024px) 80vw, 100vw',
    format: 'webp',
  });

  // State
  const isVisible = ref<boolean>(false);
  const imageRef = ref<HTMLImageElement>();
  let observer: IntersectionObserver | null = null;

  // Computed
  const baseUrl = computed(() => `https://res.cloudinary.com/${props.cloudName}/image/fetch`);
  const blurSrc = computed(() => `${baseUrl.value}/f_webp,e_blur:2000,q_10,w_300/${props.src}`);

  // Functions
  const getCloudinaryUrl = (width: number): string =>
    `${baseUrl.value}/q_${props.quality},f_${props.format},w_${width}/${props.src}`;

  const generateSrcset = (): string =>
    props.breakpoints.map((bp) => `${getCloudinaryUrl(bp)} ${bp}w`).join(', ');

  const handleIntersection = (entries: IntersectionObserverEntry[]): void => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer?.unobserve(entry.target);
      }
    });
  };

  // Lifecycle hooks
  onMounted(() => {
    const element = imageRef.value;
    if (!element) return;

    observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.8,
      rootMargin: '',
    });

    observer.observe(element);
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  });
</script>
