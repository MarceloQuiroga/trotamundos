<?php

class visaMantenimientoModel {

	public function activeVisa($user, $target){

		// URL de destino de la APY
		$url = "http://192.168.1.67:4000/enablecard3/$user/$target";

		// Inicializamos la petición
		$curl = curl_init($url);

		// Configuramos la petición, establecemos que devolverá información
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

		// Ejecutamos la solicitud y la cerramos
		curl_exec($curl);
		curl_close($curl);
        return (true);

	}
    
	public function getInfoVisa($user){
	
		// URL de destino de la APY
		$url = "http://192.168.1.67:4000/infocards3/$user";
        
		// Inicializamos la petición
		$curl = curl_init($url);

		// Configuramos la petición, establecemos que devolverá información
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

		// Ejecutamos la solicitud y la cerramos
		$crypted = curl_exec($curl);
		curl_close($curl);

		// Desencriptamos la respuesta de la solicitud
		$key = "KeyMustBe16ByteOR24ByteOR32ByT3!";
		$encrypt_method = "aes-256-ecb";
		$decrypted = openssl_decrypt($crypted, $encrypt_method, $key);
		$decrypted = json_decode($decrypted);
       
		return ($decrypted);
      

	}

}

?>