const Menu = [
  {header: 'Main'},
  {
    title: 'Home',
    group: 'Main',
    icon: 'home',
    name: 'Dashboard',
    href: '/dashboard'
  },
  {
    title: 'Consumers',
    group: 'Main',
    icon: 'chat_bubble',
    name: 'Consumers',
    href: '/consumers'
  },
  {
    title: 'Inventory',
    group: 'Main',
    name: 'Inventory',
    // target: '_blank', target blank to open a new page with the same layout guys =)
    icon: 'email',
    href: '/Inventory/'
  },
  {
    title: 'Notification management',
    group: 'Main',
    name: 'Notification management',
    icon: 'perm_media',
    href: '/Notifications'
  },
  {
    title: 'Appointments',
    group: 'Main',
    name: 'Appointments',
    icon: 'perm_media',
    href: '/Appointments'
  },
  {
    title: 'Settings',
    group: 'settings',
    component: 'settings',
    icon: 'settings',
    items: [
      {name: 'notifications', title: 'Notifications', href: '/settings/notifications'},

    ]
  },
  {divider: true},
  {header: 'Extras'},
  {
    title: 'Login',
    group: 'extra',
    icon: 'list',
    href: '/login'
  },
  {
    title: 'Empty',
    group: 'extra',
    icon: 'insert_drive_file',
    href: '/empty'
  },
];
// reorder menu
Menu.forEach((item) => {
  if (item.items) {
    item.items.sort((x, y) => {
      let textA = x.title.toUpperCase();
      let textB = y.title.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
  }
});

export default Menu;
