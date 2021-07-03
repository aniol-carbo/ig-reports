function popup_option(event, tipus, id){
	if (event.button == 2){
		var x = confirm("Voleu eliminar aquesta imatge?");
		if (x){
			if (tipus == "foto_inicial"){
				function_blocked();
				post('/delete_initial_photo', {id: id}, 'POST');
			}
			else {
				function_blocked();
				post('/delete_final_photo', {id: id}, 'POST');
			}
		}
	}
}

function function_blocked(){
	document.getElementById("inf_basica").className = "nav-link disabled";
	document.getElementById("fotos").className = "nav-link disabled";
	document.getElementById("planols").className = "nav-link disabled";
	document.getElementById("gestio").className = "nav-link disabled";
	document.getElementById("questionari").className = "nav-link disabled";
	document.getElementById("inici").className = "nav-link disabled";
	document.getElementById("loader").style.visibility = "visible";
	document.getElementById("btn_foto").style.display= "none";
	document.getElementById("titol").style.display= "none";
	document.getElementById("fotografies").style.display= "none";
}

function post(path, params, method){
	const form = document.createElement('form');
	form.method = method;
	form.action = path;
	for (const key in params){
		if (params.hasOwnProperty(key)){
			const hiddenField = document.createElement('input');
			hiddenField.type = 'hidden';
			hiddenField.name = key;
			hiddenField.value = params[key];
			
			form.appendChild(hiddenField);
		}
	}
	document.body.appendChild(form);
	form.submit();
}