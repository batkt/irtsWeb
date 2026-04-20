function setTime(ognoo, hour) {
  if (!hour) return;
  hour = hour.split(":");
  ognoo.setHours(Number(hour[0]), Number(hour[1]), 0);
}

export default setTime;
