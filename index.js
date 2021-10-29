#!/usr/bin/env node

let fs = require("fs");
let {parseString} = require('xml2js');
let path = process.argv[2];

let db = {

}

let tokens = [];

let code = `
///////////////////////////////////
//                               //
// This Code Was Auto Generated  //
//      With <[xml2dragon]>      //
//       Made By Dev Bash        //
//                               //
///////////////////////////////////
\n`;

let hasError = false;

if (fs.existsSync(path)) {
    let xml = fs.readFileSync(path, "utf-8");
    parseString(xml, function(err, result) {
        if(err){
            console.error("[xml2dragon]: " + err);
            hasError = true;
        }else{
            if(!hasError){
                tokenizer(result);
                writeDgn();
                saveCodeTo("app.dgn");
            }
        }
    });
} else {
    console.error("[xml2dragon]: " + path + " does not exist!")
}

function saveCodeTo(file){
    fs.writeFileSync(process.cwd() + "/" + file, code);
    console.log("Code Saved to : " + process.cwd() + "/" + file);
}

function tokenizer(json,type,parentId){
    if(!isArray(json)){
        let key = Object.keys(json)[0];
        let data = fixData(json[key]["$"]);
        makeToken(key,data,null);
        delete json[key]["$"];

        let keys = Object.keys(json[key]);
        let lastId = db.id;
        keys.forEach(function(each){
            tokenizer(json[key][each],each,lastId);
        })
    }else{
        let key = type;
        json.forEach(function(each,i){
            let data = fixData(json[i]["$"]);
            makeToken(key,data,parentId);
            delete json[i]["$"];
            if(Object.keys(json[0]) != 0){
                let keys = Object.keys(json[0]);
                let lastId = db.id;
                keys.forEach(function(each){
                    tokenizer(json[0][each],each,lastId);
                })
            }
        })
    }
}


function writeDgn(){
    let len = tokens.length;
    writeToCode(`select "android"`);
    writeToCode("");

    tokens.forEach(function(token,i){
        if(token.type == "LinearLayout"){
            //console.log(token);
            writeToCode(`${token.name} = newLinearLayout()`);
            setParams(token);
        }

        if(token.type == "RelativeLayout"){
            //console.log(token);
            writeToCode(`${token.name} = newRelativeLayout()`);
            setParams(token);
        }

        if(token.type == "TextView"){
            //console.log(token);
            writeToCode(`${token.name} = newTextView()`);
            setParams(token);
        }

        if(token.type == "EditText"){
            //console.log(token);
            writeToCode(`${token.name} = newEditText()`);
            setParams(token);
        }

        if(token.type == "Button"){
            //console.log(token);
            writeToCode(`${token.name} = newButton()`);
            setParams(token);
        }

        if(token.type == "WebView"){
            //console.log(token);
            writeToCode(`${token.name} = newWebView()`);
            setParams(token);
        }

        if(token.type == "ImageView"){
            //console.log(token);
            writeToCode(`${token.name} = newImageView()`);
            setParams(token);
        }

        if(token.type == "ImageButton"){
            //console.log(token);
            writeToCode(`${token.name} = newImageButton()`);
            setParams(token);
        }

        if(token.type == "ToggleButton"){
            //console.log(token);
            writeToCode(`${token.name} = newToggleButton()`);
            setParams(token);
        }

        if(token.type == "ProgressBar"){
            //console.log(token);
            writeToCode(`${token.name} = newProgressBar()`);
            setParams(token);
        }

        if(token.type == "CheckBox"){
            //console.log(token);
            writeToCode(`${token.name} = newCheckBox()`);
            setParams(token);
        }

        if((len-1) == i){
            let headToken = getTokenById(1);
            writeToCode(`showPanel(${headToken.name})`)
        }
    })
}

