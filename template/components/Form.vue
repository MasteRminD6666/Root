<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="1000px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          class="mr-4"
          small
          light
          fab
          @click="clear"
        >
          <v-icon color="info" dense> mdi-plus </v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-toolbar dark color="anchor">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Notification Management</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="clear"> Clear </v-btn>
            <v-btn dark text @click="submit"> Send </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <form>
          <v-container fluid>
            <v-icon>mdi-bell-plus</v-icon>
            <h1>Create a new notification</h1>

            <v-row class="mb-6" no-gutters>
              <v-col sm="5" offset-sm="2" md="6" offset-md="0" width="50%">
                <v-text-field
                  dense
                  v-model="notificationSubject"
                  :error-messages="notificationSubjectErrors"
                  :counter="30"
                  solo
                  label="Notification title"
                  required
                  @input="$v.notificationSubject.$touch()"
                  @blur="$v.notificationSubject.$touch()"
                ></v-text-field>
              </v-col>
              <v-col sm="6" offset-sm="2" md="6" offset-md="0">
                <Channel @selectedChannel="selectedChannelValue"></Channel>
              </v-col>

              <v-col sm="5" offset-sm="3" md="6" offset-md="0">
                <v-file-input
                  label="Upload image"
                  filled
                  solo
                  dense
                  prepend-inner-icon="mdi-camera"
                  prepend-icon=""
                ></v-file-input>
              </v-col>

              <v-col sm="6" offset-sm="2" md="6" offset-md="0">
                <Recipients
                  @selectedRecipients="selectedRecipientsValue"
                ></Recipients>
              </v-col>
              <v-col sm="6" offset-sm="2" md="6" offset-md="0">
                <div v-if="selectedType === 'Schedular'">
                  <v-card>
                    <v-banner shaped icon="mdi-calendar-today"
                      >From
                      <datetime
                        type="datetime"
                        v-model="fromDate"
                        value-zone="America/New_York"
                        zone="Asia/Shanghai"
                        :format="{
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          timeZoneName: 'short',
                        }"
                        :phrases="{ ok: 'Continue', cancel: 'Exit' }"
                        :hour-step="1"
                        :minute-step="1"
                        :min-datetime="minDatetime"
                        :max-datetime="maxDatetime"
                        :week-start="7"
                        use12-hour
                        auto
                      ></datetime>
                    </v-banner>
                    <v-banner shaped icon="mdi-calendar  ">
                      To
                      <datetime
                        class="theme-orange"
                        type="datetime"
                        v-model="toDate"
                        input-class="theme-orange"
                        value-zone="America/New_York"
                        zone="Asia/Shanghai"
                        :format="{
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          timeZoneName: 'short',
                        }"
                        :phrases="{ ok: 'Continue', cancel: 'Exit' }"
                        :hour-step="1"
                        :minute-step="1"
                        :min-datetime="fromDate"
                        :week-start="7"
                        use12-hour
                        auto
                      ></datetime>
                    </v-banner>
                  </v-card>
                </div>
              </v-col>

              <!-- CALENDER HERE -->

              <v-col sm="6" offset-sm="2" md="6" offset-md="0"> </v-col>
              <v-col sm="6" offset-sm="2" md="6" offset-md="0">
                <v-radio-group v-model="selectedType" row>
                  <template v-slot:label>
                    <div>Select <strong>Notification type</strong></div>
                  </template>
                  <v-radio label="Instant" value="Instant">
                    <template v-slot:label>
                      <strong class="success--text">Instant</strong>
                    </template>
                  </v-radio>
                  <v-radio label="Schedular" value="Schedular">
                    <template v-slot:label>
                      <strong class="success--text">Schedular</strong>
                    </template>
                  </v-radio>
                </v-radio-group>
                <v-radio-group v-model="selectedStatus" row>
                  <template v-slot:label>
                    <div>Select <strong>Notification status</strong></div>
                  </template>
                  <v-radio label="Soft" value="Soft">
                    <template v-slot:label>
                      <strong class="success--text">Soft</strong>
                    </template>
                  </v-radio>
                  <v-radio label="Firm" value="Firm">
                    <template v-slot:label>
                      <strong class="success--text">Firm</strong>
                    </template>
                  </v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-textarea
              counter
              solo
              label="Notification description "
              :rules="rules"
              :value="value"
              v-model="description"
              placeholder="Type your message here"
              prepend-inner-icon="mdi-comment"
              style="width: 100%"
            ></v-textarea>
          </v-container>
        </form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import Recipients from "../components/NotificationFormComponents/Recipients.vue";
