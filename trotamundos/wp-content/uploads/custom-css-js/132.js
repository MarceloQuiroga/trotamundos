<!-- start Simple Custom CSS and JS -->
<script type="text/javascript">
jQuery(document).ready(function( $ ){
    
	$.ajax({
          url: "https://www.trotamundos.com/wp-content/plugins/trota/controllers/regMovimientosController.php",
          method: "POST",
          dataType: 'json',
          data: {
			  solicitud: "getAllMovimientos"
		  },
          success:function(response){
              console.log(response)
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
