import { Directive } from 'vue'
// Inspired by https://github.com/Inndy/vue-clipboard2
import Clipboard from 'clipboard'

if (!Clipboard) {
  throw new Error('you should npm install `clipboard` --save at first ')
}

export default {
  beforeMount(el, binding) {
    if (binding.arg === 'success') {
      el._v_clipboard_success = binding.value
    } else if (binding.arg === 'error') {
      el._v_clipboard_error = binding.value
    } else {
      const clipboard = new Clipboard(el, {
        text() {
          return binding.value
        },
        action() {
          return binding.arg === 'copy' ? 'cut' : 'copy'
        }
      })
      clipboard.on('success', e => {
        const callback = el._v_clipboard_success
        callback?.(e)
      })
      clipboard.on('error', e => {
        const callback = el._v_clipboard_error
        callback?.(e)
      })
      el._v_clipboard = clipboard
    }
  },
  updated(el, binding) {
    if (binding.arg === 'success') {
      el._v_clipboard_success = binding.value
    } else if (binding.arg === 'error') {
      el._v_clipboard_error = binding.value
    } else if (el._v_clipboard) {
      el._v_clipboard.text = function () {
        return binding.value
      }
      el._v_clipboard.action = function () {
        return binding.arg === 'copy' ? 'cut' : 'copy'
      }
    }
  },
  unmounted(el, binding) {
    if (binding.arg === 'success') {
      delete el._v_clipboard_success
    } else if (binding.arg === 'error') {
      delete el._v_clipboard_error
    } else {
      el._v_clipboard.destroy()
      delete el._v_clipboard
    }
  }
} as Directive
