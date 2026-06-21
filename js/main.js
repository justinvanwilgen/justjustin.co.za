$(function () {

  /* ─────────────────────────────────────────
     Footer year
  ───────────────────────────────────────── */
  $('#year').text(new Date().getFullYear());


  /* ─────────────────────────────────────────
     Dynamic experience durations
     Computes "X yrs Y mos" from a data-since
     start date (YYYY-MM) up to the current
     month.
  ───────────────────────────────────────── */
  $('[data-since]').each(function () {
    var parts = $(this).data('since').toString().split('-');
    var start = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
    var now   = new Date();

    var months = (now.getFullYear() - start.getFullYear()) * 12 +
                 (now.getMonth() - start.getMonth());
    if (months < 0) { months = 0; }

    var years = Math.floor(months / 12);
    var mos   = months % 12;

    var out = [];
    if (years > 0) { out.push(years + ' yr' + (years === 1 ? '' : 's')); }
    out.push(mos + ' mo' + (mos === 1 ? '' : 's'));

    $(this).text(out.join(' '));
  });


  /* ─────────────────────────────────────────
     Typewriter animation
     Cycles through phrases with a blinking
     cursor, typing then deleting each one.
  ───────────────────────────────────────── */
  var phrases = [
    'software developer',
    'builder of things',
    'based in south africa',
    'justjustin.co.za'
  ];

  var phraseIdx = 0;
  var charIdx   = 0;
  var deleting  = false;

  function tick() {
    var phrase = phrases[phraseIdx];

    if (deleting) {
      charIdx -= 1;
      $('#typed-text').text(phrase.slice(0, charIdx));
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        return setTimeout(tick, 420);
      }
      return setTimeout(tick, 36);
    }

    charIdx += 1;
    $('#typed-text').text(phrase.slice(0, charIdx));
    if (charIdx === phrase.length) {
      deleting = true;
      return setTimeout(tick, 2400);
    }
    return setTimeout(tick, 72);
  }

  setTimeout(tick, 900);


  /* ─────────────────────────────────────────
     ASCII corner animation
     Cycles the four corner glyphs on the
     header frame through a set of characters.
  ───────────────────────────────────────── */
  var GLYPHS = ['+', 'x', '*', '#', 'o', '~', '+', 'x'];
  var glyphIdx = 0;

  setInterval(function () {
    glyphIdx = (glyphIdx + 1) % GLYPHS.length;
    $('.fc').text(GLYPHS[glyphIdx]);
  }, 520);


  /* ─────────────────────────────────────────
     Scroll-reveal for sections
     Adds .js-reveal (hides sections) then
     watches scroll to add .is-visible.
  ───────────────────────────────────────── */
  $('.section').addClass('js-reveal');

  function reveal() {
    var fold = $(window).scrollTop() + $(window).height() - 60;
    $('.js-reveal:not(.is-visible)').each(function () {
      if ($(this).offset().top < fold) {
        $(this).addClass('is-visible');
      }
    });
  }

  $(window).on('scroll.reveal', reveal);
  reveal(); /* reveal anything already in view */

});
