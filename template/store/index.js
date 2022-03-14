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
  drawer: false,
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
  getMovedSettings(state) {
    return state.movedSettings
  },
  getSettingsAlert(state) {
    return state.settingsAlert
  },
  getCheckedNotifications(state) {
    return state.checked
  },
  getNumberOfNotification(state) {
    return state.messages
  },
  getAllDeletedNotifications(state) {
    return state.deletedNotifications
  },
  getDialog(state) {
    console.log("set dilog gets clled from getters", state.dialog);

    return state.dialog;
  },
  getAllNotifications(state) {
    return state.notifications;
  },
  getNotificationBySenderId(state) {
    return state.sentNotifications;
  },
  // getMorityId: (state) =>(id)=>{
  //   return state.products.find(product => product.id == id)
  // }
  getSelectedNotification(state) {
    return state.selectedNotification;
  },
  getFormFlag(state) {
    return state.formFlag;
  },
}
export const actions = {
  getNotifications({ commit }) {
    //hit the api here
    axios.get("http://localhost:3500/notifications").then((notification) => {
      commit("setNotifications", notification.data);
    });
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
  getNotificationDetails({ commit }, notificationDetail) {
    console.log("ana", notificationDetail);
    commit("setSelectedNotification", notificationDetail);
  },
  getAllDeletedNotifications({ commit }) {
    console.log("getAllDeletedNotifications fired");
    // get the sender id from CAIM 
    axios.post("http://localhost:3500/notifications/deleted", { sender_id: 3 }).then((notifications) => {
      commit("SetDeletedNotifications", notifications.data);
    });
  },
  async deleteNotification({ commit }, id) {
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
  getNotificationBySenderId({ commit }) {
    // get the user id from CAIM
    axios
      .get("http://localhost:3500/notifications/senders/3")
      .then((notification) => {
        commit("setSentNotifications", notification.data);
        console.log("get notifcaiton by id ", notification.data);
      });
  },
  async setFlag({ commit }, id) {
    await axios.put(`http://localhost:3500/notifications/updateFlag/${id}`);
    commit("updateFlag", id);
  },
  setNotification({ commit }, notifications) {
    commit("setNotifications", notifications);
  },
  setSingleNotification({ commit }, notifications) {
    console.log("sat single notification");

    commit("mutateSingleNotification", notifications);
  },
  setFormFlag({ commit }) {
    commit("mutateFormFlag");
  },
}

export const mutations = {
  toggleDrawer(state) {
    state.drawer = !state.drawer
  },
  drawer(state, val) {
    state.drawer = val
  },
  storeMovedSettings(state,payload){
    
    state.movedSettings = [payload,...state.movedSettings];
      },
      showSettingsAlert(state) {
        state.settingsAlert = true
      },
      updateSelected(state, payload) {
        console.log("reaced m here is the payload ???????????????????", payload);
        state.checked = [...state.checked, payload];
      },
      restChecked(state) {
        state.checked = []
      },
      setNotificationCounter(state) {
        state.messages += 1
      },
      updateNotificationCounter(state) {
        state.messages = 0
      },
      SetDeletedNotifications(state, deletedNotification) {
        state.deletedNotifications = deletedNotification
      },
      setNotifications(state, notificationData) {
        state.notifications = sortByDateKey(notificationData, "createdAt");
      },
      setSentNotifications(state, notificationData) {
        state.sentNotifications = notificationData;
      },
      setDialog(state) {
        state.dialog = true;
        console.log("set dilog gets clled", state.dialog);
      },
      mutateFormFlag(state) {
        state.showForm = !state.showForm;
      },
      mutateSingleNotification(state, notificationData) {
        const notifications = [notificationData, ...state.notifications];
        state.notifications = sortByDateKey(notifications, "createdAt");
      },
      setSelectedNotification(state, singleNotification) {
        state.selectedNotification = singleNotification;
      },
      removeNotification(state, _id) {
        console.log("here is the type", typeof _id);
        if (typeof _id == "object") {
          _id.forEach((id) => {
            state.notifications = state.notifications.filter(
              (notifications) => notifications.id !== id
            );
          })
        } else {
          state.notifications = state.notifications.filter(
            (notifications) => notifications.id !== _id
          );
        }
    
    
      },
      updateFlag(state, _id) {
        state.notifications = state.notifications.filter(
          (notifications) => notifications.id !== _id
        );
      },
  

  
}

