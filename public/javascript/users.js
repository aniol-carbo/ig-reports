function select_user(x){
	post('/search_user', {id: x}, 'POST');
}

function select_user_and_year(x,y){
	post('/search_user_and_year', {id: x, year: y}, 'POST');
}

function show_list(list){
	post('/show_list', {list: list}, 'POST');
}

function advancedSearch(){
	post('/show_users', {treballador: document.getElementById("myDropdown").value, data: document.getElementById("myCalendar").value}, 'POST');
}

function backToLogin(){
	post('/back_to_main', {}, 'POST');
}

function backToMutuals(){
	post('/back_to_mutuals', {}, 'POST');
}

function function_blocked(){
	document.getElementById("loader").style.visibility = "visible";
	document.getElementById("users").style.display= "none";
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

function filterUser() {
	var td, i, t;
	var input = document.getElementById("myInput");
	var filter = input.value.toUpperCase();
	var table = document.getElementById("myTable");
	var tr = table.getElementsByTagName("tr");
	for (i = 1; i < tr.length; i++) {
		var filtered = false;
		var tds = tr[i].getElementsByTagName("td");
		for(t=0; t<tds.length; t++) {
			var td = tds[t];
			if (td) {
				if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
					filtered = true;
				}
			}     
		}
		if(filtered===true) {
			tr[i].style.display = '';
		}
		else {
			tr[i].style.display = 'none';
		}
	}
}