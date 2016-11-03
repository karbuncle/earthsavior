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
  $('form.upload-form').submit(function(evt) {
    // don't actually submit
    evt.preventDefault();
    var $file = $(this).find(':file');
    var $message = $(this).find('.message');

    if ($file[0].files && !$file[0].files[0]) {
      // there is no file selected.
      // output an error
      $message.removeClass('hide');
    } else {
      this.reset();
      $(this).find(':file').trigger('change');
      $('#upload-confirm').openModal();
    }
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
      window.location.href = "/";
    }
  });

  // login form fields on change,
  // shows error if empty
  $('#username').change(login_validate);
  $('#password').change(login_validate);
});
