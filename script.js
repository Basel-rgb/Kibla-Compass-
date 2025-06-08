
let qiblaAngle = 0;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    qiblaAngle = calculateQiblaDirection(lat, lon);
    document.getElementById("angle-display").innerText = "Qibla-Winkel: " + qiblaAngle.toFixed(2) + "°";
  });
} else {
  alert("Geolocation wird nicht unterstützt.");
}

function initOrientation() {
  const permissionPopup = document.getElementById("motion-permission");

  if (typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function") {
    permissionPopup.style.display = "flex";

    document.getElementById("enable-motion").addEventListener("click", () => {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", rotateNeedle, true);
            permissionPopup.style.display = "none";
          } else {
            alert("Zugriff auf Bewegungssensor abgelehnt.");
          }
        }).catch(console.error);
    });
  } else {
    window.addEventListener("deviceorientation", rotateNeedle, true);
  }
}

function rotateNeedle(event) {
  let alpha = event.alpha || 0;
  let direction = event.webkitCompassHeading || (360 - alpha);
  let needle = document.getElementById("needle");
  let diff = Math.abs(direction - qiblaAngle);

 if (diff < 10 || diff > 350) {
  needle.src = "nadel-gruen.png";
  needle.style.width = "120px"; // ✅ größere grüne Nadel
  if (navigator.vibrate) navigator.vibrate(100);
 } else {
  needle.src = "nadel.png";
  needle.style.width = "100px"; // 🔁 normale Größe für rote Nadel
 }
  const rotation = qiblaAngle - direction;
  needle.style.transform = `translate(-50%, -88%) rotate(${rotation}deg)`;
}

function calculateQiblaDirection(lat, lon) {
  const kaabaLat = 21.4225;
  const kaabaLon = 39.8262;
  const dLon = (kaabaLon - lon) * Math.PI / 180;
  const lat1 = lat * Math.PI / 180;
  const lat2 = kaabaLat * Math.PI / 180;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
  const brng = Math.atan2(y, x) * 180 / Math.PI;
  return (brng + 360) % 360;
}

initOrientation();
