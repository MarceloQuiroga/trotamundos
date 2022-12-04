<!-- start Simple Custom CSS and JS -->
<script type="text/javascript">
function activarVisa(target) {
	
	$.ajax({
		url: "https://www.trotamundos.com/wp-content/plugins/trota/controllers/visaMantenimientoController.php",
		method: "POST",
		dataType: 'json',
		data: {
			solicitud: "activeVisa",
			user: "user1",
			target: target
		},
		success:function(response){
			console.log(response);
			$('#infCreditCard').find('.premium-title-text').text(response.list.current_card)
		},
		error: function(xhr, textStatus, error){
			console.log(xhr.statusText);
			console.log(textStatus);
			console.log(error);
		}
	})
}

    


</script>
<!-- end Simple Custom CSS and JS -->
