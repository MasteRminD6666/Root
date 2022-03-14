<template>
  <v-menu
    offset-y
    origin="center center"
    :nudge-bottom="14"
    transition="scale-transition"
    class="mt-12"
    z-index="10"
  >
  
    <template v-slot:activator="{ on }">
      <v-btn icon text v-on="on" @click="restCounter">
        <v-badge
          :content="getNotificationCount"
          :value="getNotificationCount"
          color="red"
          overlap
        >
          <v-icon v-if="!getNotificationCount">mdi-bell</v-icon>
          <v-icon v-if="getNotificationCount">mdi-bell-ring</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-list class="pa-0" two-line subheader >

      <v-list-item >
        <v-subheader>Notifications</v-subheader>
        <v-spacer></v-spacer>
        <v-list-item-action>
          <Form></Form>
        </v-list-item-action>
        <v-btn to="/" class="mx-1" dense small light fab>
          <v-icon> mdi-login-variant </v-icon>
        </v-btn>
      </v-list-item>
      <v-spacer></v-spacer>
      <v-divider />
      <!--<v-divider inset/>-->
      <!--<v-subheader inset>Files</v-subheader>-->
      <v-virtual-scroll :items="notifications" height="300" item-height="70" >
        <template v-slot:default="{ item }" active-class="bg-active">
          <v-list>
      <v-list-item-group  active-class="bg-active">
          <v-list-item :key="item" avatar @click="1" min="0" max="3" > 
            <v-list-item-avatar>
              <!-- [item.iconClass] -->
              <v-avatar dense>
                <img
                  src="https://cdn.vuetifyjs.com/images/john.jpg"
                  alt="John"
                />
              </v-avatar>
            </v-list-item-avatar>

            <v-list-item-content
              @click.prevent.stop="notificationContent(item)"
            >
              <h6 default class="caption">
                {{ item.notification_subject }}
                <span class="spanDate">{{
                  notificationDate(item.createdAt)
                }}</span>
              </h6>

              <v-list-item-subtitle>
                {{ item.notification_description }}
                ...</v-list-item-subtitle
              >
            </v-list-item-content>

            <v-list-item-action>
              <v-menu transition="slide-y-transition" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    @click.prevent.stop="toggleDots(item)"
                    class="dots-position"
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-dots-vertical
                  </v-icon>
                </template>
                <Ellipsis :selected="selected"></Ellipsis>
              </v-menu>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
      </v-list-item-group>
          </v-list>
        </template>
      </v-virtual-scroll>
      <v-btn color="info" text>
        <NuxtLink style="text-decoration: none; color: inherit" to="/Received"
          >Show All</NuxtLink
        >
      </v-btn>
    </v-list>
    <v-list>
      <v-list-item-group>
        <v-list-item

        >
       tset
        </v-list-item>
</v-list-item-group>
    </v-list>
   
    <v-divider />
    

    <div v-if="getDialog">
      <NotificationDetails></NotificationDetails>
    </div>
  </v-menu>
</template>

<script>
import { mapActions } from "vuex";
import Ellipsis from "./Ellipsis.vue";
import Form from "./Form.vue";
import NotificationDetails from "./NotificationDetails.vue";
import moment from "moment";

export default {
  name: "AppBell",
  data: () => ({
    selected: "",
    showBell: false,
    messages: null,
  }),
  beforeMount() {
    // this.socket();
  },
  computed: {
    showForm() {
      this.setFormFlag();
    },
    length() {
      return 20;
    },
    notifications() {
      return this.$store.getters.getAllNotifications;
    },
    getDialog() {
      return this.$store.getters.getDialog;
    },
    getNotificationCount() {
      return this.$store.getters.getNumberOfNotification;
    },
  },
  components: {
    Ellipsis,
    Form,
    NotificationDetails,
  },
  created() {
    this.getNotifications();
  },

  methods: {
    ...mapActions(["getNotifications", "setFormFlag"]),
    restCounter() {
      this.$store.commit("updateNotificationCounter");
      this.getNotificationCount;
    },
    notificationDate(date) {
      return moment(date).fromNow();
    },
    toggleBell() {
      console.log("toogled");
      this.showBell = !this.showBell;
      this.messages = 0;
    },
    notificationContent(notificationDetails) {
      this.$store.dispatch("getNotificationDetails", notificationDetails);
      this.$router.push({ path: "Details" });
    },
    toggleDots(notificationDetails) {
      console.log(
        "here is the id>>>>>>>>>>>>>>>>>>>>>>>>> ",
        notificationDetails
      );
      this.$store.dispatch("getNotificationDetails", notificationDetails);
      return (this.selected = notificationDetails);
    },
  },
};
</script>
<style scoped>
.menuable__content__active {
  width: 400px;
}
.v-menu__content theme--light {
  z-index: 10;
  transform-origin: center center;
}
.subheader {
  z-index: 9999;
}
.v-subheader {
  background: transparent;

  font-weight: 500;
  font-size: 20px;
  /* fallback for old browsers */
  color: #181818;
}
.v-btn--fab.v-size--small {
  height: 29px !important;
  width: 29px !important;
}
.spanDate {
  color: grey;
  opacity: 0.5;
  font-size: 13px !important;
}
.notification-subject {
  font-size: 13px !important;
}
.bg-active{
   background-color: black;
  color : white !important;
}

</style>