function setParams(token){
    if(token.type == "ImageButton"){
        let canSetWithParam = ["layout_height","layout_width"];
        let params = {};
        Object.keys(token.attrs).forEach(function(property){
            let value = token.attrs[property];
            if(canSetWithParam.includes(property)){
                params[property] = value;
            }
        })

        if(Object.keys(params).length != 0){
            writeToCode(`${token.name}.setLayoutParams(${fixValue(JSON.stringify(params))})`)
        }

        if(token.attrs.background){
            let background = colorToRGB(token.attrs.background);
            writeToCode(`${token.name}.setBackgroundColor(${background})`);
        }

        if(token.attrs.padding || token.attrs.paddingLeft || token.attrs.paddingRight || token.attrs.paddingTop || token.attrs.paddingBottom){
            writePadding(token);
        }

        if(token.attrs.src){
            writeToCode(`${token.name}.setImageURI("${resolvePath(token.attrs.src)}")`)
        }

        if(token.attrs.scaleType){
            let scaleType = getScaleType(token.attrs.scaleType);
            writeToCode(`${token.name}.setScaleType(${scaleType})`);
        }

        if(token.attrs.alpha){
            let alpha = getAlpha(token.attrs.alpha);
            writeToCode(`${token.name}.setImageAlpha(${alpha})`);
        }
        
        if(token.hasParent){
            let parent = getTokenById(token.parentId);
            writeToCode(`${parent.name}.addView(${token.name})`);
        }
        writeToCode("");
    }

    if(token.type == "CheckBox"){
        if(token.hasParent){
            let parent = getTokenById(token.parentId);
            writeToCode(`${parent.name}.addView(${token.name})`);
        }
        writeToCode("");
    }

    if(token.type == "LinearLayout"){
        let canSetWithParam = ["layout_height","layout_width"];
        let params = {};
        Object.keys(token.attrs).forEach(function(property){
            let value = token.attrs[property];
            if(canSetWithParam.includes(property)){
                params[property] = value;
            }
        })

        if(Object.keys(params).length != 0){
            writeToCode(`${token.name}.setLayoutParams(${fixValue(JSON.stringify(params))})`)
        }

        if(token.attrs.orientation){
            if(token.attrs.orientation == "VERTICAL"){
                writeToCode(`${token.name}.setOrientation(LinearLayout.VERTICAL)`);
            }
        }

        if(token.attrs.gravity){
            let gravity = getGravity(token.attrs.gravity);
            writeToCode(`${token.name}.setGravity(${gravity})`);
        }

        if(token.attrs.background){
            let background = colorToRGB(token.attrs.background);
            writeToCode(`${token.name}.setBackgroundColor(${background})`);
        }

        if(token.attrs.padding || token.attrs.paddingLeft || token.attrs.paddingRight || token.attrs.paddingTop || token.attrs.paddingBottom){
            writePadding(token);
        }
        
        if(token.hasParent){
            let parent = getTokenById(token.parentId);
            writeToCode(`${parent.name}.addView(${token.name})`);
        }
        writeToCode("");
    }


    if(token.type == "RelativeLayout"){
        let canSetWithParam = ["layout_height","layout_width"];
        let params = {};
        Object.keys(token.attrs).forEach(function(property){
            let value = token.attrs[property];
            if(canSetWithParam.includes(property)){
                params[property] = value;
            }
        })

        if(Object.keys(params).length != 0){
            //writeToCode(`${token.name}.setLayoutParams(${fixValue(JSON.stringify(params))})`)
        }

        if(token.attrs.background){
            let background = colorToRGB(token.attrs.background);
            writeToCode(`${token.name}.setBackgroundColor(${background})`);
        }
        
        if(token.hasParent){
            let parent = getTokenById(token.parentId);
            writeToCode(`${parent.name}.addView(${token.name})`);
        }
        writeToCode("");
    }

    if(token.type == "TextView"){
        let canSetWithParam = ["layout_height","layout_width"];
        let params = {};
        Object.keys(token.attrs).forEach(function(property){
            let value = token.attrs[property];
            if(canSetWithParam.includes(property)){
                params[property] = value;
            }
        })

        if(token.attrs.background){
            let background = colorToRGB(token.attrs.background);
            writeToCode(`${token.name}.setBackgroundColor(${background})`);
        }

        if(token.attrs.layout_width){
            writeToCode(`${token.name}.setWidth(${toSize(token.attrs.layout_width)})`);
        }

        if(token.attrs.layout_height){
            writeToCode(`${token.name}.setHeight(${toSize(token.attrs.layout_height)})`);
        }
        
        if(token.attrs.text){
            writeToCode(`${token.name}.setText("${token.attrs.text}")`);
        }

        if(token.attrs.textSize){
            writeToCode(`${token.name}.setTextSize(${toNumber(token.attrs.textSize)})`);
        }

        if(token.attrs.color){
            let color = colorToRGB(token.attrs.color);
            writeToCode(`${token.name}.setTextColor("${color}")`);
        }

        if(token.attrs.padding || token.attrs.paddingLeft || token.attrs.paddingRight || token.attrs.paddingTop || token.attrs.paddingBottom){
            writePadding(token);
        }

        if(token.hasParent){
            let parent = getTokenById(token.parentId);
            writeToCode(`${parent.name}.addView(${token.name})`);
        }
        writeToCode("");
    }

    if(token.type == "EditText"){
        let canSetWithParam = ["layout_height","layout_width"];
        let params = {};
        Object.keys(token.attrs).forEach(function(property){
            let value = token.attrs[property];
            if(canSetWithParam.includes(property)){
                params[property] = value;
            }
        })

        if(token.attrs.background){
            let background = colorToRGB(token.attrs.background);
            writeToCode(`${token.name}.setBackgroundColor(${background})`);
        }

        if(token.attrs.layout_width){
            writeToCode(`${token.name}.setWidth(${toSize(token.attrs.layout_width)})`);
        }

        if(token.attrs.layout_height){
            writeToCode(`${token.name}.setHeight(${toSize(token.attrs.layout_height)})`);
        }
        
        if(token.attrs.text){
            writeToCode(`${token.name}.setText("${token.attrs.text}")`);
        }

        if(token.attrs.textSize){
            writeToCode(`${token.name}.setTextSize(${toNumber(token.attrs.textSize)})`);
        }

        if(token.attrs.color){
            let color = colorToRGB(token.attrs.color);
            writeToCode(`${token.name}.setTextColor("${color}")`);
        }

        if(token.attrs.padding || token.attrs.paddingLeft || token.attrs.paddingRight || token.attrs.paddingTop || token.attrs.paddingBottom){
            writePadding(token);
        }

        if(token.hasParent){
            let parent = getTokenById(token.parentId);
            writeToCode(`${parent.name}.addView(${token.name})`);
        }
        writeToCode("");
    }

    if(token.type == "Button"){
        let canSetWithParam = ["layout_height","layout_width"];
        let params = {};
        Object.keys(token.attrs).forEach(function(property){
            let value = token.attrs[property];
            if(canSetWithParam.includes(property)){
                params[property] = value;
            }
        })

        if(token.attrs.background){
            let background = colorToRGB(token.attrs.background);
            writeToCode(`${token.name}.setBackgroundColor(${background})`);
        }
        
        if(token.attrs.layout_width){
            writeToCode(`${token.name}.setWidth(${toSize(token.attrs.layout_width)})`);
        }

        if(token.attrs.layout_height){
            writeToCode(`${token.name}.setHeight(${toSize(token.attrs.layout_height)})`);
        }

        if(token.attrs.text){
            writeToCode(`${token.name}.setText("${token.attrs.text}")`);
        }

        if(token.attrs.textSize){
            writeToCode(`${token.name}.setTextSize(${toNumber(token.attrs.textSize)})`);
        }

        if(token.attrs.color){
            let color = colorToRGB(token.attrs.color);
            writeToCode(`${token.name}.setTextColor("${color}")`);
        }

        if(token.attrs.padding || token.attrs.paddingLeft || token.attrs.paddingRight || token.attrs.paddingTop || token.attrs.paddingBottom){
            //writePadding(token);
        }

        if(token.hasParent){
            let parent = getTokenById(token.parentId);
            writeToCode(`${parent.name}.addView(${token.name})`);
        }
        writeToCode("");
    }

    if(token.type == "WebView"){
        let canSetWithParam = ["layout_height","layout_width"];
        let params = {};
        Object.keys(token.attrs).forEach(function(property){
            let value = token.attrs[property];
            if(canSetWithParam.includes(property)){
                params[property] = value;
            }
        })

        if(Object.keys(params).length != 0){
            writeToCode(`${token.name}.setLayoutParams(${fixValue(JSON.stringify(params))})`)
        }

        if(token.attrs.background){
            let background = colorToRGB(token.attrs.background);
            writeToCode(`${token.name}.setBackgroundColor(${background})`);
        }

        if(token.attrs.padding || token.attrs.paddingLeft || token.attrs.paddingRight || token.attrs.paddingTop || token.attrs.paddingBottom){
            //writePadding(token);
        }
        
        if(token.hasParent){
            let parent = getTokenById(token.parentId);
            writeToCode(`${parent.name}.addView(${token.name})`);
        }
        writeToCode("");
    }

    if(token.type == "ListView"){
        let canSetWithParam = ["layout_height","layout_width"];
        let params = {};
        Object.keys(token.attrs).forEach(function(property){
            let value = token.attrs[property];
            if(canSetWithParam.includes(property)){
                params[property] = value;
            }
        })

        if(Object.keys(params).length != 0){
            writeToCode(`${token.name}.setLayoutParams(${fixValue(JSON.stringify(params))})`)
        }

        if(token.attrs.background){
            let background = colorToRGB(token.attrs.background);
            writeToCode(`${token.name}.setBackgroundColor(${background})`);
        }

        if(token.attrs.dividerHeight){
            let dividerHeight = toNumber(token.attrs.dividerHeight);
            writeToCode(`${token.name}.setDividerHeight(${dividerHeight})`);
        }

        if(token.attrs.padding || token.attrs.paddingLeft || token.attrs.paddingRight || token.attrs.paddingTop || token.attrs.paddingBottom){
            writePadding(token);
        }
        
        if(token.hasParent){
            let parent = getTokenById(token.parentId);
            writeToCode(`${parent.name}.addView(${token.name})`);
        }
        writeToCode("");
    }

    if(token.type == "ImageView"){
        let canSetWithParam = ["layout_height","layout_width"];
        let params = {};
        Object.keys(token.attrs).forEach(function(property){
            let value = token.attrs[property];
            if(canSetWithParam.includes(property)){
                params[property] = value;
            }
        })

        if(Object.keys(params).length != 0){
            //writeToCode(`${token.name}.setLayoutParams(${fixValue(JSON.stringify(params))})`)
        }

        if(token.attrs.background){
            let background = colorToRGB(token.attrs.background);
            writeToCode(`${token.name}.setBackgroundColor(${background})`);
        }

        if(token.attrs.padding || token.attrs.paddingLeft || token.attrs.paddingRight || token.attrs.paddingTop || token.attrs.paddingBottom){
            writePadding(token);
        }

        if(token.attrs.src){
            writeToCode(`${token.name}.setImageURI("${resolvePath(token.attrs.src)}")`)
        }

        if(token.attrs.scaleType){
            let scaleType = getScaleType(token.attrs.scaleType);
            writeToCode(`${token.name}.setScaleType(${scaleType})`);
        }

        if(token.attrs.alpha){
            let alpha = getAlpha(token.attrs.alpha);
            writeToCode(`${token.name}.setImageAlpha(${alpha})`);
        }
        
        if(token.hasParent){
            let parent = getTokenById(token.parentId);
            writeToCode(`${parent.name}.addView(${token.name})`);
        }
        writeToCode("");
    }

    if(token.type == "ToggleButton"){
        let canSetWithParam = ["layout_height","layout_width"];
        let params = {};
        Object.keys(token.attrs).forEach(function(property){
            let value = token.attrs[property];
            if(canSetWithParam.includes(property)){
                params[property] = value;
            }
        })

        if(Object.keys(params).length != 0){
            writeToCode(`${token.name}.setLayoutParams(${fixValue(JSON.stringify(params))})`)
        }

        if(token.attrs.background){
            let background = colorToRGB(token.attrs.background);
            writeToCode(`${token.name}.setBackgroundColor(${background})`);
        }
        
        if(token.attrs.layout_width){
            writeToCode(`${token.name}.setWidth(${toSize(token.attrs.layout_width)})`);
        }

        if(token.attrs.layout_height){
            writeToCode(`${token.name}.setHeight(${toSize(token.attrs.layout_height)})`);
        }

        if(token.attrs.textOn){
            writeToCode(`${token.name}.setTextOn("${token.attrs.textOn}")`);
        }

        if(token.attrs.textOff){
            writeToCode(`${token.name}.setTextOff("${token.attrs.textOff}")`);
        }

        if(token.attrs.textSize){
            writeToCode(`${token.name}.setTextSize(${toNumber(token.attrs.textSize)})`);
        }

        if(token.attrs.color){
            let color = colorToRGB(token.attrs.color);
            writeToCode(`${token.name}.setTextColor("${color}")`);
        }

        if(token.attrs.padding || token.attrs.paddingLeft || token.attrs.paddingRight || token.attrs.paddingTop || token.attrs.paddingBottom){
            writePadding(token);
        }

        if(token.hasParent){
            let parent = getTokenById(token.parentId);
            writeToCode(`${parent.name}.addView(${token.name})`);
        }
        writeToCode("");
    }

    if(token.type == "ProgressBar"){
        if(token.attrs.background){
            let background = colorToRGB(token.attrs.background);
            writeToCode(`${token.name}.setBackgroundColor(${background})`);
        }
        
        if(token.attrs.indeterminate){
            writeToCode(`${token.name}.setIndeterminate(${eval(token.attrs.indeterminate)})`);
        }

        if(token.attrs.progress){
            writeToCode(`${token.name}.setProgress(${Number(token.attrs.progress)})`);
        }

        if(token.attrs.max){
            writeToCode(`${token.name}.setMax(${Number(token.attrs.max)})`);
        }

        if(token.attrs.text){
            writeToCode(`${token.name}.setText("${token.attrs.text}")`);
        }

        if(token.attrs.textSize){
            writeToCode(`${token.name}.setTextSize(${toNumber(token.attrs.textSize)})`);
        }

        if(token.attrs.color){
            let color = colorToRGB(token.attrs.color);
            writeToCode(`${token.name}.setTextColor("${color}")`);
        }

        if(token.attrs.padding || token.attrs.paddingLeft || token.attrs.paddingRight || token.attrs.paddingTop || token.attrs.paddingBottom){
            writePadding(token);
        }

        if(token.hasParent){
            let parent = getTokenById(token.parentId);
            writeToCode(`${parent.name}.addView(${token.name})`);
        }
        writeToCode("");
    }
}

