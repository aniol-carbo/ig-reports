function select_intervention(id){
	post('/generate_intervention', {id: id}, 'POST');
}

function select_order(id){
	post('/generate_order', {id: id}, 'POST');
}

function select_budget(id){
	post('/generate_budget', {id: id}, 'POST');
}

function select_invoice(id){
	post('/generate_invoice', {id: id}, 'POST');
}

function select_final_report(id){
	post('/generate_informe_final', {id: id}, 'POST');
}

function send_mail_intervention(){
	post('/send_mail_intervention', {receiver: document.getElementById("receiver").value, subject: document.getElementById("subject").value, text: document.getElementById("text").value}, 'POST');
}

function send_mail_budget(){
	post('/send_mail_budget', {receiver: document.getElementById("receiver").value, subject: document.getElementById("subject").value, text: document.getElementById("text").value}, 'POST');
}

function send_mail_invoice(){
	post('/send_mail_invoice', {receiver: document.getElementById("receiver").value, subject: document.getElementById("subject").value, text: document.getElementById("text").value}, 'POST');
}

function send_mail_order(){
	post('/send_mail_order', {receiver: document.getElementById("receiver").value, subject: document.getElementById("subject").value, text: document.getElementById("text").value}, 'POST');
}

function send_mail_report(){
	post('/send_mail_final_report', {receiver: document.getElementById("receiver").value, subject: document.getElementById("subject").value, text: document.getElementById("text").value}, 'POST');
}

function add_mail(){
	if (document.getElementById("receiver").value == "") document.getElementById("receiver").value = document.getElementById("myDropdown").value;
	else document.getElementById("receiver").value = document.getElementById("receiver").value + "; " + document.getElementById("myDropdown").value;
}

function function_blocked(){
	document.getElementById("inf_basica").className = "nav-link disabled";
	document.getElementById("fotos").className = "nav-link disabled";
	document.getElementById("planols").className = "nav-link disabled";
	document.getElementById("gestio").className = "nav-link disabled";
	document.getElementById("questionari").className = "nav-link disabled";
	document.getElementById("inici").className = "nav-link disabled";
	document.getElementById("loader").style.visibility = "visible";
	document.getElementById("final_report").style.display= "none";
	document.getElementById("documentation").style.display= "none";
}

function function_blocked_documentation(){
	document.getElementById("loader").style.visibility = "visible";
	document.getElementById("documentation").style.display= "none";
}

function generate_final_report(final_report){
	if (final_report){
		var x = confirm("Vols generar un informe final nou?");
		if (x){
			post('/generate_final_report', null, 'POST');
		}
	}
}

function generate_migration(path){
	//if(path != ""){
		var x = confirm("Vols generar una migració?");
		if (x){
			post('/generate_migration', null , 'POST');
		}
	//}
}

function download_final_report(){
	post('/download_final_report', null, 'POST');
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