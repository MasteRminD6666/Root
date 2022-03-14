<template>
  <div>
    <v-list >
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        @click="notificationActions(item.title, singleNotification.id)"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
        <v-icon dense class="ml-2" :color="item.color">{{ item.icon }}</v-icon>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    selected: { type: Object },
  },

  name: "Ellipsis",
  data: () => ({
    items: [
      { title: "Reply", icon: "mdi-reply",color:"primary" },
      { title: "Forward", icon: "mdi-forward",color:"success"},
      { title: "Delete", icon: "mdi-delete",color:"error"},
      { title: "Unread", icon: "mdi-email",color:"warning"},
      { title: "Flag", icon: "mdi-flag",color:"info" },
    ],
  }),
  methods: {
    ...mapActions(["deleteNotification" , "setFlag"]),
    notificationActions(selectedAction, id) {
      // Reply and forward actions
      if (selectedAction === "Reply" || selectedAction === "Forward") {
        //  route.push({path: `/${selectedAction}`})
        console.log("selectedAction",selectedAction , id);

        this.$router.push({ path: `/NotificationActions/${selectedAction}` });
         
      } else if (selectedAction == "Delete") {
        this.deleteNotification(id);
      }
      // Delete and Unread Actions
      else if (selectedAction == "Unread") {
        console.log("unread");
      } else if (selectedAction == "Flag") {
        this.setFlag(id)
      }
    },
  },
  computed: {
    singleNotification() {
      return this.$store.state.selectedNotification;
    },
  },
};
</script>

<style  scoped>
.dots-position {
  margin-left: 42%;
}

</style>
