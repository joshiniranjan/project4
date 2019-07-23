/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load('particles-js', '../particles.json', function() {
  console.log('callback - particles.js config loaded');
});
particlesJS.load('particles-js1', '../particles.json', function() {
  console.log('callback - particles.js config loaded');
});
/* -----------------------------------------------
/* How to use? : Check the GitHub README
/* ----------------------------------------------- */

/* To load a config file (particles.json) you need to host this demo (MAMP/WAMP/local)... */

particlesJS.load('particles-js', 'particles.json', function() {
  console.log('particles.js loaded - callback');
});
particlesJS.load('particles-js1', 'particles.json', function() {
  console.log('particles.js loaded - callback');
});
