const {program} = require("commander");
const fs = require('node:fs');

// Сама вказівка що після параметра має йти <file> - робить параметр обов'язковим
// [file] - параметр не обов'язковий
program.option('-i, --input <file>').option("-o, --output [file]").option("-d, --display").option('-v, --variety [text]', 'Вид квітки').option('-l, --length [num]', 'Мінімальна довжина пелюстки', Number);

// Бере масив значень флажків запущених через командний рядок, та встановлює які були отримані
program.parse();

// Повертає сформований об'єкт, в якому міститься поля - флажки, та значення - чи були вони встановлені
// Але якщо вказати "--input <num>" - то це вказівка, що значення поля має бути не булеве, а те що було вказано після флажка
const options = program.opts();

if(!options.input || options.input.trim() == ""){
    console.error("Please specify input file");
    process.exit();
}

const filePath = options.input;

let jsonStr = "";
try{
    // Повертає рядок
    jsonStr = fs.readFileSync(filePath, {encoding : "utf-8", flag : "r"});
}
catch(err){
    console.log('Cannot find input file');
    process.exit();
}

// Список об'єктів з усіма даними з iris.json
const obj = JSON.parse(jsonStr);

const variety = options.variety ? options.variety : "";
const length  = options.length  ? options.length  : 0;

let result_str = "";

for(let i = 0; i < obj.length; ++i){
    if(obj[i]["petal.length"] > length && (variety == "" || obj[i].variety == variety)){
        result_str += `${obj[i]["petal.length"]} ${obj[i]["petal.width"]} ${obj[i].variety}\n`;
    }
}

if(options.output && options.output.trim() !== ""){
    fs.writeFileSync(options.output, result_str, {encoding : "utf-8", flag : "w", flush : true});
}

if(options.display){
    console.log(result_str);
}