function advancedSearch(){
	post('/show_customers', {client: document.getElementById("myDropdownClient").value, districte: document.getElementById("myDropdownDistrict").value}, 'POST');
}

function backToLogin(){
	post('/back_to_main', {}, 'POST');
}

function function_blocked(){
	document.getElementById("loader").style.visibility = "visible";
	document.getElementById("customer").style.display= "none";
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