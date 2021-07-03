// let fs = require('fs'),
// PDFParser = require("pdf2json");

// let pdfParser = new PDFParser();

// const m = new Map();
// var count2 = 0;

// function addToStructure(){

//     var loc_return_value = {
//         derivation:{
//         type: -1,
//         centre: "",
//         },
//         contact:{
//         name:"",
//         phone:"",
//         }
//     };

//     //Derivation centre
//     // if(m['grp_der'] == 1){
//     //   loc_return_value.derivation.type = 1;
//     //   if (m['cmb_der_css'] != -1 && m['cmb_der_css'] != 0) loc_return_value.derivation.centre = m['cmb_der_css'];
//     // }
//     // else if(m['grp_der'] == 2){
//     //   loc_return_value.derivation.type = 2;
//     //   loc_return_value.derivation.centre = m["txt_der_ABS"];
//     // }
//     // else if(m['grp_der'] == 3){
//     //   loc_return_value.derivation.type = 3;
//     // }
//     // else if(m['grp_der'] == 4){
//     //   loc_return_value.derivation.type = 4;
//     //   if (m['cmb_der_SAD_zone'] != -1 && m['cmb_der_SAD_zone'] != 0) loc_return_value.derivation.centre = m['cmb_der_SAD_zone'];
//     // }
//     // else{
//     //   loc_return_value.derivation.type = 0
//     // }
//     if(m["cmb_der_css"] == undefined){
//         if(m["txt_der_ABS"] == undefined){
//         loc_return_value.derivation.centre = m["cmb_der_SAD_zone"];
//         }
//         else loc_return_value.derivation.centre = m["txt_der_ABS"];
//     }
//     else loc_return_value.derivation.centre = m["cmd_der_css"];

//     //Derivation information
//     loc_return_value.derivation.name = m["txt_der_name"]
//     loc_return_value.derivation.profile = m["txt_der_profile"]
//     loc_return_value.derivation.phone = m["txt_der_phone"]
//     loc_return_value.derivation.mail = m["txt_der_mail"]

//     //User information
//     loc_return_value.n_exp = m["txt_user_expedient"]
//     loc_return_value.NIF = m["txt_user_DNI"]
//     loc_return_value.birth_date = m["txt_user_birth_date"] //al migrador fa cast date, pendent
//     loc_return_value.surname1 = m["txt_user_surname1"]
//     loc_return_value.surname2 = m["txt_user_surname2"]
//     loc_return_value.name = m["txt_user_name"]
//     loc_return_value.address = m["txt_user_address"]

//     //Si no te codi postal, es posa 08001
//     if(m["txt_user_ZP"] != "") loc_return_value.ZC = m["txt_user_ZP"]
//     else loc_return_value.ZC = "08001"

//     if(m["cmb_user_district"] != -1) loc_return_value.district = m["cmb_user_district"];
    
//     loc_return_value.phone = m["txt_user_phone"]
//     //Si lusuari no te numero pero la persona de contacte si, es posa com a numero de lusuari
//     if(m["txt_user_contact"] == ""){
//         if(m["txt_user_contact_phone"] != "") loc_return_value.phone = loc_return_value.phone + m["txt_user_contact_phone"]
//     }

//     //User contact information (if any)
//     if(m["txt_user_contact"] != ""){
//         loc_return_value.contact.name = m["txt_user_contact"]
//         loc_return_value.contact.phone = m["txt_user_contact_phone"]
//     }

//     //User condition information
//     loc_return_value.disability_grade = (m["cmb_condition_disability"] == 1)

//     if(m["cmb_condition_dependency"] == 1){
//         if(m["cmb_condition_dependency_GN"] != -1) loc_return_value.dependency_grade_level = m["cmb_condition_dependency_GN"]
//         else loc_return_value.dependency_grade_level = 0;
//     }
//     else{
//         loc_return_value.dependency_grade_level = -1;
//     }

