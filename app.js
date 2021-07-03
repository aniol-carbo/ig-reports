const http = require('http');
const express = require('express');
const httpsPort = 3000;
const https = require('https');
const router = express.Router();
const path = require('path');
const body_parser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const rimraf = require('rimraf');
const multer = require('multer');
const alert = require('alert');
const docxConverter = require('docx-pdf');
const { PDFNet } = require('@pdftron/pdfnet-node');

const database = require('./database/mssql');
const documents = require('./documents/documents');
const mail = require('./documents/mail');
const docx = require('./documents/docx');
const xlsx = require('./documents/xlsx');
const docxtemplate = require('./documents/docxtemplate');
const pdfreader = require('./public/javascript/pdfreader');
const gateway = require('./public/javascript/gtw_client');
const igData = require('./public/javascript/igData');

var username = "";
var password = "";


var app = express();

// -----------------------------------------------------
// ---------------------INICIALIZE----------------------
// -----------------------------------------------------

// Vector de cada any (S'ha d'anar actualitzant per cada projecte que es realitza al CVI)
const anys = ['CVI_2012_A', 'CVI_2013', 'CVI_2014', 'CVI_2015', 'CVI2016', 'CVI2017', 'CVI2018', 'CVI2019', 'CVI2020', 'CVISALUT', 'CVICornella', 'CVIMollet', 'CVIMontornes', 'CVIPolinya', 'CVIprovaApp', 'CVI2020prova'];

// Claus de seguretat
const options = {
	key: fs.readFileSync('./key.pem', 'utf8'),
	cert: fs.readFileSync('./server.crt', 'utf8')
};

// Inicialitzador
var secureServer = https.createServer(options, app).listen(httpsPort, () => {
	console.log("Listening at port " + httpsPort);
	database.initDBs(anys);
});

// Iniciar sessió per a cada usuari
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(express.static(path.join(__dirname, 'public')));
app.use(body_parser.urlencoded({extended:true}));

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

const storage = multer.diskStorage({
	destination: __dirname + '/upload/',
	filename: function(req, file, cb){
		cb(null, Date.now() + '-' + file.originalname);
	}
});

// Limitar el tamany màxim de les fotografies a 10MB
const upload = multer({
	storage: storage,
	limits:{fileSize: 10 * 1024 * 1024} 
});

// -----------------------------------------------------
// --------------------GET FUNCTION---------------------
// -----------------------------------------------------

app.get('/', function (req, res) {
	res.redirect('/login');
});

app.get('/login', function (req, res){
	res.render('login');
});

app.get('/main', function (req, res){
	// if (req.session.user == null) res.redirect('/login');
	// // En el cas que no existeixi cap directori s'en crea un.
	// if (req.session.any != null){
	// 	if (!fs.existsSync('../' + req.session.any)){
	// 		 fs.mkdirSync('../' + req.session.any);
	// 		 fs.mkdirSync('../' + req.session.any + '/Assabentats');
	// 		 fs.mkdirSync('../' + req.session.any + '/Derivacio');
	// 		 fs.mkdirSync('../' + req.session.any + '/Documents');
	// 		 fs.mkdirSync('../' + req.session.any + '/FinalPhotos');
	// 		 fs.mkdirSync('../' + req.session.any + '/InitialPhotos');
	// 		 fs.mkdirSync('../' + req.session.any + '/Plans');
	// 	}
	// }
	res.render('main');
});

app.get('/pre_customer_list', function (req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getDistricts(function (result){
		res.render('pre_customer_list', {data_district: result.recordset, any: req.session.any});
	});
});


app.get('/seeker', function (req,res){
	if (req.session.user == null) res.redirect('/login');
	if (req.session.any == undefined) req.session.any = '';
	database.db[req.session.any].getAllUsers(anys, function (result, i) {
		res.render('seeker', { data: result.recordset });
	});
});

app.get('/mutuals', function (req,res){
	if (req.session.user == null) res.redirect('/login');
	igData.get_mutuals_info(req.session.user,req.session.password).then(function(result){
		res.render('mutuals', {info: result});
	}).catch(error => console.log(error))
});

app.get('/suspicious', function (req,res){
	if (req.session.user == null) res.redirect('/login');
	if(req.session.suspicious == undefined) res.render('suspicious', {info: undefined, username: ""});
	else{
		igData.get_suspicious_info(req.session.user,req.session.password,req.session.suspicious).then(function(result){
			res.render('suspicious', {info: result, username: req.session.suspicious});
		}).catch(error => console.log(error))
	}
});

app.get('/media_info', function (req,res){
	if (req.session.user == null) res.redirect('/login');
	// if(req.session.totalmedia == undefined){
	// 	igData.get_media_info(req.session.user,req.session.password).then(function(result){
	// 		res.render('media_info', {info: result});
	// 	}).catch(error => console.log(error))
	// }
	// else{
	// 	igData.get_media_info(req.session.user,req.session.password,req.session.totalmedia).then(function(result){
	// 		res.render('media_info', {info: result, totalmedia: req.session.totalmedia});
	// 	}).catch(error => console.log(error))
	// }
	igData.get_media_info(req.session.user,req.session.password,req.session.totalmedia).then(function(result){
		res.render('media_info', {info: result});
	}).catch(error => console.log(error))
});

app.get('/users', function (req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getWorkers(function (result2){
		database.db[req.session.any].getUsers(req.session.data, req.session.treballador, function (result){
			res.render('users', {data: result.recordset, treballadors: result2.recordset, any: req.session.any});
		});
	});
});