import Channel from "./NotificationFormComponents/Channel.vue";
import { Datetime } from "vue-datetime";
import axios from "axios";

export default {
  name: "Form",
  mixins: [validationMixin],
  name: "NotificationForm",
  components: {
    Recipients,
    Channel,
    datetime: Datetime,
  },
  validations: {
    notificationSubject: { required, maxLength: maxLength(30) },
    select: { required },
    checkbox: {
      checked(val) {
        return val;
      },
    },
  },

  data() {
    return {
      fromFlag: false,
      toFlag: false,
      showDatetime: false,
      fromDate: "",
      toDate: "",
      maxDatetime: "",
      minDatetime: new Date().toISOString().substr(0, 10),
      createNotification: [],
      rules: [(v) => v.length <= 255 || "Max 255 characters"],
      value: "",
      description: "",
      selectedChannel: null,
      selectedStatus: null,
      selectedRecipients: null,
      selectedType: null,
      channels: ["Sms", "Web"],
      status: ["Firm", "Soft"],
      notificationSubject: "",
      items: ["Instant", "Schedular"],
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
    };
  },

  computed: {
    checkboxErrors() {
      const errors = [];
      if (!this.$v.checkbox.$dirty) return errors;
      !this.$v.checkbox.checked && errors.push("You must agree to continue!");
      return errors;
    },
    selectErrors() {
      const errors = [];
      if (!this.$v.select.$dirty) return errors;
      !this.$v.select.required && errors.push("Item is required");
      return errors;
    },
    notificationSubjectErrors() {
      const errors = [];
      if (!this.$v.notificationSubject.$dirty) return errors;
      !this.$v.notificationSubject.maxLength &&
        errors.push("Notification title must be at most 30 characters long");
      !this.$v.notificationSubject.required &&
        errors.push("Notification title is required.");
      return errors;
    },
  },
  methods: {
    selectedRecipientsValue(recipientsValue) {
      console.log("ss", recipientsValue);
      this.selectedRecipients = recipientsValue;
      return recipientsValue;
    },
    selectedChannelValue(value) {
      this.selectedChannel = value;
      return value;
    },
    submit() {
      this.$v.$touch();
      this.dialog = false;
      if (this.selectedType === "Schedular") {
        this.selectedType = 2;
      } else {
        this.selectedType = 1;
      }
      // this to convert array ot object
      // let object = Object.assign({}, this.selectedChannel);

      let notificationCreated = {
        notification_subject: this.notificationSubject, //true
        sender_id: 3, //true
        //
        // users: this.selectedRecipients, //true
        users: ["Agents On Cloud"],
        notification_type: this.selectedType, //false
        notification_description: this.description, //true
        notification_status: this.selectedStatus, // true
        user_image:
          "https://st2.depositphotos.com/4226061/9064/v/950/depositphotos_90647730-stock-illustration-female-doctor-avatar-icon.jpg", //true
        channels: [
          { channel_type: 1 },
          { channel_type: 2 },
          { channel_type: 3 },
        ],
        seclude_range: {
          from: this.fromDate,
          to: this.toDate,
        },
      };
      console.log("the revceived object", notificationCreated);
      this.$store.dispatch("createNotification", notificationCreated);
    },
    clear() {
      this.$v.$reset();
      this.notificationSubject = "";

      this.select = null;
      this.selectedStatus = null;
      this.description = "";
      this.selectedType = null;
    },
    setDateTimeFlag(showFlag) {
      this.showDatetime = !showFlag;
      console.log(showFlag);
    },
  },
};
</script>

<style scoped>
.theme-orange .vdatetime-popup__header,
.theme-orange .vdatetime-calendar__month__day--selected > span > span,
.theme-orange .vdatetime-calendar__month__day--selected:hover > span > span {
  background: #FF9800;
}

.theme-orange .vdatetime-year-picker__item--selected,
.theme-orange .vdatetime-time-picker__item--selected,
.theme-orange .vdatetime-popup__actions__button {
  color: #ff9800;
}
.vdatetime-input {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid rgb(243, 23, 23) !important;
  border-radius: 4px;
  box-sizing: border-box;
}
.v-btn--fab.v-size--small {
  height: 29px !important;
  width: 29px !important;
}
</style>
