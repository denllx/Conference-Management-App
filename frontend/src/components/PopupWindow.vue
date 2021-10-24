<template>
  <q-dialog
    :value="value"
    @input="val => $emit('input', val)"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="bg-primary text-white" style="width: 300px">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>
      <q-card-section class="q-pt-none">{{ content }}</q-card-section>
      <q-card-actions align="right" @click="val => $emit('ok')" class="bg-white text-primary">
        <q-btn flat label="OK" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  watch: {
    value: function(newval, oldval) {
      console.log("value changed", oldval, newval);
    }
  },
  mounted() {
    console.log("window created");
  }
};
</script>
