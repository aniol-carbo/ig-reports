function openDerivation() {
	post('/user_derivation', {}, 'POST');
}

function delete_derivation() {
	post('/delete_derivation', {}, 'POST');
}

function openMedicalReport() {
	post('/user_medical_report', {}, 'POST');
}

function delete_medical_report() {
	post('/delete_medical_report', {}, 'POST');
}

function openLearned() {
	post('/user_learned', {}, 'POST');
}

function delete_learned() {
	post('/delete_learned', {}, 'POST');
}

function openValoration() {
	post('/user_valoration', {}, 'POST');
}

function function_blocked(){
	document.getElementById("loader").style.visibility = "visible";
	document.getElementById("user").style.display= "none";
	document.getElementById("user2").style.display= "none";
	document.getElementById("inf_basica").className = "nav-link disabled";
	document.getElementById("fotos").className = "nav-link disabled";
	document.getElementById("planols").className = "nav-link disabled";
	document.getElementById("gestio").className = "nav-link disabled";
	document.getElementById("questionari").className = "nav-link disabled";
	document.getElementById("inici").className = "nav-link disabled";
}

function function_blocked_valoration(){
	document.getElementById("loader").style.visibility = "visible";
	document.getElementById("btn_guardar").style.display= "none";
	document.getElementById("valoracio").style.display= "none";
	document.getElementById("inf_basica").className = "nav-link disabled";
	document.getElementById("fotos").className = "nav-link disabled";
	document.getElementById("planols").className = "nav-link disabled";
	document.getElementById("gestio").className = "nav-link disabled";
	document.getElementById("questionari").className = "nav-link disabled";
	document.getElementById("inici").className = "nav-link disabled";
}

function function_blocked_pdf(){
	document.getElementById("loader").style.visibility = "visible";
	document.getElementById("pdf_file").style.display= "none";
	document.getElementById("inf_basica").className = "nav-link disabled";
	document.getElementById("fotos").className = "nav-link disabled";
	document.getElementById("planols").className = "nav-link disabled";
	document.getElementById("gestio").className = "nav-link disabled";
	document.getElementById("questionari").className = "nav-link disabled";
	document.getElementById("inici").className = "nav-link disabled";
}

function send_data() {
	var nota = document.getElementById("nota").value;
	var MATCVI = document.getElementById("MATCVI").value;
	var VAC = document.getElementById("VAC").value;
	var MOB = document.getElementById("MOB").value;
	var VidaDiaria = document.getElementById("VidaDiaria").value;
	var OBS = document.getElementById("OBS").value;
	var INC = document.getElementById("INC").value;
	post('/update_valoration', {nota: nota, MATCVI: MATCVI, VAC: VAC, MOB: MOB, VidaDiaria: VidaDiaria, OBS: OBS, INC: INC}, 'POST');
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