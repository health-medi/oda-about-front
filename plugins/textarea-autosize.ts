import { h } from 'vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('TextareaAutosize', {
    props: {
      modelValue: {
        type: String,
      },
      disabled: {
        type: Boolean,
      },
      readonly: {
        type: Boolean,
      },
      maxHeight: {
        type: Number,
      },
    },
    data() {
      return {
        localValue: this.modelValue,
      };
    },
    methods: {
      resize() {
        const orgSize = this.$el.style.height;
        this.$el.style.height = 'auto';
        const size = this.$el.scrollHeight + 9;
        if (!this.maxHeight || this.maxHeight >= size) {
          this.$el.style.height = `${size}px`;
        } else {
          this.$el.style.height = orgSize;
        }
      },
      addEventListener() {
        this.$el.addEventListener('input', this.resize);
      },
      removeEventListener() {
        this.$el.removeEventListener('input', this.resize);
      },
    },
    watch: {
      modelValue(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.localValue = newVal;
        }
      },
    },
    mounted() {
      this.addEventListener();
      setTimeout(() => {
        this.resize();
      });
    },
    deactivated() {
      this.removeEventListener();
    },
    render() {
      return h('textarea', {
        value: this.localValue,
        style: 'resize: none;',
        disabled: this.disabled,
        readonly: this.readonly,
        onInput: (e) => {
          this.localValue = e.target.value;
          this.$emit('update:modelValue', this.localValue);
        },
      });
    },
  });
});
