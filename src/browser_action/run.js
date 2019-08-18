document.addEventListener("DOMContentLoaded", () => {
  // transform emojilib into simple array of emoji data objects
  // put key name into 'name' property
  const data = Object.entries(window.emojilib).map(([name, obj]) => ({name, ...obj}));
  console.log(data);

  // bind events
  const filter = emoji.filter(data); // 2nd order fn
  document.getElementById('search').addEventListener('input', ({target}) => filter(target.value));

  // document.getElementById('results').innerHTML = emoji.htmlForAllEmoji(chars);
});