async function requestNotificationPermission() {
  if (!window.Capacitor) {
    console.log("Capacitor tidak tersedia");
    return;
  }

  const { LocalNotifications } = Capacitor.Plugins;

  const permission = await LocalNotifications.requestPermissions();

  if (permission.display === "granted") {
    console.log("Izin notifikasi diberikan");
  } else {
    console.log("Izin notifikasi ditolak");
  }
}
