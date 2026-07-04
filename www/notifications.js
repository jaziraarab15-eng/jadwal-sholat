async function initNotifications() {
  if (!window.Capacitor) {
    console.log("Bukan aplikasi Android");
    return;
  }

  const { LocalNotifications } = Capacitor.Plugins;

  try {
    const permission = await LocalNotifications.requestPermissions();

    if (permission.display === "granted") {
      console.log("✅ Izin notifikasi diberikan");
    } else {
      console.log("❌ Izin notifikasi ditolak");
    }
  } catch (e) {
    console.error(e);
  }
}