console.log(code);

function getGravity(text) {
    let test = {
        "CENTER":17,
        "AXIS_CLIP":8,
        "AXIS_PULL_AFTER":4,
        "AXIS_PULL_BEFORE":2,
        "AXIS_SPECIFIED":1,
        "AXIS_X_SHIFT":0,
        "AXIS_Y_SHIFT":4,
        "BOTTOM":80,
        "CENTER_HORIZONTAL":1,
        "CENTER_VERTICAL":16,
        "CLIP_HORIZONTAL":8,
        "CLIP_VERTICAL":128,
        "DISPLAY_CLIP_HORIZONTAL":16777216,
        "DISPLAY_CLIP_VERTICAL":268435456,
        "END":8388613,
        "FILL":119,
        "FILL_HORIZONTAL":7,
        "FILL_VERTICAL":112,
        "HORIZONTAL_GRAVITY_MASK":7,
        "LEFT":3,
        "NO_GRAVITY":0,
        "RELATIVE_HORIZONTAL_GRAVITY_MASK":8388615,
        "RELATIVE_LAYOUT_DIRECTION":8388608,
        "RIGHT":5,
        "START":8388611,
        "TOP":48,
        "VERTICAL_GRAVITY_MASK":112
    }
    return test[text] || 17;
}

function colorToRGB(hex){
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
     ].join(",") : null;
}

