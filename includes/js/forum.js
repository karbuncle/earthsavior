jQuery(function ($) {
  (function fetch() {
    $.getJSON('/data/forum.json')
      .done(function(cards) {
        cards.reduce(function($acc, card) { return $acc.append(get_card(card)); }, $('#forum'));
        $('#spinner').addClass('hide');
      })
      .fail(function() {
        $('#message')
          .openModal({
            dismissible: false,
            complete: fetch
          });
      });
  })();

  var commentCards = 0;
  function get_card(card) {
    var $cardWrapper = $('<div></div>')
          .addClass('col s12 m6 l4');

    var $card = $('<div></div>')
          .addClass([
              'card small', 
              card.type == 'recycle' ? 
                'light-green lighten-4' : 
                'brown darken-2 white-text'
          ].join(' '));
    
    var $cardImageWrapper = $('<div></div>')
          .addClass([
            'card-image', 
            'waves-effect', 
            'waves-block', 
            'waves-light'
          ].join(' '));

    var $cardImage = $('<img/>')
          .addClass('activator')
          .attr('src', card.image);

    var $imageTitle = $('<span></span>')
          .addClass([
             'card-title',
             'grey darken-4 white-text'
          ].join(' '))
          .css({ 'margin': '20px', 'padding': '5px' })
          .text(card.date);

    var $cardContentWrapper = $('<div></div>')
          .addClass('card-content');
    
    var $cardTitle = $('<span></span>')
          .addClass([
            'card-title', 
            'activator'
          ].join(' '))
          .text(card.title)
          .append('<i class="material-icons right">more_vert</i>');

    var $cardContent = $('<p></p>')
          .text(card.description);

    var $cardReveal = $('<div></div>')
          .addClass([
            'card-reveal',
            'grey-text',
            'text-darken-4'
          ].join(' '));

    var $revealTitle = $('<span></span>')
          .addClass('card-title')
          .text([card.date, card.title].join(' - '))
          .after('<i class="material-icons right">close</i>');

    var $revealContent = $('<div></div>');
    
    pagination(card.comments, $revealContent);

    commentCards++;

    return $cardWrapper.append(
             $card.append(
               $cardImageWrapper
                 .append($cardImage)
                 .append($imageTitle)
             ).append(
               $cardContentWrapper
                 .append($cardTitle)
                 .append($cardContent)
             ).append(
               $cardReveal
                 .append($revealTitle)
                 .append($revealContent)
             )
           )
  }

  function get_comment_card(comment) {
    var $cardWrapper = $('<div></div>')
          .addClass('row');
    var $card = $('<div></div>')
          .addClass('card horizontal');
    var $user = $('<div></div>')
          .addClass(['card-image', 'center-align', 'teal darken-3 white-text'].join(' '))
          .append('<i class="material-icons large">face</i>')
          .append($('<h5 class="truncate"></h5>').text(comment.username));
    var $content = $('<p></p>').text(comment.content);
    var $date = $('<h6></h6>')
          .addClass('right-align')
          .css('padding-right', '5px')
          .text(comment.date)
    
    return $cardWrapper.append(
             $card
               .append($user)
               .append(
                 $('<div></div>')
                   .addClass('card-stacked')
                   .append(
                     $('<div></div>')
                       .addClass('card-content')
                       .append($content)
                   )
                   .append(
                     $('<div></div>').append($date)
                   )
               )
           );
  }

  function pagination(comments, $appendTo) {
    var COMMENTS_PER_PAGE = 3;
    var $pagebar = $('<ul></ul>').addClass(['pagination', 'center-align'].join(' ')).appendTo($appendTo);
    var $prev = $('<a href="#!"><i class="material-icons">chevron_left</i></a>');
    var $next = $('<a href="#!"><i class="material-icons">chevron_right</i></a>');
    var $currParagraph;
    var currPage = 0;
    var currComment = 0;
    var goToPage = function (pageNum) {
      // pageNums are 1-based,
      // eq are 0-based
      return function() {
        var $pageLinks = $('li', $pagebar);
        var $activeLink = $pageLinks.filter('.active');

        if ($pageLinks.index($activeLink) == pageNum) {
          // active page is clicked, do nothing
          return;
        }
        
        // changes pagination links
        $pageLinks.removeClass('active').addClass('waves-effect');
        $pageLinks.eq(pageNum).addClass('active').removeClass('waves-effect');

        // switches to the displayed page
        var $pages = $appendTo.children('p').addClass('hide');
        $pages.eq(pageNum - 1).removeClass('hide');
        
        var disableIf = function($link, condition) {
          if (condition) {
            // first page, prev button should be disabled
            $link.addClass('disabled').removeClass('waves-effect');
          } else {
            $link.removeClass('disabled').addClass('waves-effect');
          }
        };
        disableIf($prev.parent(), pageNum == 1);
        disableIf($next.parent(), pageNum == $pages.length);
      }
    };

    var currentPage = function() {
      return $('li.active', $pagebar).index(); 
    };
    $prev.prependTo($pagebar).wrap('<li></li>')
      .click(function() {
        if (!$(this).parent().hasClass('disabled'))
          (goToPage(currentPage() - 1))();
      });
    $next.appendTo($pagebar).wrap('<li></li>')
      .click(function() {
        if (!$(this).parent().hasClass('disabled'))
          (goToPage(currentPage() + 1))();
      });
    var addComment = function(comment) {
      // for each comment,
      if (currComment++ % COMMENTS_PER_PAGE == 0) {
        // needs a new page(paragraph)
        $currParagraph = $('<p></p>').appendTo($appendTo).addClass('hide');
        var $link = $('<a></a>')
              .click(goToPage(++currPage))
              .append(currPage);

        // needs a new pagination link
        $next.parent().before($('<li></li>').append($link));
      }
      $currParagraph.append(get_comment_card(comment));
    };

    var $commentBox = $('<ul></ul>')
      .addClass('collapsible')
      .css({'margin': '0 -20px', 'border': '0', 'box-shadow': 'none'})
      .append(
         $('<li></li>')
           .append(
             $('<div></div>')
               .addClass('collapsible-header')
               .text('Leave a comment')
           )
           .append(
             $('<form></form>')
               .addClass('collapsible-body')
               .css({'padding': '20px'})
               .append(
                 $('<div></div>')
                   .addClass('row')
                   .append(
                     $('<div></div>')
                       .addClass(['input-field', 'col s12'].join(' '))
                       .append(
                         $('<textarea></textarea>')
                           .addClass('materialize-textarea')
                           .attr('id', 'add-comment-' + commentCards)
                       )
                       .append(
                         $('<label></label>')
                           .attr('for', 'add-comment-' + commentCards)
                           .text('Your Comment')
                       )
                   )
               )
               .append(
                 $('<div></div>')
                   .addClass('row')
                   .append(
                     $('<div></div>')
                       .addClass('col s12')
                       .append(
                         $('<button></button>')
                           .addClass(['right', 'btn-flat btn-large', 'waves-effect waves-light'].join(' '))
                           .attr('type', 'submit')
                           .text('Submit')
                           .append(
                             $('<i></i>')
                               .addClass(['right', 'material-icons'].join(' '))
                               .text('send')
                           )
                       )
                   )
               )
               .submit(function(evt) {
                 // do not submit
                 evt.preventDefault();
                 var $content = $('textarea', this);

                 if ($content.val()) {
                   addComment({
                     'username': 'You',
                     'content': $content.val(),
                     'date': (new Date()).toLocaleDateString()
                   });
                   this.reset();
                   $('li:eq(-2) a', $pagebar).removeClass('disabled').click();
                   $('.collapsible-header', $commentBox).click();
                 } else {
                   $content.removeClass('valid').addClass('invalid')
                 }
               })
           )
    ).collapsible();
    $appendTo.append($commentBox);
    
    if (!comments.length) {
      // there are no comments
      var $valign = $('<div></div>')
        .addClass(['valign', 'auto-margin'].join(' '))
        .text('There are no comments for this upload.');

      $appendTo
        .addClass([
          'overlay', 
          'valign-wrapper', 
          'grey-text text-darken-4'
        ].join(' '))
        .css('z-index', '-1')
        .append($valign);
      return;
    }

    comments.forEach(addComment);
    // trigger clicking page 1
    $('li:eq(1) a', $pagebar).click();
  }

});