app.get('/lists', function(req, res){
	if (req.session.user == null) res.redirect('/login');
	res.render('lists', {info: req.session.list});
});

app.get('/user', function(req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getUser(req.session.identificador, function(result){
		database.db[req.session.any].getUserBasicInformation(req.session.identificador, function(result2){
			database.db[req.session.any].getUserClientInformation(req.session.identificador, function(result3){
				database.db[req.session.any].getUserDerivatorInformation(req.session.identificador, function(result4){
					database.db[req.session.any].getUserInterventionInformation(req.session.identificador, function(result6){
						recordset = result6.recordset;
						for (let i = 0; i < recordset.length; ++i) {
							for (let j = i+1; j < recordset.length; ++j) {
								if (recordset[i].TimeStart == recordset[j].TimeStart) {
									recordset[i].saNom += ', ' + recordset[j].saNom
									recordset.splice(j, 1)
								}
							}
						}
						database.db[req.session.any].getUserProductInformation(req.session.identificador, function(result7){
							
							let errorFormat1 = '{\\rtf1\\ansi\\ansicpg1252\\deff0{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}\r\n\\viewkind4\\uc1\\pard\\lang3082\\fs20 ';
							let errorFormat2 = '{\\rtf1\\ansi\\ansicpg1252\\deff0{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}\r\n{\\colortbl ;\\red0\\green0\\blue0;}\r\n\\viewkind4\\uc1\\pard\\nowidctlpar\\cf1\\lang1027\\kerning28\\fs20 ';
							for (let i = 0; i < result7.recordset.length; ++i) {
								if (result7.recordset[i].alLibCom.includes(errorFormat1)) {
									result7.recordset[i].alLibCom = result7.recordset[i].alLibCom.replace(errorFormat1, '');
									result7.recordset[i].alLibCom = result7.recordset[i].alLibCom.replace('\\par }', '');
								}
								if (result7.recordset[i].alLibCom.includes(errorFormat2)) {
									result7.recordset[i].alLibCom = result7.recordset[i].alLibCom.replace(errorFormat2, '');
									result7.recordset[i].alLibCom = result7.recordset[i].alLibCom.replace(' \\par \\pard\\cf0\\kerning0 \\par }', '');
								}
							}
							res.render('user', {data: result.recordset[0], data_basic_information: result2.recordset, data_client_information: result3.recordset[0], data_derivator_information: result4.recordset[0], data_intervention_information: recordset, data_products_information: result7.recordset});
						});
					});
				});
			});
		});
	});
});

app.get('/user_photo', function(req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getUser(req.session.identificador, function(result){
		if (!fs.existsSync('../' + req.session.any + '/InitialPhotos/' + req.session.identificador)) fs.mkdirSync('../' + req.session.any + '/InitialPhotos/' + req.session.identificador);
		if (!fs.existsSync('../' + req.session.any + '/FinalPhotos/' + req.session.identificador)) fs.mkdirSync('../' + req.session.any + '/FinalPhotos/' + req.session.identificador);
		fs.readdir('../' + req.session.any + '/InitialPhotos/' + req.session.identificador, (err, fotos_inicials) => {
			fs.readdir('../' + req.session.any + '/FinalPhotos/' + req.session.identificador, (err, fotos_finals) => {
				// Si existeix un directori de l'usuari amb contingut s'elimina.
				if (fs.existsSync('./public/images/' + req.session.user + '/photos/')){
					rimraf.sync('./public/images/' + req.session.user + '/photos/');
				}
				fs.mkdirSync('./public/images/' + req.session.user + '/photos/', {recursive:true}, err => {});
				for (i = 0; i < fotos_inicials.length; ++i){
					fs.copyFileSync('../' + req.session.any + '/InitialPhotos/' + req.session.identificador + '/' + fotos_inicials[i], './public/images/' + req.session.user + '/photos/' + fotos_inicials[i], function(err){
						if (err) throw err;
					});
				}
				for (i = 0; i < fotos_finals.length; ++i){
					fs.copyFileSync('../' + req.session.any + '/FinalPhotos/' + req.session.identificador + '/' + fotos_finals[i], './public/images/' + req.session.user + '/photos/' + fotos_finals[i], function(err){
						if (err) throw err;
					});
				}
				console.log(result.recordset[0])
				console.log(fotos_inicials)
				console.log(fotos_finals)
				console.log(req.session.user)
				res.render('user_photo', {data: result.recordset[0], inicials: fotos_inicials, finals: fotos_finals, user: req.session.user});
			});
		});
	});
});

app.get('/user_flat', function(req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getUser(req.session.identificador, function(result){
		if (!fs.existsSync('../' + req.session.any + '/Plans/' + req.session.identificador)) fs.mkdirSync('../' + req.session.any + '/Plans/' + req.session.identificador);
		fs.readdir('../' + req.session.any + '/Plans/' + req.session.identificador, (err, planols) => {
			// Si existeix un directori de l'usuari amb contingut s'elimina.
			if (fs.existsSync('./public/images/' + req.session.user + '/plans/')){
				rimraf.sync('./public/images/' + req.session.user + '/plans/');
			}
			fs.mkdirSync('./public/images/' + req.session.user + '/plans/', {recursive:true}, err => {});
			for (i = 0; i < planols.length; ++i){
				fs.copyFileSync('../' + req.session.any + '/Plans/' + req.session.identificador + '/' + planols[i], './public/images/' + req.session.user + '/plans/' + planols[i], function(err){
					if (err) throw err;
				});
			}
			res.render('user_flat', {data: result.recordset[0], planols: planols, user: req.session.user});
		});
	});
});

