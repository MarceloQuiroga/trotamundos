<!-- start Simple Custom CSS and JS -->
<script type="text/javascript">
jQuery(document).ready(function( $ ){
    
	generate_info();
	
	function generate_info() {
		$.ajax({
			  url: "https://www.trotamundos.com/wp-content/plugins/trota/controllers/visaMantenimientoController.php",
			  method: "POST",
			  dataType: 'json',
			  data: {
				  solicitud: "getInfoVisa",
				  user: "user1"
			  },
			  success:function(response){
				  console.log(response)
				  console.log($('#infCreditCard').find('.premium-title-text').text(response.list.current_card))
			  },
			  error: function(xhr, textStatus, error){
				  console.log(xhr.statusText);
				  console.log(textStatus);
				  console.log(error);
			  }
        })
	}

	
});

</script>
<!-- end Simple Custom CSS and JS -->
