<!-- start Simple Custom CSS and JS -->
<script type="text/javascript">
jQuery(document).ready(function( $ ){
      $.ajax({
          url: "http://192.168.1.67:4000/infocards3/user1",
          method: "GET",
          success:function(response){
			console.log(response);
			var decrypted = CryptoJS.AES.decrypt(response, "KeyMustBe16ByteOR24ByteOR32ByT3!");
			console.log(decrypted);
          },
          error: function(xhr, textStatus, error){
              console.log(xhr.statusText);
              console.log(textStatus);
              console.log(error);
          }
        })
});

</script>
<!-- end Simple Custom CSS and JS -->