app.get('/user_valoration', function(req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getUser(req.session.identificador, function(result){
		database.db[req.session.any].checkUserValoration(req.session.identificador, function (result2){
			if (result2.recordset[0].diff == 1){
				database.db[req.session.any].getUserValoration(req.session.identificador, function(result3){
					result3.recordset[0].nota = result3.recordset[0].nota.replace(/\+/g, ' ');
					result3.recordset[0].MATCVI = result3.recordset[0].MATCVI.replace(/\+/g, ' ');
					result3.recordset[0].VAC = result3.recordset[0].VAC.replace(/\+/g, ' ');
					result3.recordset[0].MOB = result3.recordset[0].MOB.replace(/\+/g, ' ');
					result3.recordset[0].VidaDiaria = result3.recordset[0].VidaDiaria.replace(/\+/g, ' ');
					result3.recordset[0].OBS = result3.recordset[0].OBS.replace(/\+/g, ' ');
					result3.recordset[0].INC = result3.recordset[0].INC.replace(/\+/g, ' ');
					//Els camps que falten a incidencia s'haurien d'afegir aqui, pero he de saber el nom que tenen a la BD
					res.render('user_valoration', {data: result.recordset[0], data_valoracio: result3.recordset[0]});
				});
			}
			else {
				database.db[req.session.any].insertValoration(req.session.identificador, function(result3){
					res.redirect('/user_valoration');
				});
			}
		});
	});
});

app.get('/user_derivation', function(req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getUser(req.session.identificador, function(result){
		if (!fs.existsSync('../' + req.session.any + '/Derivacio/' + req.session.identificador)) fs.mkdirSync('../' + req.session.any + '/Derivacio/' + req.session.identificador);
		fs.readdir('../' + req.session.any + '/Derivacio/' + req.session.identificador, (err) => {
			// Si existeix un directori de l'usuari amb contingut s'elimina.
			if (fs.existsSync('./public/images/' + req.session.user + '/Derivacio/')){
				rimraf.sync('./public/images/' + req.session.user + '/Derivacio/');
			}
			fs.mkdirSync('./public/images/' + req.session.user + '/Derivacio/', {recursive:true}, err => {});
			var file_exists = null;
			if (fs.existsSync('../' + req.session.any + '/Derivacio/' + req.session.identificador + '/DE00001.pdf')){
				file_exists = 1;
				fs.copyFileSync('../' + req.session.any + '/Derivacio/' + req.session.identificador + '/DE00001.pdf', './public/images/' + req.session.user + '/Derivacio/DE00001.pdf', function(err){
					if (err) throw err;
				});
			}
			res.render('user_derivation', {data: result.recordset[0], f_exists: file_exists, user: req.session.user});
		});
	});
});

app.get('/user_medical_report', function(req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getUser(req.session.identificador, function(result){
		if (!fs.existsSync('../' + req.session.any + '/Derivacio/' + req.session.identificador)) fs.mkdirSync('../' + req.session.any + '/Derivacio/' + req.session.identificador);
		fs.readdir('../' + req.session.any + '/Derivacio/' + req.session.identificador, (err) => {
			// Si existeix un directori de l'usuari amb contingut s'elimina.
			if (fs.existsSync('./public/images/' + req.session.user + '/Derivacio/')){
				rimraf.sync('./public/images/' + req.session.user + '/Derivacio/');
			}
			fs.mkdirSync('./public/images/' + req.session.user + '/Derivacio/', {recursive:true}, err => {});
			var file_exists = null;
			if (fs.existsSync('../' + req.session.any + '/Derivacio/' + req.session.identificador + '/DE00002.pdf')){
				file_exists = 1;
				fs.copyFileSync('../' + req.session.any + '/Derivacio/' + req.session.identificador + '/DE00002.pdf', './public/images/' + req.session.user + '/Derivacio/DE00002.pdf', function(err){
					if (err) throw err;
				});
			}
			res.render('user_medical_report', {data: result.recordset[0], f_exists: file_exists, user: req.session.user});
		});
	});
});

app.get('/user_learned', function(req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getUser(req.session.identificador, function(result){
		if (!fs.existsSync('../' + req.session.any + '/Assabentats/' + req.session.identificador)) fs.mkdirSync('../' + req.session.any + '/Assabentats/' + req.session.identificador);
		fs.readdir('../' + req.session.any + '/Assabentats/' + req.session.identificador, (err, assabentat) => {
			// Si existeix un directori de l'usuari amb contingut s'elimina.
			if (fs.existsSync('./public/images/' + req.session.user + '/Assabentats/')){
				rimraf.sync('./public/images/' + req.session.user + '/Assabentats/');
			}
			fs.mkdirSync('./public/images/' + req.session.user + '/Assabentats/', {recursive:true}, err => {});
			if (fs.existsSync('../' + req.session.any + '/Assabentats/' + req.session.identificador + '/' + assabentat[0])){
				fs.copyFileSync('../' + req.session.any + '/Assabentats/' + req.session.identificador + '/' + assabentat[0], './public/images/' + req.session.user + '/Assabentats/' + assabentat[0], function(err){
					if (err) throw err;
				});
			}
			res.render('user_learned', {data: result.recordset[0], assabentat: assabentat, user: req.session.user});
		});
	});
});

