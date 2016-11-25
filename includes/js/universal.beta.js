jQuery(function($) {
  // materialize initializers
  $('.button-collapse').sideNav();

  $('ul.tabs').tabs();

  $('select').material_select();

  // image upload preview
  $(':file').change(function() {
    var $this = $(this);
    var $image = $this.siblings('img.image-preview');
    var $overlay = $this.siblings('div.image-preview-overlay');
    var $message = $this.closest('form').find('.message');

    if (this.files && this.files[0]) {
      var reader = new FileReader();

      reader.onload = function(e) {
        $image
          .attr('src', e.target.result)
          .add($overlay)
          .removeClass('hide');
        $message.addClass('hide');
      };

      reader.readAsDataURL(this.files[0]);
    } else {
      $image
        .add($overlay)
        .addClass('hide');
    }
  });

  // upload form submit behavior
  $('form.upload-form')
  .each(function() {
    var $this = $(this);
    var $stepOne = $('div.step-one', $this);
    var $stepTwo = $('div.step-two', $this);

    $('button.step-forward', $stepOne).click(function() {
      var $file = $(':file', $stepOne);
      var $message = $('.message', $stepOne);

      if ($file[0].files && !$file[0].files[0]) {
        // there is no file selected.
        // output an error
        $message.removeClass('hide');
        ga('send', 'event', 'upload-form', 'validation-failure');
      } else {
        $stepOne.addClass('hide');
        $stepTwo.removeClass('hide');
        $message.addClass('hide');
        $('a.step-one', $this).removeClass('white-text');
        $('a.step-two', $this).addClass('white-text');
      }
    });

    $('button.step-back', $stepTwo).click(function() {
      $stepOne.removeClass('hide');
      $stepTwo.addClass('hide');
      $('a.step-one', $this).addClass('white-text');
      $('a.step-two', $this).removeClass('white-text');
    });
  })
  .submit(function(evt) {
    // don't actually submit
    evt.preventDefault();
    var $this = $(this);
    var $title = $('#title', $this);

    if (!$title.val()) {
      // user did not give a title
      // do not allow upload
      $title.addClass('invalid');
      ga('send', 'event', 'upload-form', 'validation-failure');
    } else {
      // saves upload to local storage
      $title.removeClass('invalid');
      if (!sessionStorage.myCards) sessionStorage.myCards = JSON.stringify([]);
      var data = $.parseJSON(sessionStorage.myCards);
      data.unshift({
        date: (new Date()).toLocaleDateString(),
        title: $('#title', $this).val(),
        description: $('#description', $this).val(),
        type: $this.parent().data('type'),
        image: $('.image-preview', $this).attr('src'),
        comments: []
      });
      sessionStorage.myCards = JSON.stringify(data);

      var comments = !sessionStorage.myComments? [] : $.parseJSON(sessionStorage.myComments);
      comments.unshift([]);
      sessionStorage.myComments = JSON.stringify(comments);

      this.reset();
      $(':file', $this).trigger('change');
      $('#upload-confirm').openModal();

      // goes back to tab 1
      $('button.step-back', $this).click();
    }
  });
  
  // upload form step breadcrumb
  $('a.step-one').click(function() {
    var $this = $(this);
    if (!$this.hasClass('white-text')) {
      // the current tab is step two
      // triggers a click on the step back button
      $this.closest('form').find('div.step-two .step-back').click();
    }
  })
  // triggers the click event
  .click();

  $('a.step-two').click(function() {
    var $this = $(this);
    if (!$this.hasClass('white-text')) {
      // the current tab is step one
      // triggers a click on the step forward button
      $this.closest('form').find('div.step-one .step-forward').click();
    }
  });

  $('a.choose-file').click(function () {
    $(this).closest('form').find(':file').click();
  });

  // login form validation
  function login_validate() {
    var $this = $(this);
    if ($this.val()) {
      $this.removeClass('invalid').addClass('valid');
    } else {
      $this.removeClass('valid').addClass('invalid');
    }
  }

  // login form submit behavior
  $('form#login-form').submit(function(evt) {
    // don't actually submit the form
    evt.preventDefault();

    var $this = $(this);
    var $username = $this.find('#username');
    var $password = $this.find('#password');

    // triggers change event on input,
    // shows error messages if any
    $username.add($password).change();

    if ($username.val() && $password.val()) {
      // if both fields are filled, 
      // goes to home page
      Cookies.set('username', $username.val());
      window.location.href = "/home";
    }
  });

  // login form fields on change,
  // shows error if empty
  $('#username').change(login_validate);
  $('#password').change(login_validate);
});
