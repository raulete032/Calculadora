

const on= document.getElementById("on");
const off= document.getElementById("off");
const del= document.getElementById("del");
const ac= document.getElementById("ac");

const one= document.getElementById("one");
const two= document.getElementById("two");
const three= document.getElementById("three");
const four= document.getElementById("four");
const five= document.getElementById("five");
const six= document.getElementById("six");
const seven= document.getElementById("seven");
const eight= document.getElementById("eight");
const nine= document.getElementById("nine");
const zero= document.getElementById("zero");

const plus= document.getElementById("plus");
const less= document.getElementById("less");
const times= document.getElementById("times");
const split= document.getElementById("split");
const point= document.getElementById("point");
const equals= document.getElementById("equals");

const panel= document.getElementById("panel");

const arraySimb= ["+", "-", "x", "÷"];

var switchOn=false;


let otherButtons= document.getElementsByClassName("other");
let numButtons= document.getElementsByClassName("num");
let simbButtons= document.getElementsByClassName("simb");



for(let btn of otherButtons){
    btn.addEventListener("click", otherBtn);
}


for(let btn of numButtons)
    btn.addEventListener("click", numBtn);

for(let btn of simbButtons)
    btn.addEventListener("click", simbBtn);


function otherBtn(){

    let btn= this.textContent; //obtengo lo que se ha pulsado

    if(btn!="ON" && !switchOn) //se pulsó un botón y está apagada
        return;
    
    if(btn=="ON"){//se pulsó ON
        switchOn=true;
        on.style.backgroundColor="green";
        panel.textContent="0";
        sessionStorage.removeItem("num");
        sessionStorage.removeItem("simb");
        return;
    } 
    
    if(btn=="OFF"){ //se pulsó off
        switchOn=false;
        on.style.backgroundColor="";
        panel.innerHTML="";
        decimal=false;
        simb=false;
        sessionStorage.removeItem("simb");
        return;
    }

    //En este punto sé que la calculadora está encendida   

    if(btn=="DEL"){ //se pulsó DEL
        deletePrev();
        return;
    }

    if(btn=="AC"){ //se pulsó AC
        deleteAll();
        decimal=false;
        simb=false;
 
        sessionStorage.removeItem("simb");
        return;
    }   
}

/**
 * Función que se ejecuta al pulsar sobre un nº
 */
var decimal=false;
function numBtn(){
    if(switchOn){
        let btn= this.textContent; //obtengo el botón pulsado
        let opTxt= panel.textContent; //obtengo lo que hay en el panel

        //Ahora hay dos opciones. Es el primer nº o ya hay algo
        if(opTxt=="0" && btn!="."){ //es el primero
            panel.innerHTML=btn;
        }
        else if(btn=="." && !decimal){
            panel.innerHTML+=btn;
            decimal=true;
        }
        else if(btn!="."){
            panel.innerHTML+=btn;
        }
    }     
}

/**
 * Función que se ejecuta al pulsar sobre un simbolo
 */
var simb=false;
function simbBtn(){
    if(switchOn){
        let btn= this.textContent;
        let opTxt= panel.textContent;
        decimal=false;
        if(opTxt=="0" && btn=="-"){
            panel.innerHTML=btn;
        }
        else if(!simb){ //aún no hay ningun símbolo
            panel.innerHTML+=btn;
            simb=true;
            sessionStorage.setItem("simb", btn);
        }
        else if(simb){ //ya hay un símbolo
            let swSimb= esSimb(opTxt.substring(opTxt.length-1)); 
            if(swSimb){//el último es un simbolo?
                deletePrev(); //elimino el último
                panel.innerHTML+=btn;
                sessionStorage.setItem("simb", btn);
            }
            else{ //el último es un nº, luego hay que hacer la operación
                //CALCULAR
                //Compruebo si el primero es un -
                let swFirstSimb= esSimb(opTxt.substring(0, 1));
                let num1;
                let num2;
                let simbSlpit= sessionStorage.getItem("simb"); //simbolo de la operación
                if(swFirstSimb){ //el primero es un -
                    
                    if(simbSlpit=="-"){ //el simbolo de la operación es -
                        num1= opTxt.split(simbSlpit)[1];
                        num1= "-"+num1;
                        num2= opTxt.split(simbSlpit)[2];
                    }
                    else{ //el simbolo de la operación es cualquiera menos el -
                        num1= opTxt.split(simbSlpit)[0];
                        num2= opTxt.split(simbSlpit)[1];
                    }
                }
                else{ //el primero NO era un simbolo
                    num1= opTxt.split(simbSlpit)[0];
                    num2= opTxt.split(simbSlpit)[1];
                }

                num1= parseFloat(num1);
                num2= parseFloat(num2);

                switch(sessionStorage.getItem("simb")){                    
                    case "+": panel.innerHTML= num1+num2+""+btn; break;
                    case "-": panel.innerHTML= num1-num2+""+btn; break;
                    case "x": panel.innerHTML= num1*num2+""+btn; break;
                    case "÷": panel.innerHTML= num1/num2+""+btn; break;
                }
                sessionStorage.setItem("simb", btn);
                if(btn=="="){
                    simb=false;
                    panel.innerHTML= panel.textContent.substring(0, panel.textContent.length-1);
                }                
            }
        }
    }      
}


/**
 * Reinicia la calculadora
 */
function deleteAll(){
    panel.innerHTML="0";
}

/**
 * Borra la última cifra introducida
 */
function deletePrev(){
    
    let last= panel.textContent.substring(panel.textContent.length-1);
    if(last==".") //Lo que se va a borrar es un decimal
        decimal=false;

    panel.innerHTML= panel.textContent.substring(0, panel.textContent.length-1);
    if(panel.textContent.length==0)
        panel.innerHTML="0";
}




/**
 * Función que comprueba si el botón es un símbolo
 * @param {*} btn -> Texto del botón
 * @returns -> True o false en función de si es un símbolo o no
 */
function esSimb(btn){
    return arraySimb.indexOf(btn)==-1?false:true;
}

/**
 * Función que comprueba si la operación ya contiene un símbolo
 * @returns -> El índice donde está el símbolo o -1 en función de si la operación contiene o no un símbolo
 */
function contieneSimb(){
    let sw=false;
    let operationTxt= panel.textContent;
    for(let i in arraySimb)
        if(operationTxt.indexOf(arraySimb[i])!=-1 && operationTxt.indexOf(arraySimb[i])!=0) //Lo ha encontrado y NO está en la primera posición
            sw=true;        
    
    return sw;
}