function getAlpha(num){
    return (Number(num)*1000);
}

function resolvePath(path){
    return path;
}

function fixValue(str){
    return str.split(`"WRAP_CONTENT"`).join("WRAP_CONTENT").split(`"MATCH_PARENT"`).join("MATCH_PARENT");
}

function getScaleType(text){
    let test = {
        "fitXY":"ScaleType.FIT_XY",
        "center":"ScaleType.CENTER",
        "centerCrop":"ScaleType.CENTER_CROP",
        "fitEnd":"ScaleType.FIT_END",
        "centerInside":"ScaleType.CENTER_INSIDE",
        "fitStart":"ScaleType.FIT_START",
        "fitCenter":"ScaleType.FIT_CENTER",
    }
    return test[text] || "center";
}

function writePadding(token){
    // L|T|R|B
    let padding = [0,0,0,0];

    if(token.attrs.padding){
        let pad = toNumber(token.attrs.padding);
        padding.forEach(function(each,i){
            padding[i] = pad;
        });
    }
    
    if(token.attrs.paddingLeft){
        let pad = toNumber(token.attrs.paddingLeft);
        padding[0] = pad;
    }

    if(token.attrs.paddingTop){
        let pad = toNumber(token.attrs.paddingTop);
        padding[1] = pad;
    }

    if(token.attrs.paddingRight){
        let pad = toNumber(token.attrs.paddingRight);
        padding[2] = pad;
    }

    if(token.attrs.paddingBotttom){
        let pad = toNumber(token.attrs.paddingBotttom);
        padding[3] = pad;
    }

    let stringPadding = padding.join(",");
    writeToCode(`${token.name}.setPadding(${stringPadding})`);
}

