import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  setup() {
    return () => (
      <div class="p-6">
        <h2 class="text-lg font-medium">Home</h2>
        <p class="mt-3 text-red-500" >这是首页。</p>
      </div>
    );
  },
});
