//REALLY NASTY EBML FORMAT:

/*
[
  {
    name: 'blah',
    blah: 'blah',
    data: [] OR
    data: 'stuff'
  }
]

*/


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
  var json = [];
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
    if(element && element.type == 'm') value = parseEBML(data);

    var parsed_data = {data: value, name: name, hex: hexid}; //so that generateEBML can return original.
    json.push(parsed_data);
  }

  return json;
}


function generateEBML(json){
  var ebml = '';
  for(var i = 0; i < json.length; i++){
    var data = json[i].data;

    if(typeof data == 'object') data = generateEBML(data);
    
    var len = data.length;
    var zeroes = Math.ceil(Math.ceil(Math.log(len)/Math.log(2))/8);
    //(zeroes + 1) * 8 - (zeroes + 1) = zeroes * 7 - 7 = needed size
    var size_str = len.toString(2);
    var padded = (new Array((zeroes * 7 + 7 + 1) - size_str.length)).join('0') + size_str;
    var size = (new Array(zeroes + 1)).join('0') + '1' + padded;

    ebml += toBinStr(parseInt(json[i].hex, 16).toString(2));
    ebml += toBinStr(size);
    ebml += data;
  }
  return ebml;
}