//     //Scopes information
//     if(m["ckb_condition_scope_feeding"] == 1) loc_return_value.feeding = 1;
//     if(m["ckb_condition_scope_hygiene"] == 1) loc_return_value.hygiene = 1;
//     if(m["ckb_condition_scope_trasnfers"] == 1) loc_return_value.transfers = 1;
//     if(m["ckb_condition_scope_money"] == 1) loc_return_value.money = 1;
//     if(m["ckb_condition_scope_dress"] == 1) loc_return_value.dres = 1;
//     if(m["ckb_condition_scope_displacements"] == 1) loc_return_value.displacements = 1;
//     if(m["ckb_condition_scope_cook"] == 1) loc_return_value.cook = 1;
//     if(m["ckb_condition_scope_phone"] == 1) loc_return_value.phone = 1;
//     if(m["ckb_dwelling_tub"] == 1) loc_return_value.tub = 1;
//     if(m["ckb_dwelling_shower"] == 1) loc_return_value.shower = 1;

//     //Dwelling information
//     if (m["cmb_user_service"] != undefined) loc_return_value.has_sad = (m["cmb_user_service"] == 1)
//     else if (m["ckb_user_SAD"] != undefined) loc_return_value.has_sad = m["ckb_user_SAD"] //al original fa .contains, pendent

//     if(m["cmb_user_coexistance"] == "Sol") loc_return_value.coexistance = 1
//     else if(m["cmb_user_coexistance"] == "Amb persona dependent") loc_return_value.coexistance = 2
//     else if(m["cmb_user_coexistance"] == "Altres") loc_return_value.coexistance = 3
//     else loc_return_value.coexistance = 0;

//     loc_return_value.coexistance_specification = m["txt_user_coexistance_others"]

//     if (m["cmb_user_entry"] != undefined) loc_return_value.has_sad = (m["cmb_user_entry"] == 1)
//     else loc_return_value.has_sad = false;

//     loc_return_value.dwelling = m["cmb_dwelling_info"];

//     if (m["cmb_dwelling_year"] != undefined) loc_return_value.has_sad = (m["cmb_dwelling_year"] == 1)
//     else loc_return_value.has_sad = false;

//     loc_return_value.tub_shower = 0 //no el puc fer perque va amb checkbox, pendent

//     loc_return_value.tub_shower_problems = m["cmb_dwelling_difficulties_bath"]
//     loc_return_value.mobility_problems = m["cmb_dwelling_difficulties_moving"]
//     loc_return_value.income_type = m["cmb_economic_incoming_level"]
//     loc_return_value.income = m["txt_economic_incoming"]

//     loc_return_value.professional_valutaion = m["txt_technical_valuation"]
//     loc_return_value.comments = m["txt_comments"]

//     //Retrieving 2014 fields
//     loc_return_value.derivation_date = m["txt_date"] //aqui feia cast date, pendent
//     loc_return_value.pr_nom_cognoms = m["txt_nom_CSS"]
//     loc_return_value.pr_css = m["txt_centre_CSS"]
//     loc_return_value.pr_mail = m["txt_email_CSS"]
//     loc_return_value.pr_phone = m["txt_tlfn_CSS"]

//     //Retrieving 2019 fields
//     loc_return_value.user_entry_healthcare = m["cmb_user_entry_healthcare"]
//     loc_return_value.healthcare_date = m["txt_user_healthcare"]

//     // count++;
//     // console.log(count)
//     return loc_return_value;

// }

// function migrarPdf(pdfPath){

    

//     pdfParser.loadPDF(pdfPath);

//     pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
//     pdfParser.on("pdfParser_dataReady", pdfData => {
//     fs.writeFile("./F2040EZ.fields.json", JSON.stringify(pdfParser.getAllFieldsTypes()), function(err,result){
//     if(err) console.log(err);
//     else{