function toSize(text){
    let excludes = ["MATCH_PARENT","WRAP_CONTENT"];
    if(!excludes.includes(text)){
        return toNumber(text);
    }
    return text;
}

function toNumber(text){
    let num = text.substr(0,text.length-2);
    if(Number(num) == NaN){
        return text;
    }
    return Number(num);
}

function writeToCode(str){
    code += str + "\n";
}

function fixData(data){
    let newData = {};
    let excludes = ["id"]
    let noUpperCase = ["text","src","scaleType"]

    Object.keys(data).forEach(function(property){
        let value = data[property];
        if(property.startsWith("android")){
            let newProperty = property.substr(property.indexOf(":")+1);
            if(!excludes.includes(newProperty)){
                let newValue = value;
                if(!noUpperCase.includes(newProperty)){
                    newValue = value.toUpperCase();
                }
                if(newValue.startsWith("@") && newValue.includes("/")){
                    newValue = newValue;
                }
                newData[newProperty] = newValue;
            }
        }
    })
    return newData;
}

function addComment(str){
    writeToCode("// "+str);
}

function getTokenById(id){
    let myToken = null;
    tokens.forEach(function(token){
        if(token.id === id){
            myToken = token;
        }
    })
    return myToken;
}

function makeToken(type,attrs,parentId){
    let data = {};
    data.attrs = attrs;
    if(db.id == undefined){
        data.hasParent = false;
        data.isHead = true;
    }else{
        data.hasParent = true;
        data.parentId = parentId;
    }
    data.id = getId();
    data.type = type;
    data.index = getIndex(type);
    data.name = (type + data.index);
    tokens.push(data);
}

function getIndex(widget_name){
    if(!db["count"]){
        db["count"] = {};
    } 
    if(!db.count[widget_name]){
        db.count[widget_name] = 0;
    }
    db.count[widget_name] += 1;
    return db.count[widget_name];
}

function getId(){
    if(!db.id){
        db.id = 0;
    }
    db.id += 1;
    return db.id;
}

function isView(widget_name){
    let test = {
        "LinearLayout":false,
        "RelativeLayout":false,
        "Button":true,
        "EditText":true,
        "TextView":true,
    }
    return test[widget_name] || false;
}

function isArray(array){
    if(typeof array.forEach == "function"){
        return true;
    }
    return false;
}

function getFuncName(word){
    let test = {
        "LinearLayout":"newLinearLayout",
        "EditText":"newEditText",
    }
    return text[word] || word;
}
