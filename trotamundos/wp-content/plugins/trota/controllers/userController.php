<?php

require_once( $_SERVER['DOCUMENT_ROOT'] . '/wp-load.php' );

$response = array();

if (isset($_POST['solicitud'])) {

	switch ($_POST['solicitud']) {

		case 'getUserIsLogged':
       		if (is_user_logged_in()) {
            	$response['list'] = wp_get_current_user();
                session_start();
                $_SESSION = wp_get_current_user();
                $response['SESSIONS'] = $_SESSION;
                $response['error'] = 'No Error';
            } else {
            	$response['error'] = 'Error Usuario logeado no encontrado';
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