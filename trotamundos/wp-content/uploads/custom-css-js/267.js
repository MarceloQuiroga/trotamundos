<!-- start Simple Custom CSS and JS -->
<script type="text/javascript">
$(document).ready(loadComponents);

/* VARIBLES GLOBALES */
var currentActiveCreditCard;
var session;
var gastos;

async function loadComponents(){
	await getSession();
	if (session){
		genVisaFunctions();
		getMovimientos();
	}
	genTop10Movimientos();

    /*await getSession().then(async function(session) {
        await loadHeaderFooter();
        await loadContent(session);
        boostrapDropdown();
    })*/

}

function getSession() {
	return new Promise ( (resolve, reject) => {
		$.ajax({
			url: "https://www.trotamundos.com/wp-content/plugins/trota/controllers/userController.php",
			method: "POST",
			dataType: 'json',
			data: {
				solicitud: "getUserIsLogged"
			},
			success:function(response){
				//console.log(response)
				if (response.error == 'No Error')
				{
					//console.log(response.list);
					//console.log($('#inf_login'));
					$('#username').find('.premium-title-text').text(response.list.data.user_login);
					$('#btn_login').hide();
					$('#btn_logout').show();
					$('#tabla_movimientos_data').show();
				} else {
					$('#btn_login').show();
					$('#btn_logout').hide();
					$('#bloque_visaActiva').hide();
					$('#tabla_movimientos_data').hide();
				}
				session = response.SESSIONS;
				resolve();
			},
			error: function(xhr, textStatus, error){
				console.log(xhr.statusText);
				console.log(textStatus);
				console.log(error);
				reject(error);
			}
		})
	})
}

function logout() {
	$.cookie("PHPSESSID", null, { path: '/' });
}

function genVisaFunctions() {

	$.ajax({
		url: "https://www.trotamundos.com/wp-content/plugins/trota/controllers/visaMantenimientoController.php",
		method: "POST",
		dataType: 'json',
		data: {
			solicitud: "getInfoVisa",
			user: "user1"
		},
		success:function(response){
			//console.log(response)
			
			if (response.error == 'No Error') {
				currentActiveCreditCard = response.list.current_card;
				$('#infCreditCard').find('.premium-title-text').text(currentActiveCreditCard);
				if (currentActiveCreditCard == 'EUROPE') {
					$('#btn_activation').text("Activar MASTERCARD ");
				} else {
					$('#btn_activation').text("Activar VISA ");
				}
			} else {
				alert(response.error);
			}
		},
		error: function(xhr, textStatus, error){
			console.log(xhr.statusText);
			console.log(textStatus);
			console.log(error);
		}
	})
	
}

function activarVisa() {
	
	(currentActiveCreditCard == 'EUROPE') ? target = 'INTERNATIONAL' : target = 'EUROPE';
		
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
			//console.log(response);
			if (response.error == 'No Error') {
				currentActiveCreditCard = response.list.current_card;
				$('#infCreditCard').find('.premium-title-text').text(currentActiveCreditCard);
				if (currentActiveCreditCard == 'EUROPE') {
					$('#btn_activation').text("Activar MASTERCARD");
				} else {
					$('#btn_activation').text("Activar VISA");
				}
			}
		},
		error: function(xhr, textStatus, error){
			console.log(xhr.statusText);
			console.log(textStatus);
			console.log(error);
		}
	})
}

function form_block() {
	$('#validateForm').is(':checked') ? $('#donacion > button').attr('disabled',false) : $('#donacion > button').attr('disabled',true)
	
}

function donar() {
	var nombre;
	if (session.data.display_name) {
		nombre = session.data.display_name;
	} else {
		nombre = 'Unknown'
	}
	$.ajax({
		url: "https://www.trotamundos.com/wp-content/plugins/trota/controllers/regMovimientosController.php",
		method: "POST",
		dataType: 'json',
		data: {
			solicitud: "insertMovimiento",
			descripcion: 'Donacion',
			importe: $('#donacion > input[type="number"]').val(),
			divisa: 'EUR',
			proyecto: 'Donacion',
			pais: 'ESP',
			nombre: nombre
			
			
		},
		success:function(response){
			//console.log(response)
		},
		error: function(xhr, textStatus, error){
			console.log(xhr.statusText);
			console.log(textStatus);
			console.log(error);
		}
	})
}

function genTop10Movimientos() {
	$.ajax({
          url: "https://www.trotamundos.com/wp-content/plugins/trota/controllers/regMovimientosController.php",
          method: "POST",
          dataType: 'json',
          data: {
			  solicitud: "getTop10Movimientos"
		  },
          success:function(response){
              //console.log(response)
			  if (response.error == 'No Error')
			  {
				  $(response.list).each(function (index, value) {
					  $('#gen_table_rank').append(
						  "<div class='row mx-auto'>"
						  + "<div class='col'>" + (index+1) + "</div>"
						  + "<div class='col-5'>" + value.nombre + "</div>"
						  + "<div class='col-5'>" + value.importe + "€</div>"
						  + "</div>"
					  )
					  //console.log(value);
				  })
						  
			  }
          },
          error: function(xhr, textStatus, error){
              console.log(xhr.statusText);
              console.log(textStatus);
              console.log(error);
          }
        })
}

