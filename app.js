async function loadPrayerTimes() {
    if (!navigator.geolocation) {
        alert("Browser tidak mendukung GPS.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        // Tampilkan koordinat sementara
        document.getElementById("kota").innerText =
            `📍 ${lat.toFixed(4)}, ${lon.toFixed(4)}`;

        // Ambil nama kota
        try {
            const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
            const g = await geo.json();

            const city =
                g.address.city ||
                g.address.town ||
                g.address.village ||
                g.address.county ||
                "Lokasi Anda";

            document.getElementById("kota").innerText = "📍 " + city;
        } catch (e) {
            console.log(e);
        }

        // Ambil jadwal sholat
        const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=11`);
        const json = await res.json();

        const t = json.data.timings;

        document.getElementById("fajr").textContent = t.Fajr;
        document.getElementById("sunrise").textContent =
    t.Sunrise || t.SunriseTime || "-";
        document.getElementById("dhuhr").textContent = t.Dhuhr;
        document.getElementById("asr").textContent = t.Asr;
        document.getElementById("maghrib").textContent = t.Maghrib;
        document.getElementById("isha").textContent = t.Isha;

const masehi = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});

const hijri = json.data.date.hijri;

document.getElementById("tanggal").innerHTML =
    `${masehi}<br>${hijri.day} ${hijri.month.en} ${hijri.year} H`;
        startCountdown(t);

        }, (err) => {
        alert("Gagal mendapatkan lokasi: " + err.message);
    }, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
    });
}

function startCountdown(t) {

    // schedulePrayerNotifications(t);

        const now = new Date();

        const list = [
            ["Subuh", t.Fajr],
            ["Zuhur", t.Dhuhr],
            ["Asar", t.Asr],
            ["Magrib", t.Maghrib],
            ["Isya", t.Isha]
        ];

        let next = null;

        for (const item of list) {

            const [h, m] = item[1].split(":");

            const d = new Date();

            d.setHours(Number(h), Number(m), 0, 0);

            if (d > now) {
                next = {
                    name: item[0],
                    time: d
                };
                break;
            }
        }

        if (!next) {
            const [h, m] = list[0][1].split(":");
            const d = new Date();
            d.setDate(d.getDate() + 1);
            d.setHours(Number(h), Number(m), 0, 0);

            next = {
                name: "Subuh",
                time: d
            };
        }

        const diff = next.time - now;

        const hh = Math.floor(diff / 3600000);
        const mm = Math.floor((diff % 3600000) / 60000);
        const ss = Math.floor((diff % 60000) / 1000);

        document.getElementById("nextPrayer").textContent =
            "🕌 " + next.name;

        document.getElementById("countdown").textContent =
            `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

    }

    tick();

    setInterval(tick, 1000);
}

// initNotifications();
loadPrayerTimes();

async function getQiblaDirection() {
    if (!navigator.geolocation) {
        alert("GPS tidak tersedia");
        return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const kaabaLat = 21.4225;
        const kaabaLon = 39.8262;

        const toRad = (deg) => deg * (Math.PI / 180);
        const toDeg = (rad) => rad * (180 / Math.PI);

        const dLon = toRad(kaabaLon - lon);

        const y = Math.sin(dLon);
        const x =
            Math.cos(toRad(lat)) *
            Math.tan(toRad(kaabaLat)) -
            Math.sin(toRad(lat)) *
            Math.cos(dLon);

        let brng = toDeg(Math.atan2(y, x));
        brng = (brng + 360) % 360;

        document.getElementById("qibla").innerText =
            "🧭 Arah Kiblat: " + brng.toFixed(2) + "° dari utara";
    });
}
