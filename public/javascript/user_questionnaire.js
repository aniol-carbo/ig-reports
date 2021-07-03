function send_data() {
	var table = document.getElementById("myTable");
	var tr = table.getElementsByTagName("tr");
	var questions = new Array();
	var respostes1 = new Array();
	var respostes2 = new Array();
	var respostes3 = new Array();
	for (var i = 0; i < tr.length - 1; ++i){
		questions.push(document.getElementById("Question"+i).innerText.replace(/\s/g, ""));
		respostes1.push(document.getElementById("Reponse1"+i).value);
		respostes2.push(document.getElementById("Reponse2"+i).value);
		respostes3.push(document.getElementById("Reponse3"+i).value);
	}
	post('/update_report_visit', {questions: questions, respostes1: respostes1, respostes2: respostes2, respostes3: respostes3}, 'POST');
}

function send_data_tracking() {
	var table = document.getElementById("myTable");
	var tr = table.getElementsByTagName("tr");
	var questions = new Array();
	var respostes1 = new Array();
	var respostes2 = new Array();
	var respostes3 = new Array();
	for (var i = 0; i < tr.length - 1; ++i){
		questions.push(document.getElementById("Question"+i).innerText.replace(/\s/g, ""));
		respostes1.push(document.getElementById("Reponse1"+i).value);
		respostes2.push(document.getElementById("Reponse2"+i).value);
		respostes3.push(document.getElementById("Reponse3"+i).value);
	}
	post('/update_tracking', {questions: questions, respostes1: respostes1, respostes2: respostes2, respostes3: respostes3}, 'POST');
}

function send_data_imss() {
	var table = document.getElementById("myTable");
	var tr = table.getElementsByTagName("tr");
	var questions = new Array();
	var respostes1 = new Array();
	var respostes3 = new Array();
	for (var i = 0; i < tr.length - 1; ++i){
		questions.push(document.getElementById("Question"+i).innerText.replace(/\s/g, ""));
		respostes1.push(document.getElementById("Reponse1"+i).value);
		respostes3.push(document.getElementById("Reponse3"+i).value);
	}
	post('/update_imss', {questions: questions, respostes1: respostes1, respostes3: respostes3}, 'POST');
}

function function_blocked(){
	document.getElementById("inf_basica").className = "nav-link disabled";
	document.getElementById("fotos").className = "nav-link disabled";
	document.getElementById("planols").className = "nav-link disabled";
	document.getElementById("gestio").className = "nav-link disabled";
	document.getElementById("questionari").className = "nav-link disabled";
	document.getElementById("inici").className = "nav-link disabled";
	document.getElementById("loader").style.visibility = "visible";
	document.getElementById("btn_questionnaire").style.display= "none";
	document.getElementById("questionnaire").style.display= "none";
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