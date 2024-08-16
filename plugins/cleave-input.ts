import { h } from 'vue';
import Cleave from 'cleave.js';
import 'cleave.js/dist/addons/cleave-phone.kr';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('CleaveInput', {
    props: {
      modelValue: {
        default: null,
        required: true,
        validator(value) {
          return value === null || typeof value === 'string' || value instanceof String || typeof value === 'number';
        },
      },
      // https://github.com/nosir/cleave.js/blob/master/doc/options.md
      options: {
        type: Object,
        default: () => ({}),
      },
      // Set this prop as `false` to emit masked value
      raw: {
        type: Boolean,
        default: true,
      },
      placeholder: {
        type: String,
      },
      disabled: {
        type: Boolean,
        default() {
          return false;
        },
      },
      readonly: {
        type: Boolean,
        default() {
          return false;
        },
      },
    },
    data() {
      return {
        // cleave.js instance
        cleave: null,
        // callback backup
        onValueChangedFn: null,
      };
    },
    watch: {
      /**
       * Watch for any changes in options and redraw
       *
       * @param newOptions Object
       */
      options: {
        handler(newOptions) {
          this.cleave.destroy();
          this.cleave = new Cleave(this.$refs.root, this.getOptions(newOptions));
          this.cleave.setRawValue(this.modelValue);
        },
        deep: true,
      },

      /**
       * Watch for changes from parent component and notify cleave instance
       *
       * @param newValue
       */
      modelValue: {
        handler(newValue) {
          /* istanbul ignore if */
          if (!this.cleave) return;

          // when v-model is not masked (raw)
          if (this.raw && newValue === this.cleave.getRawValue()) return;
          //  when v-model is masked (NOT raw)
          if (!this.raw && newValue === this.$refs.root.value) return;
          // Lastly set newValue
          this.cleave.setRawValue(newValue);
        },
        immediate: true,
      },
    },
    mounted() {
      /* istanbul ignore if */
      if (this.cleave) return;

      this.cleave = new Cleave(this.$refs.root, this.getOptions(this.options));
      this.cleave.setRawValue(this.modelValue);
    },
    /**
     * Free up memory
     */
    beforeUnmount() {
      /* istanbul ignore if */
      if (!this.cleave) return;

      this.cleave.destroy();
      this.cleave = null;
      this.onValueChangedFn = null;
    },
    methods: {
      /**
       * Inject our method in config options
       *
       * @param options Object
       */
      getOptions(options) {
        // Preserve original callback
        this.onValueChangedFn = options.onValueChanged;

        return Object.assign({}, options, {
          onValueChanged: this.onValueChanged,
        });
      },
      /**
       * Watch for value changed by cleave and notify parent component
       *
       * @param event
       */
      onValueChanged(event) {
        const value = this.raw ? event.target.rawValue : event.target.value;
        if ((value || '') !== (this.modelValue || '')) {
          this.$emit('changeValue', value);
          // Call original callback method
          if (typeof this.onValueChangedFn === 'function') {
            this.onValueChangedFn.call(this, event);
          }
        }
      },
    },
    render() {
      const placeholder = this.placeholder;
      const disabled = this.disabled;
      const readonly = this.readonly;
      return h('input', {
        ref: 'root',
        placeholder,
        disabled,
        readonly,
      });
    },
  });
});