app.get('/user_documentation', function(req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getUser(req.session.identificador, function(result){
		database.db[req.session.any].getIntervention(req.session.identificador, function(result2){
			database.db[req.session.any].getBudget(req.session.identificador, function(result3){
				database.db[req.session.any].getOrder(req.session.identificador, function(result4){
					database.db[req.session.any].getInvoice(req.session.identificador, function(result5){
						let final_report = true;
						const pathFile = '../' + req.session.any + '/Documents/' + req.session.identificador + '/IF' + (req.session.identificador).substring(2) + '.docx';
						if (!fs.existsSync(pathFile)){
							final_report = false;
						}
						res.render('user_documentation', {data: result.recordset[0], data_intervention: result2.recordset, data_budget: result3.recordset, data_order: result4.recordset, data_invoice: result5.recordset, final_report: final_report});
					});
				});
			});
		});
	});
});

app.get('/gestio_intervention', function(req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getUser(req.session.identificador, function(result){
		database.db[req.session.any].getFullIntervention(req.session.document, function(result2){
			database.db[req.session.any].getFullInterventionWorkerName(req.session.document, function(result3){
				database.db[req.session.any].getMailConstructor(function(result4){
					documents.generateIntervention(req.session.any, req.session.identificador, req.session.document, req.session.user, result2.recordset[0], result3.recordset, function (intervencio){
						// console.log(result4.recordset)
						// var newmail = { foFactMail: 'aniol.carbo@upc.edu'}
						// result4.recordset.push(newmail)
						// console.log(result4.recordset)
						res.render('gestio_intervention', {data: result.recordset[0], intervencio: intervencio, user: req.session.user, correus: result4.recordset});
					});
				});
			});
		});
	});
});

app.get('/gestio_order', function(req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getUser(req.session.identificador, function(result){
		database.db[req.session.any].getFullOrder(req.session.document, function(result2){
			database.db[req.session.any].getFullOrderProduct(req.session.document, function(result3){
				database.db[req.session.any].getFullOrderPrice(req.session.document, function(result4){
					database.db[req.session.any].getMailConstructor(function(result5){
						documents.generateOrder(req.session.any, req.session.identificador, req.session.document, req.session.user, result2.recordset[0], result3.recordset, result4.recordset[0], function (comanda){
							res.render('gestio_order', {data: result.recordset[0], comanda: comanda, user: req.session.user, correus: result5.recordset});
						});
					});
				});
			});
		});
	});
});

app.get('/gestio_budget', function(req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getUser(req.session.identificador, function(result){
		database.db[req.session.any].getFullBudget(req.session.document, function(result2){
			database.db[req.session.any].getFullBudgetProduct(req.session.document, function(result3){
				database.db[req.session.any].getFullBudgetPrice(req.session.document, function(result4){
					database.db[req.session.any].getMailConstructor(function(result5){
						documents.generateBudget(req.session.any, req.session.identificador, req.session.document, req.session.user, result2.recordset[0], result3.recordset, result4.recordset[0], function (pressupost){
							res.render('gestio_budget', {data: result.recordset[0], pressupost: pressupost, user: req.session.user, correus: result5.recordset});
						});
					});
				});
			});
		});
	});
});

app.get('/gestio_invoice', function(req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getUser(req.session.identificador, function(result){
		database.db[req.session.any].getFullInvoice(req.session.document, function(result2){
			database.db[req.session.any].getFullInvoiceProduct(req.session.document, function(result3){
				database.db[req.session.any].getFullInvoicePrice(req.session.document, function(result4){
					database.db[req.session.any].getMailConstructor(function(result5){
						documents.generateInvoice(req.session.any, req.session.identificador, req.session.document, req.session.user, result2.recordset[0], result3.recordset, result4.recordset[0], function (factura){
							res.render('gestio_invoice', {data: result.recordset[0], factura: factura, user: req.session.user, correus: result5.recordset});
						});
					});
				});
			});
		});
	});
});

app.get('/gestio_final_report', function(req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getUser(req.session.identificador, function(result){
		database.db[req.session.any].getUserBasicInformation(req.session.identificador, function(result1){
			database.db[req.session.any].getFullFinalReport(req.session.identificador, function(result2){
				if (!fs.existsSync('../' + req.session.any + '/InitialPhotos/' + req.session.identificador)) fs.mkdirSync('../' + req.session.any + '/InitialPhotos/' + req.session.identificador);
				if (!fs.existsSync('../' + req.session.any + '/FinalPhotos/' + req.session.identificador)) fs.mkdirSync('../' + req.session.any + '/FinalPhotos/' + req.session.identificador);
				if (!fs.existsSync('../' + req.session.any + '/Documents/' + req.session.identificador)) fs.mkdirSync('../' + req.session.any + '/Documents/' + req.session.identificador);
				fs.readdir('../' + req.session.any + '/InitialPhotos/' + req.session.identificador, (err, fotos_inicials) => {
					fs.readdir('../' + req.session.any + '/FinalPhotos/' + req.session.identificador, (err, fotos_finals) => {
						database.db[req.session.any].getFullFinalReportProducts(req.session.identificador, function(result3){
							docxtemplate.createInformeFinal(result.recordset[0], result1.recordset[0], result2.recordset[0], result3.recordset, fotos_inicials, fotos_finals, req.session.user, req.session.any, function(){
								//res.download('../' + req.session.any + '/Documents/' + req.session.identificador + '/IF' + (req.session.identificador).substring(2) + '.docx');
								res.redirect('/user_documentation')
							});
						});
					});
				});
			});
		});
	});
});

