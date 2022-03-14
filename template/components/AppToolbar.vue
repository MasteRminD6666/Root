<template>
  <v-app-bar
    color="primary"
    fixed
    dark
    app
  >
    <v-toolbar-title class="ml-0 pl-3">
      <v-app-bar-nav-icon @click.stop="toggleDrawer()"></v-app-bar-nav-icon>
    </v-toolbar-title>

    <v-text-field
      text
      solo-inverted
       prepend-inner-icon="mdi-magnify"
      label="Search"
      class="mt-5"
      dense
    >
    </v-text-field>
    <v-spacer></v-spacer>
  
    <v-btn icon @click="handleFullScreen()">
      <v-icon>fullscreen</v-icon>
    </v-btn>
    


     <AppBell/>

    <!-- //App Bell -->

<!-- use v-slot here -->
    <v-menu offset-y origin="center center" :nudge-right="140" :nudge-bottom="10" transition="scale-transition">
      <template v-slot:activator="{ on }">
      <v-btn icon large text v-on="on">
        <v-avatar size="30px">
          <img src="https://cdn-icons-png.flaticon.com/512/1912/1912304.png" alt="Michael Wang"/>
        </v-avatar>
      </v-btn>
      </template>
      <v-list class="pa-0">
        <v-list-item v-for="(item,index) in items" :to="!item.href ? { name: item.name } : null" :href="item.href"
                     @click="item.click" ripple="ripple" :disabled="item.disabled" :target="item.target" rel="noopener"
                     :key="index">
          <v-list-item-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
  import Util from '@/util';
  import AppBell from './AppBell.vue'
  export default {
    name: 'app-toolbar',
    components: {
      AppBell,
    },
    data:  function () {
      return {
        items: [
          {
            icon: 'account_circle',
            href: '#',
            title: 'Profile',
            click: (e) => {
              console.log(e);
            }
          },
          {
            icon: 'settings',
            href: '#',
            title: 'Settings',
            click: (e) => {
              console.log(e);
            }
          },
          {
            icon: 'mdi-logout',
            href: '#',
            title: 'Logout',
            click: this.handleLogout
          }
        ],
      }
    },
    computed: {
      toolbarColor() {
        return this.$vuetify.options.extra.mainNav;
      }
    },
    methods: {
      toggleDrawer() {
        this.$store.commit('toggleDrawer')
      },
      handleFullScreen() {
        Util.toggleFullScreen();
      },
      handleLogout() {
        this.$router.push('/login');
      }
    }
  };
</script>
