//EBML JSON FORMAT
/*
Schema Definition:

{
  'abcdefg': { //element ID
    desc: //description
    name: //name
    mu: //multiple (boolean)
    level: //level
    def: //default
    type: //master element, binary, float, int, etc.
  }
}


Parsed JSON

{
  EBML: {
    EBMLVersion: 8,
    EBMLReadVersion: 8
  }
  
  Segment: [
    {
      SeekHead
    }
  ]
}
*/


var nameHexMap = {};
for(var i in schema) nameHexMap[schema[i].name] = i;


function toBinary(string){
  return string.split('').map(function(i){
    var unpadded = i.charCodeAt(0).toString(2);
    return (new Array(8 - unpadded.length + 1)).join('0') + unpadded;
  }).join('')
}


function toBinStr(bits){
  var data = '';
  var pad = (bits.length % 8) ? (new Array(1 + 8 - (bits.length % 8))).join('0') : '';
  bits = pad + bits;
  for(var i = 0; i < bits.length; i+= 8){
    data += String.fromCharCode(parseInt(bits.substr(i,8),2))
  }
  return data;
}



function parseEBML(string){
  var offset = 0;
  var json = {};
  while(offset < string.length){
    var el_id = toBinary(string.substr(offset, 4));
    var segments = el_id.match(/^0*1/)[0].length;
    var id = el_id.substring(segments - 1, segments * 8);
    var hexid = parseInt(id, 2).toString(16);

    offset += segments;
    
    var el_size = toBinary(string.substr(offset, 8));
    var segments = el_size.match(/^0*1/)[0].length;
    var size = parseInt(el_size.substring(segments, segments * 8),2);
    
    offset += segments;

    var data = string.substr(offset, size);
    offset += size;
    var element = schema[hexid];
    var name = element ? element.name : hexid;
    var value = data;
    if(element){
      var type = element.type;

      if(type == 'm'){
        value = parseEBML(data);
      }else if(type == 's'){
        value = data;
      }else if(type == 'u'){
        value = parseInt(toBinary(data),2);
      }
    }
    var parsed_data = value //{original: data, val: value}; //so that generateEBML can return original.
    if(!element || element.mu){
      if(!json[name]) json[name] = [];
      json[name].push(parsed_data);
    }else{
      json[name] = parsed_data;
    }
    //console.log(hexid, size, data);
    
  }

  return json;
}


function generateEBML(json){
  var ebml = '';
  for(var i in json){
    var el_len = json[i].pop ? json[i].length : 1;
    for(var k = 0; k < el_len; k++){
      var data = json[i].pop ? json[i][k] : json[i];
      console.log(i,k,data);
      var hexid = nameHexMap[i] || i;
      if(typeof data == 'object'){
        
        //recurse
        //normal object yay
        data = generateEBML(data);
      }else if(typeof data == 'number'){
        data = toBinStr(data.toString(2));
      }
      if(typeof data == 'string'){
        var len = data.length;
        var zeroes = Math.ceil(Math.ceil(Math.log(len)/Math.log(2))/8);
        //(zeroes + 1) * 8 - (zeroes + 1) = zeroes * 7 - 7 = needed size
        var size_str = len.toString(2);
        var padded = (new Array((zeroes * 7 + 7 + 1) - size_str.length)).join('0') + size_str;
        var size = (new Array(zeroes + 1)).join('0') + '1' + padded;

        ebml += toBinStr(parseInt(hexid, 16).toString(2));
        console.log(size, size_str, size.toString(16));
        ebml += toBinStr(size);
        ebml += data;
      }else{
        console.log('big error!?!?!?',i,data,json);
      }
    }
  }
  return ebml;
}