app.get('/gestio_migracio', function(req, res) {
	if (req.session.user == null) res.redirect('/login');
	fs.readdir('./public/images/' + req.session.user + '/Migracions/Pendents/', (err,migracions_pendents) => {
		const data = [];
		for(var i = 0; i < migracions_pendents.length ; i++){
			var filename = migracions_pendents[i];
			var filepath = './public/images/' + req.session.user + '/Migracions/Pendents/' + filename;
			pdfreader.migrarPdf(filepath, filename, req.session.user, function(result){
				var ciutat = result.city;
				gateway.mapFields(ciutat, result, function(any, result2){
					data.push(result2);
					if(i == (migracions_pendents.lenght-1)){
						database.db[any].getTotalClients(function(result1){
							database.db[any].insertClients(req.session.identificador, result1.recordset[0].total, data, function(result4){
								//console.log(result4);
							});
						//console.log(result2);
						});
					}
					//console.log(any)
					// database.db[any].getTotalClients(function(result1){
					// 	database.db[any].insertClients(req.session.identificador, result1.recordset[0].total, result2, function(result4){
					// 		//console.log(result4);
					// 	});
					// //console.log(result2);
					// });
				});
				//console.log(result);
			});
		}
	})
	res.redirect('/migrator');
});


app.get('/gestio_informe_final', function(req, res) {
	let inputPath = '../' + req.session.any + '/Documents/' + req.session.identificador + '/IF' + (req.session.identificador).substring(2) + '.docx';
	//let outputPath = '../' + req.session.any + '/Documents/' + req.session.identificador + '/IF' + (req.session.identificador).substring(2) + '.pdf';
	let outputDoc = 'IF' + (req.session.identificador).substring(2) + '.pdf';
	let outputPath = 'public/images/' + req.session.user + '/Documents/' + outputDoc;
	database.db[req.session.any].getUser(req.session.identificador, function(result){
		database.db[req.session.any].getMailConstructor(function(result5){
			docxConverter(inputPath,outputPath,function(err,resultpdf){
				if(err){
				   console.log(err);
				}
				res.render('gestio_informe_final', {data: result.recordset[0], informe: outputDoc, user: req.session.user, correus: result5.recordset});
			});

			// const convertToPdf = async () => {
			// 	const pdfdoc = await PDFNet.PDFDoc.create();
			// 	await pdfdoc.initSecurityHandler();
			// 	await PDFNet.Convert.toPdf(pdfdoc,inputPath)
			// 	pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
			// }
			// PDFNet.runWithCleanup(convertToPdf).then(() => {
			// 	fs.readFile(outputPath, (err,data) => {
			// 		if (err){
			// 			console.log(err)
			// 		}
			// 		else{
			// 			console.log("success")
			// 			res.render('gestio_informe_final', {data: result.recordset[0], informe: outputDoc, user: req.session.user, correus: result5.recordset});
			// 		}
			// 	})
			// }).catch(err => {
			// 	console.log(err)
			// });
		});
	});
	
});

app.get('/user_questionnaire', function(req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getUser(req.session.identificador, function(result){
		database.db[req.session.any].checkUserQuestionnairesQuestions(req.session.identificador, function(result2){
			if(result2.recordset[0].diff == 0){
				database.db[req.session.any].getQuestionnairesQuestions(req.session.identificador, function(result3){
					res.render('user_questionnaire', {data: result.recordset[0], data_preguntes: result3.recordset});
				});
			}
			else {
				database.db[req.session.any].getTotalQuestionnairesQuestions(function(result3){
					database.db[req.session.any].insertQuestionairesQuestions(req.session.identificador, result2.recordset[0].total, result3.recordset[0].total, function(result4){
						res.redirect('/user_questionnaire');
					});
				});
			}
		});
	});
});

app.get('/user_questionnaire_tracking', function(req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getUser(req.session.identificador, function(result){
		database.db[req.session.any].checkUserQuestionnairesQuestionsTracking(req.session.identificador, function(result2){
			if(result2.recordset[0].diff == 0){
				database.db[req.session.any].getQuestionnairesQuestions(req.session.identificador, function(result3){
					database.db[req.session.any].getQuestionnairesQuestionsTracking(req.session.identificador, function(result4){
						res.render('user_questionnaire_tracking', {data: result.recordset[0], data_preguntes: result3.recordset, data_seguiment: result4.recordset});
					});
				});
			}
			else {
				database.db[req.session.any].getTotalQuestionnairesQuestions(function(result3){
					database.db[req.session.any].insertQuestionairesQuestionsTracking(req.session.identificador, result2.recordset[0].total, result3.recordset[0].total, function(result4){
						res.redirect('/user_questionnaire_tracking');
					});
				});
			}
		});
	});
});

app.get('/user_questionnaire_imss', function(req, res){
	if (req.session.user == null) res.redirect('/login');
	database.db[req.session.any].getUser(req.session.identificador, function(result){
		database.db[req.session.any].getQuestionnairesQuestionsImss(req.session.identificador, function(result2){
			if (result2.recordset.length > 0){
				res.render('user_questionnaire_imss', {data: result.recordset[0], data_preguntes: result2.recordset});
			}
			else{
				// Aixó s'ha de modificar cada vegada que vulguin afegir una nova pregunta a IMSS de Qüestionari
				var total = 5;
				database.db[req.session.any].getTotalQuestionnairesQuestions(function(result3){
					database.db[req.session.any].insertQuestionairesQuestionsImss(req.session.identificador, total, result3.recordset[0].total, function(result4){
						res.redirect('/user_questionnaire_imss');
					});
				});
			}
		});
	});
});

// -----------------------------------------------------
// --------------------POST FUNCTION--------------------
// -----------------------------------------------------

// ------------------------ACCES------------------------

