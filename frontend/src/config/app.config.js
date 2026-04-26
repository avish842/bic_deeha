const appConfig = {
  APP_NAME: "BIC DEEHA",
  VERSION: "4.2.2.0",
  DESCRIPTION: "Balbhadra Inter College, Deeha - Aided Co-educational Institution",

  CONTACT: {
    EMAIL: "b.i.c.deeha@gmail.com",
    PHONE: "+91-9005949407",
    PHONE2: "+91-9919806480",
    ADDRESS: "Deeha, Kunda, Pratapgarh, Prayagraj Division",
  },

  SOCIAL_LINKS: {
    FACEBOOK: "#",
    TWITTER: "#",
    INSTAGRAM: "#",
    YOUTUBE: "#",
  },

  NAVBAR_ITEMS: [
    { label: "Home", path: "/" },
    { label: "Notices", path: "/notices" },
    { label: "Gallery", path: "/gallery" },
    { label: "Achievements", path: "/achievements" },
    { label: "Toppers", path: "/toppers" },
    { label: "Staff", path: "/staff" },
  ],

  ADMIN_NAV_ITEMS: [
    { label: "Dashboard", path: "/admin" },
    { label: "Notices", path: "/admin/notices" },
    { label: "Gallery", path: "/admin/gallery" },
    { label: "Achievements", path: "/admin/achievements" },
    { label: "Students", path: "/admin/students" },
  ],
};

export default appConfig;