function getMovimientos() {
	$.ajax({
          url: "https://www.trotamundos.com/wp-content/plugins/trota/controllers/regMovimientosController.php",
          method: "POST",
          dataType: 'json',
          data: {
			  solicitud: "getAllMovimientos",
			  nombre: session.data.display_name
		  },
          success:function(response){
              //console.log(response)
			  if (response.error == 'No Error') {
				  gastos = response.list
				  gen_movTable();
			  }
          },
          error: function(xhr, textStatus, error){
              console.log(xhr.statusText);
              console.log(textStatus);
              console.log(error);
          }
        })
}

function gen_movTable() {
	$('#datos_movimientos').text("");
	gastoTotalDonacion = 0;
	gastoTotalOtros = 0;
	$(gastos).each(function (index, value) {
		$('#datos_movimientos').append(
			"<div class='row mx-auto'>"
			+ "<div class='col'>" + (index+1) + "</div>"
			+ "<div class='col'>" + value.proyecto + "</div>"
			+ "<div class='col'>" + value.descripcion + "</div>"
			+ "<div class='col'>" + value.fecha + "</div>"
			+ "<div class='col'>" + value.pais + "</div>"
			+ "<div class='col'>" + value.divisa + "</div>"
			+ "<div class='col'>" + value.importe + "</div>"
			+ "</div>"
		)
		if (value.proyecto == 'Donacion') {
			gastoTotalDonacion += parseInt(value.importe);
		} else {
			gastoTotalOtros += parseInt(value.importe);
		}
	})

	$('#datos_movimientos').append(
		"<div class='row mx-auto'>"
		+ "<div class='col border'> Gasto Total Donativo --> " + gastoTotalDonacion + "€</div>"
		+ "<div class='col border'> Gasto Total Otros --> " + gastoTotalOtros + "€</div>"
		+ "</div>" 
	)
}

