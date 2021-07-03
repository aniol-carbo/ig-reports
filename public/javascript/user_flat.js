function delete_flat() {
	post('/delete_flat', {}, 'POST');
}

function function_blocked(){
	document.getElementById("loader").style.visibility = "visible";
	document.getElementById("flat").style.display= "none";
	document.getElementById("inf_basica").className = "nav-link disabled";
	document.getElementById("fotos").className = "nav-link disabled";
	document.getElementById("planols").className = "nav-link disabled";
	document.getElementById("gestio").className = "nav-link disabled";
	document.getElementById("questionari").className = "nav-link disabled";
	document.getElementById("inici").className = "nav-link disabled";
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