app.post('/login_access', function (req, res){
	username = req.body.name;
	password = req.body.psw;
	req.session.user = req.body.name;
	req.session.password = req.body.psw;
	req.session.save();
	// req.session.save();
	// database.checkUsers(req.body.name, req.body.psw, function(failed){
	// 	if (!failed){
	// 		res.redirect('/main');
	// 	} else{
	// 		alert('Login failed');
			res.redirect('/main');
	// 	}
	// });
});



app.post('/log_out', function(req, res){
	res.redirect('/login');
	database.logOutUser(req.session.user, function(){
		req.session.destroy();
	});
});

// ------------------------FOTOS------------------------

app.post('/upload_inital_photo', upload.single('myFile'), function (req, res){
	if (req.file != null && req.file.filename != null){
		fs.copyFile(__dirname + '/upload/' + req.file.filename, '../' + req.session.any + '/InitialPhotos/' + req.session.identificador + '/' + req.file.filename, (err) => {
			rimraf.sync(__dirname + '/upload/' + req.file.filename);
			if (err) throw err;
		});
	} else {
		alert('No has seleccionat cap fotografia');
	}
	res.redirect('/user_photo');
});

app.post('/upload_final_photo', upload.single('myFile'), function (req, res){
	if (req.file != null && req.file.filename != null){
		fs.copyFile(__dirname + '/upload/' + req.file.filename, '../' + req.session.any + '/FinalPhotos/' + req.session.identificador + '/' + req.file.filename, (err) => {
			rimraf.sync(__dirname + '/upload/' + req.file.filename);
			if (err) throw err;
		});
	} else{
		alert('No has seleccionat cap fotografia');
	}
	res.redirect('/user_photo');
});

app.post('/delete_initial_photo', function (req, res){
	fs.unlinkSync('../' + req.session.any + '/InitialPhotos/' + req.session.identificador + '/' + req.body.id);
	res.redirect('/user_photo');
});

app.post('/delete_final_photo', function (req, res){
	fs.unlinkSync('../' + req.session.any + '/FinalPhotos/' + req.session.identificador + '/' + req.body.id);
	res.redirect('/user_photo');
})

// -------------------------PDF------------------------

app.post('/upload_pdf', upload.single('myFile'), function (req, res){
	if (req.file != null && req.file.filename != null){
		if(!fs.existsSync('./public/images/' + req.session.user + '/Migracions/Pendents/'))  fs.mkdirSync('./public/images/' + req.session.user + '/Migracions/Pendents/');
		fs.copyFile(__dirname + '/upload/' + req.file.filename, './public/images/' + req.session.user + '/Migracions/Pendents/' + req.file.filename, (err) => {
				rimraf.sync(__dirname + '/upload/' + req.file.filename);
				if (err) throw err;
		});
	} else {
		alert('No has seleccionat cap arxiu');
	}
	res.redirect('/migrator');
});

app.post('/upload_flat', upload.single('myFile'), function (req, res){
	if (req.file.filename != null){
		fs.copyFileSync(__dirname + '/upload/' + req.file.filename, '../' + req.session.any + '/Plans/' + req.session.identificador + '/PL00001.pdf');
		rimraf.sync(__dirname + '/upload/' + req.file.filename);
	}
	res.redirect('/user_flat');
});

app.post('/delete_flat', function (req, res){
	fs.unlinkSync('../' + req.session.any + '/Plans/' + req.session.identificador + '/PL00001.pdf');
	res.redirect('/user_photo');
});

app.post('/user_derivation', function (req, res){
	res.redirect('/user_derivation');
});

app.post('/upload_derivation', upload.single('myFile'), function (req, res){
	if (req.file.filename != null){
		fs.renameSync(__dirname + '/upload/' + req.file.filename, __dirname + '/upload/DE00001.pdf');
		fs.copyFileSync(__dirname + '/upload/DE00001.pdf', '../' + req.session.any + '/Derivacio/' + req.session.identificador + '/DE00001.pdf');
		rimraf.sync(__dirname + '/upload/DE00001.pdf');
	}
	res.redirect('/user_derivation');
});

app.post('/delete_derivation', function (req, res){
	fs.unlinkSync('../' + req.session.any + '/Derivacio/' + req.session.identificador + '/DE00001.pdf');
	res.redirect('/user_derivation');
});

app.post('/user_medical_report', function (req, res){
	res.redirect('/user_medical_report');
});

app.post('/upload_medical_report', upload.single('myFile'), function (req, res){
	if (req.file.filename != null){
		fs.renameSync(__dirname + '/upload/' + req.file.filename, __dirname + '/upload/DE00002.pdf');
		fs.copyFileSync(__dirname + '/upload/DE00002.pdf', '../' + req.session.any + '/Derivacio/' + req.session.identificador + '/DE00002.pdf');
		rimraf.sync(__dirname + '/upload/DE00002.pdf');
	}
	res.redirect('/user_medical_report');
});

app.post('/delete_medical_report', function (req, res){
	fs.unlinkSync('../' + req.session.any + '/Derivacio/' + req.session.identificador + '/DE00002.pdf');
	res.redirect('/user_medical_report');
});

app.post('/user_learned', function (req, res){
	res.redirect('/user_learned');
});

app.post('/upload_learned', upload.single('myFile'), function (req, res){
	if (req.file.filename != null){
		fs.renameSync(__dirname + '/upload/' + req.file.filename, __dirname + '/upload/AS00001.pdf');
		fs.copyFileSync(__dirname + '/upload/AS00001.pdf', '../' + req.session.any + '/Assabentats/' + req.session.identificador + '/AS00001.pdf');
		rimraf.sync(__dirname + '/upload/AS00001.pdf');
	}
	res.redirect('/user_learned');
});

