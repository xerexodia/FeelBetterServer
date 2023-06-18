const getRandom = (len) => {
  const randomIndex = Math.floor(Math.random() * len.length);
  return randomIndex;
};

function subtractSeconds(date, seconds) {
  date.setSeconds(date.getSeconds() - seconds);

  return date;
}
// Vérifie si l'humeur spécifiée existe dans les défis
module.exports = { getRandom, subtractSeconds };
