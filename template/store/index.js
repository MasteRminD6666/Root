import axios from "axios";
import Swal from "sweetalert2";
const { io } = require("socket.io-client");



export const sortByDateKey = (notifications, key) =>
  notifications.sort(
    (a, b) => new Date(b[key]).getTime() - new Date(a[key]).getTime()
  );
export const sortByDateKeySenders = (sentNotifications, key) =>
  sentNotifications.sort(
    (a, b) => new Date(b[key]).getTime() - new Date(a[key]).getTime()
  );



// store here 
export const state = () => ({
  drawer: true,
  notifications: [],
  movedSettings:[],
  setNotifications: [],
  selectedNotification: [],
  showForm: false,
  dialog: false,
  sentNotifications: [],
  deletedNotifications: [],
  messages: 0,
  checked: [],
  settingsAlert: false
})

export const getters = {
  getAllNotifications(state) {
    return state.notifications;
  },
  getDialog(state) {
    console.log("set dilog gets clled from getters", state.dialog);

    return state.dialog;
  },
  getNotificationCount() {
    return this.$store.getters.getNumberOfNotification;
  },
}
export const actions = {
  getNotifications({ commit }) {
    //hit the api here
    axios.get("http://localhost:3500/notifications").then((notification) => {
      commit("setNotifications", notification.data);
    });
  },
  async setFlag({ commit }, id) {
    await axios.put(`http://localhost:3500/notifications/updateFlag/${id}`);
    commit("updateFlag", id);
  },
  
  setFormFlag({ commit }) {
    commit("mutateFormFlag");
  },
  getNotificationDetails({ commit }, notificationDetail) {
    console.log("ana", notificationDetail);
    commit("setSelectedNotification", notificationDetail);
  },
  createNotification({ commit }, notificationObject) {

    axios
      .post("http://localhost:3500/notifications/create", notificationObject)
      .then((result) => {
        Swal.fire({
          position: "centered",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        console.log("Rersult>>>>>>>>>>>>>>>>>>>>>", result.data);
      })
      .catch((err) => {
        Swal.fire({
          position: "centered",
          icon: "error",
          title: "There is an error in Creating a new notification",
          showConfirmButton: false,

          timer: 3000,
        });
        console.log("err>>>>>>>>>>>>>>>>>>>>", err);
      });
  },
   deleteNotification({ commit }, id) {
    console.log("fired", id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      confirmButtonText: "Yes, delete it!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("after confiremd", id);
        axios.put(`http://localhost:3500/notifications/delete/${id}`);
        commit("removeNotification", id);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  },
}

export const mutations = {
  toggleDrawer(state) {
    state.drawer = !state.drawer
  },
  setNotifications(state, notificationData) {
    state.notifications = sortByDateKey(notificationData, "createdAt");
  },
  drawer(state, val) {
    state.drawer = val
  },
  updateNotificationCounter(state) {
    state.messages = 0
  },
  setSelectedNotification(state, singleNotification) {
    state.selectedNotification = singleNotification;
  },
  mutateFormFlag(state) {
    state.showForm = !state.showForm;
  },
  
}