app.post('/delete_learned', function (req, res){
	fs.unlinkSync('../' + req.session.any + '/Assabentats/' + req.session.identificador + '/AS00001.pdf');
	res.redirect('/user_learned');
});

// -----------------------GESTIÓ------------------------

app.post('/generate_intervention', function (req, res){
	req.session.document = req.body.id;
	res.redirect('/gestio_intervention');
});

app.post('/send_mail_intervention', function (req, res){
	mail.sendIntervention(req.body.receiver, req.body.subject, req.body.text, req.session.any, req.session.identificador, req.session.document, function(){
		res.redirect('/user_documentation');
	});
});

app.post('/generate_order', function (req, res){
	req.session.document = req.body.id;
	res.redirect('/gestio_order');
});

app.post('/send_mail_order', function (req, res){
	mail.sendOrder(req.body.receiver, req.body.subject, req.body.text, req.session.any, req.session.identificador, req.session.document, function(){
		res.redirect('/user_documentation');
	});
});

app.post('/generate_budget', function (req, res){
	req.session.document = req.body.id;
	res.redirect('/gestio_budget');
});

app.post('/send_mail_budget', function (req, res){
	database.db[req.session.any].checkWorkState(req.session.identificador, function(result){
		mail.sendBudget(req.body.receiver, req.body.subject, req.body.text, req.session.any, req.session.identificador, req.session.document, function(){
			res.redirect('/user_documentation');
		});
	});
});

app.post('/generate_invoice', function (req, res){
	req.session.document = req.body.id;
	res.redirect('/gestio_invoice');
});

app.post('/send_mail_invoice', function (req, res){
	mail.sendInvoice(req.body.receiver, req.body.subject, req.body.text, req.session.any, req.session.identificador, req.session.document, function(){
		res.redirect('/user_documentation');
	});
});

app.post('/generate_final_report', function (req, res){
	res.redirect('/gestio_final_report');
})

app.post('/generate_migration', function (req, res){
	//console.log(req.body)
	res.body = req.body;
	res.redirect('/gestio_migracio');
})

// app.post('/migrate_pdf', function(req,res){
// 	console.log("a migrate_pdf el req.file es: ",req.file.filename)
// 	res.redirect('/gestio_migracio');
// })

app.post('/generate_informe_final', function (req, res){
	res.redirect('/gestio_informe_final');
})


app.post('/send_mail_final_report', function(req,res){
	mail.sendInvoice(req.body.receiver, req.body.subject, req.body.text, req.session.any, req.session.identificador, req.session.document, function(){
		res.redirect('/user_documentation');
	});
})

app.post('/download_final_report', function (req, res){
	res.download('../' + req.session.any + '/Documents/' + req.session.identificador + '/IF' + (req.session.identificador).substring(2) + '.docx');
})

// ------------------QUESTIONNAIRE--------------------


app.post('/update_report_visit', function (req, res){
	var qu, re1, re2, re3, aux;
	aux = "";
	qu = new Array();
	re1 = new Array();
	re2 = new Array();
	re3 = new Array();
	for (var i = 0; i < req.body.questions.length; ++i){
		if (req.body.questions[i] == ','){
			qu.push(aux);
			aux = "";
		}
		else aux += req.body.questions[i];
	}
	qu.push(aux);
	aux = "";
	
	for (var j = 0; j < req.body.respostes1.length; ++j){
		if (req.body.respostes1[j] == ','){
			re1.push(aux);
			aux = "";
		}
		else aux += req.body.respostes1[j];
	}
	re1.push(aux)
	aux = "";
	
	for (var k = 0; k < req.body.respostes2.length; ++k){
		if (req.body.respostes2[k] == ','){
			re2.push(aux);
			aux = "";
		}
		else aux += req.body.respostes2[k];
	}
	re2.push(aux)
	aux = "";
	
	for (var l = 0; l < req.body.respostes3.length; ++l){
		if (req.body.respostes3[l] == ','){
			re3.push(aux);
			aux = "";
		}
		else aux += req.body.respostes3[l];
	}
	re3.push(aux)
	aux = "";
	
	database.db[req.session.any].updateQuestionnairesQuestions(req.session.identificador, qu, re1, re2, re3, function(result){
		res.redirect('/user_questionnaire');
	});
});

app.post('/update_tracking', function (req, res){
	var qu, re1, re2, re3, aux;
	aux = "";
	qu = new Array();
	re1 = new Array();
	re2 = new Array();
	re3 = new Array();
	for (var i = 0; i < req.body.questions.length; ++i){
		if (req.body.questions[i] == ','){
			qu.push(aux);
			aux = "";
		}
		else aux += req.body.questions[i];
	}
	qu.push(aux);
	aux = "";
	
	for (var j = 0; j < req.body.respostes1.length; ++j){
		if (req.body.respostes1[j] == ','){
			re1.push(aux);
			aux = "";
		}
		else aux += req.body.respostes1[j];
	}
	re1.push(aux)
	aux = "";
	
	for (var k = 0; k < req.body.respostes2.length; ++k){
		if (req.body.respostes2[k] == ','){
			re2.push(aux);
			aux = "";
		}
		else aux += req.body.respostes2[k];
	}
	re2.push(aux)
	aux = "";
	
	for (var l = 0; l < req.body.respostes3.length; ++l){
		if (req.body.respostes3[l] == ','){
			re3.push(aux);
			aux = "";
		}
		else aux += req.body.respostes3[l];
	}
	re3.push(aux)
	aux = "";
	
	database.db[req.session.any].updateQuestionnairesQuestionsTracking(req.session.identificador, qu, re1, re2, re3, function(result){
		res.redirect('/user_questionnaire_tracking');
	});
});

