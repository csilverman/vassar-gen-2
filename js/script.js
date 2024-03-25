/*	not working? Check for: 

  $('.table-of-contents-section .content').append('
<div class="dynamic-toc-box">
</div>
');

Drupal is splitting that into different lines which breaks it.

*/

<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.1/noframework.waypoints.min.js" integrity="sha512-fHXRw0CXruAoINU11+hgqYvY/PcsOWzmj0QmcSOtjlJcqITbPyypc8cYpidjPurWpCnlB8VKfRwx6PIpASCUkQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script><script>
/* If anything breaks, it's probably CKEditor putting the inserted "dynamic-toc-box" markup on a new line. */
jQuery(document).ready(function () {
//alert("JS Running");
  /*
  The following is necessary for regenerating waypoints as the page changes.
  The issue is that (1) images are being lazy loaded, so the dimensions of the page might change, and
  (2) one of the components I have switches from position:static to sticky, so again, the layout of
  the page is changing. This throws off the existing waypoints; they're no longer accurate. So
  I need to watch for page changes and regenerate the waypoints as needed.
  */
  // create an Observer instance
  const resizeObserver = new ResizeObserver(entries =>
    Waypoint.refreshAll()
  )
  // start observing a DOM node
  resizeObserver.observe(document.body)
  if (jQuery('.carousel').length) {
    jQuery('.carousel').flickity({
      // options
      cellAlign: 'left',
      contain: true,
      groupCells: true
    });
  }
  //	Drupal already does this
  //  jQuery( 'body' ).addClass( 'js' );
  /*	Detect the problem ones */
  var is_ios = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  if (is_ios) {
    jQuery('html').addClass('is-ios');
  }
  var is_safari = navigator.userAgent.indexOf("Safari") > -1;
  if (is_safari) {
    jQuery('html').addClass('is-safari');
  }
  var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  if (is_firefox) {
    jQuery('html').addClass('is-ff');
  }
// sets up the waypoints that update the page index panel as the user scrolls through the story
setUpIndexWaypoints();
// sets up the dynamic table of contents
  $('.table-of-contents-section .content').append('<div class="dynamic-toc-box"></div>');
  var toc_contents = $('.table-of-contents').clone();
  $('.dynamic-toc-box').html(toc_contents);
  
  //  new: rename the TOC
  $('.dynamic-toc-box .table-of-contents').toggleClass('table-of-contents dtb_table-of-contents');
  
  let distFromTopOfWindow = [0, 20, 25, 50, 75];
  setUpTOCRevealWaypoint();
  for (var i = 0; i < distFromTopOfWindow.length; i++) {
    setUpBasicWaypoint(distFromTopOfWindow[i]);
    setUpRefreshWaypoint();
    setUpDirectionalWaypoint(distFromTopOfWindow[i]);
    setUpSpecificWaypoint(distFromTopOfWindow[i]);
  }
  function setUpTOCRevealWaypoint() {
    var discreteElements = document.getElementsByClassName('toc-first-section')
    for (var i = 0; i < discreteElements.length; i++) {
      new Waypoint({
        element: discreteElements[i],
        handler: function (direction) {
          if (direction == 'down') {
            $('body').addClass('toc-is-visible');
          }
          else {
            $('body').removeClass('toc-is-visible');
          }
        },
        offset: '100%'
      });
    }
  }
  function setUpBasicWaypoint(distFromTopOfWindow) {
    var discreteElements = document.getElementsByClassName('animate-this')
    for (var i = 0; i < discreteElements.length; i++) {
      new Waypoint({
        element: discreteElements[i],
        handler: function () {
          this.element.classList.add("top-" + distFromTopOfWindow + "pfrom-topOfWindow");
        },
        offset: distFromTopOfWindow + '%'
      });
    }
  }
  function setUpRefreshWaypoint() {
    var discreteElements = document.getElementsByClassName('refresh-wp')
    for (var i = 0; i < discreteElements.length; i++) {
      new Waypoint({
        element: discreteElements[i],
        handler: function () {
          //		Waypoint.refreshAll();
          console.log('refreshed');
        },
        offset: '100%'
      });
    }
  }
  function setUpDirectionalWaypoint(distFromTopOfWindow) {
    var discreteElements = document.getElementsByClassName('animate-this-toggle');
    for (var i = 0; i < discreteElements.length; i++) {
      new Waypoint({
        element: discreteElements[i],
        handler: function (direction) {
          if (direction == 'down') {
            this.element.classList.add("top-" + distFromTopOfWindow + "pfrom-topOfWindow-tog");
          }
          else {
            this.element.classList.remove("top-" + distFromTopOfWindow + "pfrom-topOfWindow-tog");
          }
        },
        offset: distFromTopOfWindow + '%'
      });
    }
  }
  //  this is more specific than a generic animate-this
  //  rather than taking a generic class of animate-this and applying a
  //  specific class of "25% from the top" or whatever, this takes a
  //  specific class (25-from-top) and applies a generic "is-activated" class
  function setUpSpecificWaypoint(distFromTopOfWindow) {
    var discreteElements = document.getElementsByClassName('animate-when-' + distFromTopOfWindow + 'p-from-top');
    for (var i = 0; i < discreteElements.length; i++) {
      new Waypoint({
        element: discreteElements[i],
        handler: function () {
          this.element.classList.add("is-activated");
        },
        offset: distFromTopOfWindow + '%'
      });
    }
  }
function setUpIndexWaypoints() {
  var discreteElements = document.querySelectorAll('.field--name-field-page-components > a')
  for (var i = 0; i < discreteElements.length; i++) {
    new Waypoint({
      element: discreteElements[i],
      handler: function () {
        // get the name of the thing we're on
        curItemName = this.element.getAttribute('name');
console.log(curItemName);
        correspondingIndexItem = '.' + curItemName + '-item';
        toggleClass(correspondingIndexItem, 'active');          
      },
      offset: '50%'
    });
  }
}
  
function toggleClass(theElement, theClass) {
  //  remove the class from everything that already has it
  $('.' + theClass).removeClass(theClass);
  
  //  apply it to the element that needs it
  $(theElement).addClass(theClass);
}
});
window.onload = (event) => {
  jQuery('[data-toggle="tooltip"]').tooltip();
};</script><script src="https://unpkg.com/littlefoot/dist/littlefoot.js" type="application/javascript"></script><script type="application/javascript">
  littlefoot.littlefoot() // Pass any littlefoot settings here.
</script>