function filter(cifra) {
	switch(cifra) {
		case 1:
			$('#datos_movimientos').text("");
			gastoTotalDonacion = 0;
			gastoTotalOtros = 0;
			$(gastos).each(function (index, value) {
				if (value.importe < 10)
				{
					$('#datos_movimientos').append(
						"<div class='row mx-auto'>"
						+ "<div class='col'>" + (index+1) + "</div>"
						+ "<div class='col'>" + value.proyecto + "</div>"
						+ "<div class='col'>" + value.descripcion + "</div>"
						+ "<div class='col'>" + value.fecha + "</div>"
						+ "<div class='col'>" + value.pais + "</div>"
						+ "<div class='col'>" + value.divisa + "</div>"
						+ "<div class='col'>" + value.importe + "</div>"
						+ "</div>"
					)
					if (value.proyecto == 'Donacion') {
						gastoTotalDonacion += parseInt(value.importe);
					} else {
						gastoTotalOtros += parseInt(value.importe);
					}
				}
			})
			$('#datos_movimientos').append(
				"<div class='row mx-auto'>"
				+ "<div class='col border'> Gasto Total Donativo --> " + gastoTotalDonacion + "€</div>"
				+ "<div class='col border'> Gasto Total Otros --> " + gastoTotalOtros + "€</div>"
				+ "</div>" 
			)
			break;
			
		case 3:
			$('#datos_movimientos').text("");
			gastoTotalDonacion = 0;
			gastoTotalOtros = 0;
			$(gastos).each(function (index, value) {
				if (value.importe >= 100 && value.importe < 1000)
				{
					$('#datos_movimientos').append(
						"<div class='row mx-auto'>"
						+ "<div class='col'>" + (index+1) + "</div>"
						+ "<div class='col'>" + value.proyecto + "</div>"
						+ "<div class='col'>" + value.descripcion + "</div>"
						+ "<div class='col'>" + value.fecha + "</div>"
						+ "<div class='col'>" + value.pais + "</div>"
						+ "<div class='col'>" + value.divisa + "</div>"
						+ "<div class='col'>" + value.importe + "</div>"
						+ "</div>"
					)
					if (value.proyecto == 'Donacion') {
						gastoTotalDonacion += parseInt(value.importe);
					} else {
						gastoTotalOtros += parseInt(value.importe);
					}
				}
			})
			$('#datos_movimientos').append(
				"<div class='row mx-auto'>"
				+ "<div class='col border'> Gasto Total Donativo --> " + gastoTotalDonacion + "€</div>"
				+ "<div class='col border'> Gasto Total Otros --> " + gastoTotalOtros + "€</div>"
				+ "</div>" 
			)
			break;

		case 2:
			$('#datos_movimientos').text("");
			gastoTotalDonacion = 0;
			gastoTotalOtros = 0;
			$(gastos).each(function (index, value) {
				if (value.importe >= 10 && value.importe < 100)
				{
					$('#datos_movimientos').append(
						"<div class='row mx-auto'>"
						+ "<div class='col'>" + (index+1) + "</div>"
						+ "<div class='col'>" + value.proyecto + "</div>"
						+ "<div class='col'>" + value.descripcion + "</div>"
						+ "<div class='col'>" + value.fecha + "</div>"
						+ "<div class='col'>" + value.pais + "</div>"
						+ "<div class='col'>" + value.divisa + "</div>"
						+ "<div class='col'>" + value.importe + "</div>"
						+ "</div>"
					)
					if (value.proyecto == 'Donacion') {
						gastoTotalDonacion += parseInt(value.importe);
					} else {
						gastoTotalOtros += parseInt(value.importe);
					}
				}
			})
			$('#datos_movimientos').append(
				"<div class='row mx-auto'>"
				+ "<div class='col border'> Gasto Total Donativo --> " + gastoTotalDonacion + "€</div>"
				+ "<div class='col border'> Gasto Total Otros --> " + gastoTotalOtros + "€</div>"
				+ "</div>" 
			)
			break;
			
		case 4:
			$('#datos_movimientos').text("");
			gastoTotalDonacion = 0;
			gastoTotalOtros = 0;
			$(gastos).each(function (index, value) {
				if (value.importe >= 1000 && value.importe < 10000)
				{
					$('#datos_movimientos').append(
						"<div class='row mx-auto'>"
						+ "<div class='col'>" + (index+1) + "</div>"
						+ "<div class='col'>" + value.proyecto + "</div>"
						+ "<div class='col'>" + value.descripcion + "</div>"
						+ "<div class='col'>" + value.fecha + "</div>"
						+ "<div class='col'>" + value.pais + "</div>"
						+ "<div class='col'>" + value.divisa + "</div>"
						+ "<div class='col'>" + value.importe + "</div>"
						+ "</div>"
					)
					if (value.proyecto == 'Donacion') {
						gastoTotalDonacion += parseInt(value.importe);
					} else {
						gastoTotalOtros += parseInt(value.importe);
					}
				}
			})
			$('#datos_movimientos').append(
				"<div class='row mx-auto'>"
				+ "<div class='col border'> Gasto Total Donativo --> " + gastoTotalDonacion + "€</div>"
				+ "<div class='col border'> Gasto Total Otros --> " + gastoTotalOtros + "€</div>"
				+ "</div>" 
			)
			break;
		
		case 5:
			$('#datos_movimientos').text("");
			gastoTotalDonacion = 0;
			gastoTotalOtros = 0;
			$(gastos).each(function (index, value) {
				if (value.importe >= 10000)
				{
					$('#datos_movimientos').append(
						"<div class='row mx-auto'>"
						+ "<div class='col'>" + (index+1) + "</div>"
						+ "<div class='col'>" + value.proyecto + "</div>"
						+ "<div class='col'>" + value.descripcion + "</div>"
						+ "<div class='col'>" + value.fecha + "</div>"
						+ "<div class='col'>" + value.pais + "</div>"
						+ "<div class='col'>" + value.divisa + "</div>"
						+ "<div class='col'>" + value.importe + "</div>"
						+ "</div>"
					)
					if (value.proyecto == 'Donacion') {
						gastoTotalDonacion += parseInt(value.importe);
					} else {
						gastoTotalOtros += parseInt(value.importe);
					}
				}
			})
			$('#datos_movimientos').append(
				"<div class='row mx-auto'>"
				+ "<div class='col border'> Gasto Total Donativo --> " + gastoTotalDonacion + "€</div>"
				+ "<div class='col border'> Gasto Total Otros --> " + gastoTotalOtros + "€</div>"
				+ "</div>" 
			)
			break;
	}
}

function nuevoGasto() {
	
	console.log($('#newGasto').find('#descripcion').val());

	$.ajax({
		url: "https://www.trotamundos.com/wp-content/plugins/trota/controllers/regMovimientosController.php",
		method: "POST",
		dataType: 'json',
		data: {
			solicitud: "insertMovimiento",
			descripcion: $('#newGasto').find('#descripcion').val(),
			importe: $('#newGasto').find('#importe').val(),
			divisa: 'EUR',
			proyecto: $('#newGasto').find('#proyecto').val(),
			pais: 'ESP',
			nombre: session.data.display_name
		},
		success:function(response){
			//console.log(response)
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
