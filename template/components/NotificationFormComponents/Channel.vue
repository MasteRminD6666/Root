<template>
  <div>
    <v-select
      v-model="selectedChannel"
      :items="channels"
      attach
      label="Channel type"
      multiple
      solo
      dense
      @change="OnClickChannel(selectedChannel)"
    >

    </v-select>
  </div>
</template>

<script>
export default {
  name: "Channels",
  mounted() {
    this.channelsCopy = [...this.channels];
  },

  data: () => ({
    selectedChannel: [],
    searchTerm: "",
    channels:[
      "Web",
      "Sms",
    ],
    channelsCopy: [],
  }),
  methods: {
  OnClickChannel() {

      this.$emit("selectedChannel", this.selectedChannel);
    },
   
  },
  computed: {
  
  }
};
</script>

<style lang="scss" scoped></style>