app.post('/update_imss', function (req, res){
	var qu, re1, re3, aux;
	aux = "";
	qu = new Array();
	re1 = new Array();
	re3 = new Array();
	for (var i = 0; i < req.body.questions.length; ++i){
		if (req.body.questions[i] == ','){
			qu.push(aux);
			aux = "";
		}
		else aux += req.body.questions[i];
	}
	qu.push(aux);
	aux = "";
	
	for (var j = 0; j < req.body.respostes1.length; ++j){
		if (req.body.respostes1[j] == ','){
			re1.push(aux);
			aux = "";
		}
		else aux += req.body.respostes1[j];
	}
	re1.push(aux)
	aux = "";
	
	for (var l = 0; l < req.body.respostes3.length; ++l){
		if (req.body.respostes3[l] == ','){
			re3.push(aux);
			aux = "";
		}
		else aux += req.body.respostes3[l];
	}
	re3.push(aux)
	aux = "";
	
	database.db[req.session.any].updateQuestionnairesQuestionsImss(req.session.identificador, qu, re1, re3, function(result){
		res.redirect('/user_questionnaire_imss');
	});
});

// ----------------------ALTRES-----------------------

app.post('/select_year', function (req, res){
	req.session.any = req.body.year_selected;
	//database.db[req.session.any].changeYear(req.body.year_selected);
	res.redirect('/main');
});

app.post('/user_valoration', function (req, res){
	res.redirect('/user_valoration');
});

app.post('/update_valoration', function (req, res){
	database.db[req.session.any].updateValoration(req.session.identificador, req.body.nota, req.body.MATCVI, req.body.VAC, req.body.MOB, req.body.VidaDiaria, req.body.OBS, req.body.INC, function(result){
		res.redirect('/user_valoration');
	});
});

app.post('/search_user', function (req, res){
	req.session.identificador = req.body.id;
	res.redirect('/user');
});

app.post('/search_user_and_year', function (req, res){
	req.session.identificador = req.body.id;
	req.session.any = req.body.year;
	//database.db[req.session.any].changeYear(req.body.year);
	res.redirect('/user');
});

app.post('/show_users', function (req, res){
	req.session.data = req.body.data;
	req.session.treballador = req.body.treballador;
	res.redirect('/users');
});

app.post('/show_users_all_years', function (req, res){
	res.redirect('/seeker');
});

app.post('/show_suspicious', function (req, res){
	//username = req.body.name;
	req.session.suspicious = req.body.suspicious;
	req.session.save();
	res.redirect('/suspicious');
});

app.post('/show_media_info', function (req, res){
	req.session.totalmedia = req.body.totalmedia;
	req.session.save();
	res.redirect('/media_info');
});

app.post('/show_mutuals', function (req, res){
	res.redirect('/mutuals');
});

app.post('/show_customer_list', function (req, res){
	res.redirect('/pre_customer_list');
});

app.post('/show_customers', function (req, res){
	req.session.client = req.body.client;
	req.session.districte = req.body.districte;
	// Usuaris Pendents
	if (req.session.client == 1){
		database.db[req.session.any].getAllPendingClients(function(result){
			database.db[req.session.any].getDistricts(function(result2){
				xlsx.createExcellPendingUser(result.recordset, result2.recordset, req.session.districte, function(){
					res.download('./upload/UsuarisPendents.xlsx');
				});
			});
		});
	}
	// Usuaris Desestimats
	if (req.session.client == 2){
		database.db[req.session.any].getAllDismissedClients(function(result){
			database.db[req.session.any].getDistricts(function(result2){
				xlsx.createExcellDismissedUser(result.recordset, result2.recordset, req.session.districte, function(){
					res.download('./upload/UsuarisDesestimats.xlsx');
				});
			});
		});
	}
	// Actuacions
	if (req.session.client == 3){
		database.db[req.session.any].getAllPerformancesClients(function(result){
			database.db[req.session.any].getDistricts(function(result2){
				xlsx.createExcellPerfomancesUser(result.recordset, result2.recordset, req.session.districte, function(){
					res.download('./upload/Actuacions.xlsx');
				});
			});
		});
	}
	// Usuaris Anul·lats
	if (req.session.client == 4){
		database.db[req.session.any].getAllAbortedClients(function(result){
			database.db[req.session.any].getDistricts(function(result2){
				xlsx.createExcellAbortedUser(result.recordset, result2.recordset, req.session.districte, function(){
					res.download('./upload/Anul·lacions.xlsx');
				});
			});
		});
	}
});

app.post('/back_to_main', function (req, res){
	res.redirect('/main');
});

app.post('/back_to_mutuals', function (req, res){
	res.redirect('/mutuals');
});

app.post('/show_list', function (req, res){
	var parsedList = [];
	var username = "";
	for(var i = 0; i< req.body.list.length; i++){
		if(req.body.list[i] == ","){
			parsedList.push(username);
			username = "";
		}
		else username += req.body.list[i];

		if(i == (req.body.list.length - 1)) parsedList.push(username);
	}
	req.session.list = parsedList;
	res.redirect('/lists');
});

// -----------------------------------------------------
// --------------------START SERVER---------------------
// -----------------------------------------------------

app.use('/', router);

module.exports = app;
