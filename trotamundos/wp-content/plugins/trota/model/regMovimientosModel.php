<?php

include_once ("../controllers/connect_data.php");
include_once ("../class/regMovimientosClass.php");

class regMovimientosModel extends regMovimientosClass {

	 private $link;  // Enlace a la bbdd  

	 public function OpenConnect() {
		  $konDat=new connect_data();
		  try
		  {
			   $this->link=new mysqli($konDat->host,$konDat->userbbdd,$konDat->passbbdd,$konDat->ddbbname);
			   // Se crea un nuevo objeto llamado link de la clase mysqli con los datos de conexión. 
		  }
		  catch(Exception $e)
		  {
			   echo $e->getMessage();
		  }
		  $this->link->set_charset("utf8");
	 }                   
		  
	 public function CloseConnect() {
		  mysqli_close ($this->link);
	 }

	 /********* FUNCIONES **********/

	 public function getMovimientos($user) {

		$this->OpenConnect();
		$sql = "SELECT * FROM movimientos WHERE isActive = true AND nombre = '$user'";
            
		$result = $this->link->query($sql);         
		$list = array();

		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		
			$newRegMovimiento = new regMovimientosModel();

			$newRegMovimiento->cod=$row['cod'];
			$newRegMovimiento->fecha=$row['fecha'];
			$newRegMovimiento->descripcion=$row['descripcion'];
			$newRegMovimiento->importe=$row['importe'];
			$newRegMovimiento->divisa=$row['divisa'];
			$newRegMovimiento->proyecto=$row['proyecto'];
            $newRegMovimiento->pais=$row['pais'];
            $newRegMovimiento->nombre=$row['nombre'];

			array_push($list, $newRegMovimiento);
		
		}
		mysqli_free_result($result);
		$this->CloseConnect();
		return $list;
	 }
     
	public function getTop10Movimientos() {

		$this->OpenConnect();
 		$sql = "SELECT nombre, SUM(importe) as importe FROM movimientos GROUP by nombre ORDER BY importe DESC";
        
		$result = $this->link->query($sql);         
		$list = array();

		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		
			$newRegMovimiento = new regMovimientosModel();
			$newRegMovimiento->importe=$row['importe'];
            $newRegMovimiento->nombre=$row['nombre'];
			array_push($list, $newRegMovimiento);
		
		}
		mysqli_free_result($result);
		$this->CloseConnect();
		return $list;
	 } 
     
     public function insertMovimiento() {

		$this->OpenConnect();
        
        $fecha =date("Y-m-d");
        $descripcion = $this->descripcion;
        $importe = $this->importe;
        $divisa = $this->divisa;
        $proyecto = $this->proyecto;
        $pais = $this->pais;
        $nombre = $this->nombre;

		#$sql = "SELECT * FROM movimientos";

        $sql = "INSERT INTO movimientos (fecha, descripcion, importe, divisa, proyecto, pais, nombre) VALUES ('$fecha', '$descripcion', '$importe', '$divisa', '$proyecto', '$pais', '$nombre');";
        
        $this->link->query($sql); 
        $this->CloseConnect();
     }

}