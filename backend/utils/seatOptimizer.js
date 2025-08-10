// Given a list of riders with origins and a set of driver rides, match riders to rides
// using simple haversine distance and greedily filling closest matching rides.

function haversine(a,b){
  const toRad = x => x * Math.PI/180;
  const R = 6371; // km
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// riders: [{id,lat,lng,preferredTime}], rides: [{id,origin:{lat,lng},seatsAvailable,date}]
function matchRidersToRides(riders, rides){
  // sort riders by preferredTime (earliest first)
  riders.sort((a,b)=> new Date(a.preferredTime) - new Date(b.preferredTime));
  // result map
  const assignments = {};
  for(const r of riders){
    // find nearest ride with seats and similar time (within 30 minutes)
    let best = null; let bestDist = Infinity;
    for(const ride of rides){
      if(ride.seatsAvailable <= 0) continue;
      const timeDiff = Math.abs(new Date(ride.date) - new Date(r.preferredTime));
      if(timeDiff > 30*60*1000) continue; // >30 minutes
      const d = haversine({lat:r.lat,lng:r.lng}, ride.origin);
      if(d < bestDist){ bestDist = d; best = ride; }
    }
    if(best){
      assignments[r.id] = best.id;
      best.seatsAvailable -= 1; // mutate local copy
    } else {
      assignments[r.id] = null; // no match
    }
  }
  return assignments;
}

module.exports = { matchRidersToRides, haversine };