<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-4" style="font-size:15px;padding:20px 0;">
        {{ title }}
      </div>
      <q-input
        outlined
        :value="content"
        @input="val => $emit('input', val)"
        :type="isPwd ? 'password' : 'text'"
        class="col-8"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isPwd: true
    };
  }
};
</script>
