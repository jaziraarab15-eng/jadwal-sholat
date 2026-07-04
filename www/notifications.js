async function initNotifications() {
  if (!window.Capacitor) return;

  try {
    const perm = await Capacitor.Plugins.LocalNotifications.requestPermissions();

    if (perm.display === "granted") {
      console.log("🔔 Permission granted");
    } else {
      console.log("❌ Permission denied");
    }
  } catch (e) {
    console.log("Notif error:", e);
  }
}

async function schedulePrayerNotifications(t) {
  const notifs = Capacitor.Plugins.LocalNotifications;

  const prayers = [
    { name: "Subuh", time: t.Fajr },
    { name: "Zuhur", time: t.Dhuhr },
    { name: "Asar", time: t.Asr },
    { name: "Magrib", time: t.Maghrib },
    { name: "Isya", time: t.Isha }
  ];

  let id = 1;

  for (const p of prayers) {
    const [h, m] = p.time.split(":");

    const now = new Date();
    const scheduleTime = new Date();
    scheduleTime.setHours(+h, +m, 0, 0);

    if (scheduleTime < now) continue;

    await notifs.schedule({
      notifications: [
        {
          id: id++,
          title: "🕌 Waktu Sholat",
          body: `Saatnya sholat ${p.name}`,
          schedule: { at: scheduleTime },
          sound: "default"
        }
      ]
    });
  }

  console.log("✅ Jadwal notifikasi aktif");
}
