<?php

require_once( $_SERVER['DOCUMENT_ROOT'] . '/wp-load.php' );
if (!is_user_logged_in()) {
	header("Location: https://www.trotamundos.com/wp-login.php");
}

include_once ("../model/visaMantenimientoModel.php");

$response = array();

if ( isset($_POST['solicitud']) ) {

	switch ( $_POST['solicitud'] ) {

		case 'getInfoVisa':
       
        	if ($_POST['user']) {
            	$visaMantenimiento = new visaMantenimientoModel();
                $response['list'] = $visaMantenimiento->getInfoVisa($_POST['user']);
                $response['error'] = 'No Error';
            }
            else {
            	$response['error'] = 'Error en el parámetro, usuario no encontrado';
            }
            break;
        
        case 'activeVisa':
			if (isset($_POST['target']) && isset($_POST['user'])) {
            
				$visaMantenimiento = new visaMantenimientoModel();
                if ($visaMantenimiento->activeVisa($_POST['user'], $_POST['target'])) {
                	$response['list'] = $visaMantenimiento->getInfoVisa($_POST['user']);
                    $response['error'] = 'No Error';
       			} else {
                	$response['error'] = 'Error desconozido en la ejecución';
            	}
			}
			else {
				$response['error'] = 'Error al encontrar el objetivo';
			}
			break;

		default:
			$response['error'] = 'Solicitud No Admitida';
			break;
	}

} else {
	$response['error'] = 'Solicitud No Encontrada';
}

echo json_encode($response);
unset($response);

?>