



function mapFields(ciutat, loc_return_value, callback){

    const data = new Map();

    data["clFactVill"] = "BARCELONA";
    data["clFactpaID"] = "ES";
    data["clFactPays"] = "ESPAÑA";
    data["clSolde"] = "0";
    data["clSoldeInit"] = "0";
    data["clEncoursM"] = "0";
    data["clTypeCompta"] = "F";
    data["clLangueID"] = "1";

    data["clEditCntr"] = "1";
    data["clType"] = "P";
    data["clBloque"] = "0";
    data["clJour"] = "0";
    data["XXNOPART"] = "0";
    data["clCreaUser"] = "1";
    data["clModiUser"] = "1";
    data["clStatut"] = "A";


    data["clCreaDate"] = loc_return_value.creation_date;
    data["clModiDate"] = loc_return_value.creation_date;
    data["clId"] = ""; //calculat al moment de fer l'insert
    data["clCIF"] = loc_return_value.NIF;
    if (loc_return_value.NIF.length != 0) data["clTypeCIF"] = 1;
    data["XXNOM"] = loc_return_value.name;
    data["XXCOG1"] = loc_return_value.surname1;
    data["XXCOG2"] = loc_return_value.surname2;
    data["clNom"] = loc_return_value.name + ' ' + loc_return_value.surname1 + ' ' + loc_return_value.surname2;
    data["clFactAdr1"] = loc_return_value.address;
    data["clFactAdr2"] = loc_return_value.address2; //no el tinc
    data["XXDSTE"] = loc_return_value.district;
    data["clFactCP"] = loc_return_value.ZC;
    data["clFactTel"] = loc_return_value.phone;
    data["XXEXPAJ"] = loc_return_value.n_exp;
    data["XXDNAIX"] = loc_return_value.birth_date.toString();
    data["XXGDISC"] = loc_return_value.disability_grade;

    if (loc_return_value.dependency_grade_level == -1) data["XXGNDEP"] = false;
    else data["XXGNDEP"] = true;

    if (loc_return_value.dependency_grade_level > 0) data["XXGNDEPI"] = loc_return_value.dependency_grade_level;
    else data["XXGNDEPI"] = undefined;


    data["XXCONVIV"] = loc_return_value.coexistance;

    if (loc_return_value.dwelling == "1") data["XXINFHAB"] = "PROPIETAT";
    else if (loc_return_value.dwelling == "2") data["XXINFHAB"] = "LLOGUER";
    else if (loc_return_value.dwelling == "3") data["XXINFHAB"] = "USUFRUCTUARI";
    else data["XXINFHAB"] = "";

    data["XXDSADM"] = loc_return_value.has_sad;

    if(loc_return_value.derivation.type == 1){
        data["XXCDERIV"] = loc_return_value.derivation.centre;
    }
    else if(loc_return_value.derivation.type == 2){
        data["XXCDERIV"] = 47;
        data["XXDERABS"] = loc_return_value.derivation.centre;
    }
    else if(loc_return_value.derivation.type == 3){
        data["XXCDERIV"] = "2";
    }
    else{
        if(loc_return_value.derivation.centre == "") data["XXCDERIV"] = "0";
        else{
            var centrederiv = 42 + parseInt(loc_return_value.derivation.centre);
            data["XXCDERIV"] = centrederiv.toString();
        } 
    }
    
    data["XXDERNOM"] = loc_return_value.derivation.name;
    data["XXDERPER"] = loc_return_value.derivation.profile;
    data["XXDERTEL"] = loc_return_value.derivation.phone;
    data["XXDERMAI"] = loc_return_value.derivation.mail;
    // if (loc_return_value.user_entry) data["XXINGRES"] = 1;
    // else data["XXINGRES"] = 0;
    data["XXINGRES"] = loc_return_value.user_entry;
    data["XXVIUANY"] = loc_return_value.dwelling_year;
    data["XXDERIVD"] = loc_return_value.derivation_date;
    data["XXPRNOM"] = loc_return_value.pr_nom_cognoms;
    data["XXPRCSS"] = loc_return_value.pr_css;
    data["XXPRMAIL"] = loc_return_value.pr_mail;
    data["XXPRTLFN"] = loc_return_value.pr_phone;
    data["XXSSANIT"] = loc_return_value.user_entry_healthcare;
    data["XXDATASS"] = loc_return_value.healthcare_date;
    //mapeig la variable ciutat amb la seva BD

    // var bd;
    // if (ciutat == "0") bd = "CVI2020";
    //...

    var bd = "CVIprovaApp";

    callback(bd, data);

}

module.exports.mapFields = mapFields;