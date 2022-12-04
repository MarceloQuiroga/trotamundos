<?php

include_once ("../model/regMovimientosModel.php");
include_once ("../class/regMovimientosClass.php");

$response = array();

if ( isset($_POST['solicitud']) ) {

	switch ( $_POST['solicitud'] ) {

		case 'getAllMovimientos':
			$regMovmiento = new regMovimientosModel();
            if (isset($_POST['nombre'])) {
			$response['list'] = $regMovmiento->getMovimientos($_POST['nombre']);
            } else {
            	$response['error'] = 'Error en obtener el nombre del usuario';
            }
			$response['error'] = 'No Error';
			break;
         
         case 'getTop10Movimientos':
         	$regMovmiento = new regMovimientosModel();
			$response['list'] = $regMovmiento->getTop10Movimientos();
			$response['error'] = 'No Error';
			break;
          
         case 'insertMovimiento':
         	$regMovmiento = new regMovimientosModel();
            $regMovmiento->descripcion = isset($_POST['descripcion']) ? $_POST['descripcion'] : NULL;
            $regMovmiento->importe = isset($_POST['importe']) ? $_POST['importe'] : NULL;
            $regMovmiento->divisa = isset($_POST['divisa']) ? $_POST['divisa'] : NULL;
            $regMovmiento->proyecto = isset($_POST['proyecto']) ? $_POST['proyecto'] : NULL;
            $regMovmiento->pais = isset($_POST['pais']) ? $_POST['pais'] : NULL;
            $regMovmiento->nombre = isset($_POST['nombre']) ? $_POST['nombre'] : NULL;
            
            $regMovmiento-> insertMovimiento();
            $response['debug'] = $_SESSION;
            $response['error'] = 'No Error';
         	break;

		default:
			$response['error'] = 'Solicitud No Admitida';
			break;
	}

} else {
	$response['error'] = 'Solicitud No Encontrada';
}

echo json_encode($response);