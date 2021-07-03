function function_blocked(){
	document.getElementById("loader").style.visibility = "visible";
	document.getElementById("forms").style.display= "none";
}

/* No s'utilitzen

function select_year(){
	post('/select_year', {year_selected: document.getElementById("myDropdown").value}, 'POST');
}

function nextPage(i){
	var numpage = i+1;
	post('show_users_year', {year_position: numpage}, 'POST');
}*/

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