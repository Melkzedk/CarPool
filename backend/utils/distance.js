function haversine([lat1,lng1],[lat2,lng2]) {
  const toRad = v => v * Math.PI / 180;
  const R = 6371; // km
  const dLat = toRad(lat2-lat1), dLon = toRad(lng2-lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(a)); // km
}
module.exports = { haversine };