//         var format = JSON.stringify(pdfParser.getAllFieldsTypes());
//         var parser = JSON.parse(format)
//         for (var i = 0; i < parser.length; i++){
//             var obj = parser[i];
//             var field = obj["id"];
//             var value = obj["value"];
//             m[field] = value;
//         }
//         fs.writeFile("./F1040EZ.json", JSON.stringify(pdfData), function(err,result){
//            if(err) console.log(err);
//            else{
//             var data = JSON.stringify(pdfData);
//             var object = JSON.parse(data)
//             data = object.formImage.Pages[0].Boxsets;
//             for (var i = 1; i < data.length; i++){
//                 var box = data[i];
//                 if(box.boxes[0].checked != undefined){
//                 var name = box.boxes[0].id.Id;
//                 m[name] = 1;
//                 }
//             }
//             // count2++;
//             // console.log(count2)
//             addToStructure();
            
//            }
//         });
//     }
//     });
    

//     });
  
// }
let fs = require('fs'),
PDFParser = require("pdf2json");
const rimraf = require('rimraf');



function migrarPdf(pdfPath, filename, user, callback){

  let pdfParser = new PDFParser();

const m =  new Map();

var count = 0;

pdfParser.loadPDF(pdfPath);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
pdfParser.on("pdfParser_dataReady", pdfData => {
fs.writeFile("./F2040EZ.fields.json", JSON.stringify(pdfParser.getAllFieldsTypes()), function(err,result){
  if(err) console.log(err);
  else{
    var arr = JSON.stringify(pdfParser.getAllFieldsTypes());
    arr = JSON.parse(arr)
    for (var i = 0; i < arr.length; i++){
      var obj = arr[i];
      var field = obj["id"];
      var value = obj["value"];
      m[field] = value;
      
    }
//   }
// });
// fs.writeFile("./F1040EZ.json", JSON.stringify(pdfData), function(err,result){
//     if(err) console.log(err);
//     else{
      var arr = JSON.stringify(pdfData);
      var obj = JSON.parse(arr)
      arr = obj.formImage.Pages[0].Boxsets;
      for (var i = 1; i < arr.length; i++){
        var box = arr[i];
        if(box.boxes[0].checked != undefined){
          var name = box.boxes[0].id.Id;
          m[name] = 1;
        }
      }
      addToStructure();
      if(!fs.existsSync('./public/images/' + user + '/Migracions/Finalitzades/')) fs.mkdirSync('./public/images/' + user + '/Migracions/Finalitzades/');
      fs.copyFile(pdfPath, './public/images/' + user + '/Migracions/Finalitzades/' + filename, (err) => {
					rimraf.sync(pdfPath);
					if (err) throw err;
				});
    }
  });
});

function addToStructure(){

  var loc_return_value = {
    derivation:{
      type: -1,
      centre: "",
    },
    contact:{
      name:"",
      phone:"",
    }
  };

  //Derivation centre
  // if(m['grp_der'] == 1){
  //   loc_return_value.derivation.type = 1;
  //   if (m['cmb_der_css'] != -1 && m['cmb_der_css'] != 0) loc_return_value.derivation.centre = m['cmb_der_css'];
  // }
  // else if(m['grp_der'] == 2){
  //   loc_return_value.derivation.type = 2;
  //   loc_return_value.derivation.centre = m["txt_der_ABS"];
  // }
  // else if(m['grp_der'] == 3){
  //   loc_return_value.derivation.type = 3;
  // }
  // else if(m['grp_der'] == 4){
  //   loc_return_value.derivation.type = 4;
  //   if (m['cmb_der_SAD_zone'] != -1 && m['cmb_der_SAD_zone'] != 0) loc_return_value.derivation.centre = m['cmb_der_SAD_zone'];
  // }
  // else{
  //   loc_return_value.derivation.type = 0
  // }

  if(m["cmb_organisme"] == undefined) loc_return_value.city = "0";
  else loc_return_value.city = m["cmb_organisme"];

  if (m["txt_date"].length == 0) loc_return_value.creation_date = new Date().toISOString();
  else loc_return_value.creation_date = calcularData(m["txt_date"]);

  if(m["cmb_der_css"] == undefined){
    if(m["txt_der_ABS"] == undefined){
      if(m["cmb_der_SAD_zone"] == undefined){
        loc_return_value.derivation.type = 3;
      }
      else{
        loc_return_value.derivation.type = 4;
        loc_return_value.derivation.centre = m["cmb_der_SAD_zone"];
      }
    }
    else{
      loc_return_value.derivation.type = 2;
     loc_return_value.derivation.centre = m["txt_der_ABS"];
    }
  }
  else{
    loc_return_value.derivation.type = 1;
    loc_return_value.derivation.centre = m["cmb_der_css"];
  } 
  

  //Derivation information
  loc_return_value.derivation.name = m["txt_der_name"]
  loc_return_value.derivation.profile = m["txt_der_profile"]
  loc_return_value.derivation.phone = m["txt_der_phone"]
  loc_return_value.derivation.mail = m["txt_der_mail"]

  //User information
  loc_return_value.n_exp = m["txt_user_expedient"]
  loc_return_value.NIF = m["txt_user_DNI"]
  if (m["txt_user_birth_date"] != "") loc_return_value.birth_date = calcularData(m["txt_user_birth_date"]); //al migrador fa cast date, pendent
  //console.log(loc_return_value.birth_date);
  loc_return_value.surname1 = m["txt_user_surname1"]
  loc_return_value.surname2 = m["txt_user_surname2"]
  loc_return_value.name = m["txt_user_name"]
  loc_return_value.address = m["txt_user_address"]

  //Si no te codi postal, es posa 08001
  if(m["txt_user_ZP"] != "") loc_return_value.ZC = m["txt_user_ZP"]
  else loc_return_value.ZC = "08001"

  if(m["cmb_user_district"] != -1) loc_return_value.district = m["cmb_user_district"];
  
  loc_return_value.phone = m["txt_user_phone"]
  //Si lusuari no te numero pero la persona de contacte si, es posa com a numero de lusuari
  // if(m["txt_user_contact"] == ""){
  //   if(m["txt_user_contact_phone"] != "") loc_return_value.phone = loc_return_value.phone + m["txt_user_contact_phone"]
  // }

  //User contact information (if any)
  if(m["txt_user_contact"] != ""){
    loc_return_value.contact.name = m["txt_user_contact"]
    loc_return_value.contact.phone = m["txt_user_contact_phone"]
  }

  //User condition information
  loc_return_value.disability_grade = (m["cmb_condition_disability"] == 1)

  if(m["cmb_condition_dependency"] == 1){
    if(m["cmb_condition_dependency_GN"] != -1) loc_return_value.dependency_grade_level = m["cmb_condition_dependency_GN"]
    else loc_return_value.dependency_grade_level = 0;
  }
  else{
    loc_return_value.dependency_grade_level = -1;
  }

  //Scopes information
  if(m["ckb_condition_scope_feeding"] == 1) loc_return_value.feeding = 1;
  if(m["ckb_condition_scope_hygiene"] == 1) loc_return_value.hygiene = 1;
  if(m["ckb_condition_scope_trasnfers"] == 1) loc_return_value.transfers = 1;
  if(m["ckb_condition_scope_money"] == 1) loc_return_value.money = 1;
  if(m["ckb_condition_scope_dress"] == 1) loc_return_value.dres = 1;
  if(m["ckb_condition_scope_displacements"] == 1) loc_return_value.displacements = 1;
  if(m["ckb_condition_scope_cook"] == 1) loc_return_value.cook = 1;
  if(m["ckb_condition_scope_phone"] == 1) loc_return_value.phone = 1;
  if(m["ckb_dwelling_tub"] == 1) loc_return_value.tub = 1;
  if(m["ckb_dwelling_shower"] == 1) loc_return_value.shower = 1;

  //Dwelling information
  if (m["cmb_user_service"] != undefined) loc_return_value.has_sad = (m["cmb_user_service"] == 1);
  else loc_return_value.has_sad = false;
  //else if (m["ckb_user_SAD"] != undefined) loc_return_value.has_sad = m["ckb_user_SAD"] //al original fa .contains, pendent

  if(m["cmb_user_coexistance"] == "Sol") loc_return_value.coexistance = 1
  else if(m["cmb_user_coexistance"] == "Amb persona dependent") loc_return_value.coexistance = 2
  else if(m["cmb_user_coexistance"] == "Altres") loc_return_value.coexistance = 3
  else loc_return_value.coexistance = 0;

  loc_return_value.coexistance_specification = m["txt_user_coexistance_others"]

  if (m["cmb_user_entry"] != undefined) loc_return_value.user_entry = (m["cmb_user_entry"] == 1)
  else loc_return_value.user_entry = false;

  loc_return_value.dwelling = m["cmb_dwelling_info"];

  if (m["cmb_dwelling_year"] != undefined) loc_return_value.dwelling_year = (m["cmb_dwelling_year"] == 1)
  else loc_return_value.dwelling_year = false;

  if(m["ckb_dwelling_tub"] == 1){
    if(m["ckb_dwelling_shower"] == 1){
      loc_return_value.tub_shower = 3;
    }
    else{
      loc_return_value.tub_shower = 1;
    }
  }
  else{
    if(m["ckb_dwelling_shower"] == 1){
      loc_return_value.tub_shower = 2;
    }
    else{
      loc_return_value.tub_shower = 0;
    }
  }

  loc_return_value.tub_shower_problems = m["cmb_dwelling_difficulties_bath"]
  loc_return_value.mobility_problems = m["cmb_dwelling_difficulties_moving"]
  loc_return_value.income_type = m["cmb_economic_incoming_level"]
  loc_return_value.income = m["txt_economic_incoming"]

  loc_return_value.professional_valutaion = m["txt_technical_valuation"]
  loc_return_value.comments = m["txt_comments"]

  //Retrieving 2014 fields
  if (m["txt_date"].length == 0) loc_return_value.derivation_date = new Date().toISOString();
  else loc_return_value.derivation_date = calcularData(m["txt_date"]);
  //console.log(loc_return_value.derivation_date);
  loc_return_value.pr_nom_cognoms = m["txt_nom_CSS"]
  loc_return_value.pr_css = m["txt_centre_CSS"]
  loc_return_value.pr_mail = m["txt_email_CSS"]
  loc_return_value.pr_phone = m["txt_tlfn_CSS"]

  //Retrieving 2019 fields
  loc_return_value.user_entry_healthcare = m["cmb_user_entry_healthcare"]
  if (m["txt_user_healthcare"] != "") loc_return_value.healthcare_date = calcularData(m["txt_user_healthcare"]);
  //console.log(loc_return_value.healthcare_date);

  callback(loc_return_value);
  //return loc_return_value;

}

function calcularData(txt_date){
  var sencer = txt_date;
  var dia = "";
  var mes = "";
  var any = "";
  var count = 0;
  for(var i = 0; i<sencer.length;i++){
    if(sencer[i] == '/') count++;
    else{
      if (count == 0) dia += sencer[i];
      else if (count == 1) mes += sencer[i];
      else if (count == 2) any += sencer[i];
    }
  }
  var dia = parseInt(dia);
  var mes = parseInt(mes);
  var any = parseInt(any);
  var data = new Date(any,mes-1,dia, 8, 0 , 0); //-1 perque els mesos s'indexen a partir de 0
  return data.toISOString();
}

}

module.exports.migrarPdf = migrarPdf;