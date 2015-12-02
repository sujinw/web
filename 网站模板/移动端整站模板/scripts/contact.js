jQuery(function() {
  jQuery('.error').hide();
  jQuery(".contactButton").click(function() {
		// validate and process form
		// first hide any error messages
    jQuery('.error').hide();
		
	  var name = jQuery("input#contactName").val();
		if (name == "") {
      jQuery("span#nameError").show();
      jQuery("input#contactName").focus();
      return false;
    }
	  var email = jQuery("input#contactEmail").val();
	  if (email == "") {
      jQuery("span#emailError").show();
      jQuery("input#contactEmail").focus();
      return false;
    }
	
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	if(!emailReg.test(email)) {
	jQuery("span#emailError2").show();
    jQuery("input#contactEmail").focus();
      return false;
	}
	
	  var msg = jQuery("textarea#contactMessage").val();
	  if (msg == "") {
	  jQuery("span#messageError").show();
	  jQuery("textarea#contactMessage").focus();
	  return false;
    }
		
		var dataString = 'name='+ name + '&email=' + email + '&msg=' + msg;
		//alert (dataString);return false;
		
	  jQuery.ajax({
      type: "POST",
      url: "php/mail.php",
      data: dataString,
      success: function() {
        jQuery('#contactForm').html("<div id='successMessage' style='margin-top:47px;'></div>");
        jQuery('#successMessage').html("<strong style='color:#343434; float:left;'>Thank you for contacting us!</strong>")
        .append("<p style='float:left;'>We will be in touch soon.</p>")
        .hide()
        .fadeIn(1500, function() {
          jQuery('#successMessage');
        });
      }
     });
    return false;
	});
});

