// JavaScript Document
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
var mysql = require('mysql');
var mime_types = {
    'js': 'text/javascript',
    'html': 'text/html',
    'css': 'text/css',
    'jpg': 'image/jpg',
    'gif': 'image/gif',
    'png': 'image/png',
	'json': 'text/json'
};


var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var personality_insights = new PersonalityInsightsV3({
  username: '0e9cd25d-79ca-4c09-861f-f68b54b4b04d',
  password: 'GfvOe6AhI2D8',
  version_date: '2017-11-07'
});

http.createServer(function(peticion, respuesta) {
    var path_nombre = (url.parse(peticion.url).pathname == '/') ? '/index.html' : url.parse(peticion.url).pathname;
    var ruta_a_archivo = 'contenido/' + path_nombre;
    fs.exists(ruta_a_archivo, function(existe) {
        if (existe) {
            fs.readFile(ruta_a_archivo, function(error, contenido_archivo) {
                if (error) {
                    respuesta.writeHead(500, 'text/plain');
                    respuesta.end('Error interno.');
                } else {
                    var extension = ruta_a_archivo.split('.').pop();
                    var mime_type = mime_types[extension];
                    respuesta.writeHead(200, {'Content-Type': mime_type});
                    respuesta.end(contenido_archivo);
                }
            });
        } else {
            respuesta.writeHead(404, 'text/plain');
            respuesta.end('Error 404. El enlace no existe o ha dejado de existir.');
        }
    });
	if(peticion.method == 'POST'){
		fs.readFile('contenido/frame2.html',function (err, data){
        respuesta.writeHead(200, {'Content-Type': 'text/html'});
        respuesta.write(data);
        respuesta.end();
    });
	
	 var getDatos = '', idU = null, nombreU = null, emailU = null, edadU = null, generoU = null, interesadoen1U = null, interesadoen2U = null, localidadU = null, relacionstatusU = null, religionU = null, politicaU = null, nombrejson;
      peticion.on('data', function(getTextJson){
         getDatos += getTextJson;
		 
      });
      peticion.on('end', function(){
         var data_post_objecto = querystring.parse(getDatos);
		 var dataJson = data_post_objecto.datojson;
		 idU = data_post_objecto.id_U;
		 nombreU = data_post_objecto.nombre;
		 emailU = (data_post_objecto.email == 'undefined') ? null : data_post_objecto.email;
		 // emailU = data_post_objecto.email;
		 edadU = (data_post_objecto.edad == 'undefined') ? null : data_post_objecto.edad;
		 generoU = (data_post_objecto.genero == 'undefined') ? null : data_post_objecto.genero;
		 interesadoen1U = (data_post_objecto.interesado_en1 == 'undefined') ? null : data_post_objecto.interesado_en1;
		 interesadoen2U = (data_post_objecto.interesado_en2 == 'undefined') ? null : data_post_objecto.interesado_en2;
		 localidadU = (data_post_objecto.localidad == 'undefined') ? null : data_post_objecto.localidad;
		 relacionstatusU = (data_post_objecto.relacion_status == 'undefined') ? null : data_post_objecto.relacion_status;
		 religionU = (data_post_objecto.religion == 'undefined') ? null : data_post_objecto.religion;
		 politicaU = (data_post_objecto.politica == 'undefined') ? null : data_post_objecto.politica;
		 nombrejson = data_post_objecto.nombrejson;
		 var buildJson = JSON.parse(dataJson);
		 // console.log(JSON.stringify(buildJson, null, 2)); 
	

var params = {
  // Get the content items from the JSON file.
  // content_items: require('./ejemploJson.json').contentItems,
  content_items: buildJson.contentItems,
  consumption_preferences: true,
  raw_scores: true,
  headers: {
    'accept-language': 'es',
    'accept': 'application/json'
  }
};

personality_insights.profile(params, function(error, response) {
  if (error)
    console.log('Error:', error);
  else
    console.log(JSON.stringify(response, null, 2));
	
	
	setTimeout(function(){
	
	fs.writeFile("./contenido/"+nombrejson, JSON.stringify(response, null, 2), function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("Archivo Json guardado");
	
		
});
	
	},10000);
	
	
	
  }
);
    
				      
					  
	var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pruebaapp"
});

		con.connect(function(error){
   if(error){
      throw error;
   }else{
      console.log('Conexion correcta.');
   }
});
var query = con.query('INSERT INTO usuarios(id_usuario, nombre, email, edad) VALUES(?, ?, ?, ?)', [idU, nombreU, emailU, edadU], function(error, result){
   if(error){
      throw error;
   }else{
      console.log(result);
   }
 }
);
var query2 = con.query('INSERT INTO genero_usuarios(id_usuario, genero) VALUES(?, ?)', [idU, generoU], function(error, result){
   if(error){
      throw error;
   }else{
      console.log(result);
   }
 }
);

var query3 = con.query('INSERT INTO interesado_en_usuarios(id_usuario, interes_en) VALUES(?, ?)', [idU, interesadoen1U], function(error, result){
   if(error){
      throw error;
   }else{
      console.log(result);
   }
 }
);

 if(interesadoen2U != ""){
	var query4 = con.query('INSERT INTO interesado_en_usuarios(id_usuario, interes_en) VALUES(?, ?)', [idU, interesadoen2U], function(error, result){
   if(error){
      throw error;
   }else{
      console.log(result);
   }
 }
);
	}

var query5 = con.query('INSERT INTO localidad_usuarios(id_usuario, localidad) VALUES(?, ?)', [idU, localidadU], function(error, result){
   if(error){
      throw error;
   }else{
      console.log(result);
   }
 }
);
var query6 = con.query('INSERT INTO relacion_status_usuarios(id_usuario, relacion_status) VALUES(?, ?)', [idU, relacionstatusU], function(error, result){
   if(error){
      throw error;
   }else{
      console.log(result);
   }
 }
);
var query7 = con.query('INSERT INTO religion_usuarios(id_usuario, religion) VALUES(?, ?)', [idU, religionU], function(error, result){
   if(error){
      throw error;
   }else{
      console.log(result);
   }
 }
);
var query8 = con.query('INSERT INTO politica_usuarios(id_usuario, politica) VALUES(?, ?)', [idU, politicaU], function(error, result){
   if(error){
      throw error;
   }else{
      console.log(result);
   }
 }
);

con.end();

						});
	
	}
	}).listen(3800, '127.0.0.1');
console.log('El servidor esta funcionando correctamente en http://localhost:3800/');