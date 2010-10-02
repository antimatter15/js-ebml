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

var schema = {
  '1a45dfa3': {
    type: 'm',
    name: 'EBML'
  }
};

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
  var pad = (new Array(1 + bits.length % 8)).join('0');
  bits = pad + bits;
  for(var i = 0; i < bits.length; i+= 8){
    data += String.fromCharCode(parseInt(bits.substr(i,8),2))
  }
  return data;
}



function parseEBML(string){
  var offset = 0;
  var json = {};
  //while(offset < string.length){
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
    console.log(hexid, size, data);
    
  //}

  return json;
}


function generateEBML(json){
  var ebml = '';
  for(var i in json){
    var len = json[i].pop ? json[i].length : 1;
    for(var k = 0; k < len; k++){
      var data = json[i].pop ? json[i][k] : json[i];
      var hexid = nameHexMap[i] || i;
      ebml += toBinStr(parseInt(hexid, 16).toString(2));
      if(typeof data == 'object'){
        //recurse
        //normal object yay
        data = generateEBML(data);
      }else if(typeof data == 'number'){
        data = toBinStr(data.toString(2));
      }
      var len = data.length;
      var zeroes = Math.ceil(Math.ceil(Math.log(len)/Math.log(2))/8) - 1;
      //(zeroes + 1) * 8 - (zeroes + 1) = zeroes * 7 - 7 = needed size
      var size_str = len.toString(2);
      var padded = (new Array((zeroes * 7 + 7 + 1) - size_str.length)).join('0') + size_str;
      var size = (new Array(zeroes + 1)).join('0') + '1' + padded;

      ebml += size;
      ebml += data;
    }
  }
  return ebml;
}

var ebml = "\u001aEß£\u0001\u0000\u0000\u0000\u0000\u0000\u0000\u001fB\u0001B÷\u0001Bò\u0004Bó\bBwebmB\u0002B\u0002\u0018Sg\u0001\u0000\u0000\u0000\u0000\u0001§\u0014\u0011Mt@-M»S«\u0015I©fS¬ßM»S«\u0016T®kS¬\u0001,M»S«\u001cS»kS¬\u0001¦úì\u0001\u0000\u0000\u0000\u0000\u0000\u0000£\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0015I©f\u0001\u0000\u0000\u0000\u0000\u0000\u0000A*×±\u000fB@MLavf52.79.0WALavf52.79.0s¤)\u0000'DO\u0001îS\u0012Ys\bàôD@D\u0000\u0000\u0000\u0000\u0000\u0000\u0016T®k\u0001\u0000\u0000\u0000\u0000\u0000\u0000K®\u0001\u0000\u0000\u0000\u0000\u0000\u0000B×\u0001sÅ\u0001\u0000\"µundV_VP8\u0001#ã\u0002bZ\u0000à\u0001\u0000\u0000\u0000\u0000\u0000\u0000\u0016°\n\u0000º\u0007T°\n\u0000Tº\u0007T²\u0003\u001fC¶u\u0001\u0000\u0000\u0000\u0000\u0001¥kç\u0000£!¥d\u0000\u0000ð|\n\u0001*\u0000\n\u0007\u0004G\b\u0014»ñY4#­õÂÿüî\u0012\u0017zj»&îØ{_èKo¦ãÿ(¿èâÇiÿöO¹^5÷wõÿËz@ñïh\u0018û·ùþÞÐ{éìO.þÿÿûÅï3ý_î\u000fºOé¿ê}¿©ÿ§ÿûìkÿ?«¿ÞR?æ¿ôz½ìýð÷£ýûÔKüGþ\\¿ÿ>Ê\u001f¾ßÿÿÿü\rþñúÇ÷öcÿ\u001dÿ³÷ËàsüWýÿÿÿý~\u0000ÿÿöæþ\u0003ÿÿ¬\u001f·?ð}0ù;üñ~5þGôê¿¾ÿÁþ3÷Ûìñªü×û\u001föÿýÖúüóòOöÿÈÿ£ÿÿÿ+å÷õ?ùÿÕ«ógô\u001fâÿóÿö\u000büÛú¯ì\u001fï÷»ÿÞwnÿíÿo=~\u0001üWÜ~ÜúÅö¿Ø\u000bú·øoHÿêxaþSþ¯°\u0017ëoW/ô¼~þËÿ\u000fØ+úïïçûÿo\u001fÿÿýþ\u0012þ÷ÿÿÿÙñ%ûÇÿÿÿüÅJ-Ï¨!õ\u0004> Ô\u0010ú\u001d\u0001î Ô\u0010új\u0001©ÃEárkQn| \u0013¾={Xë\u000b©Æ.zÓóâç¨k½Éÿ¢ÓXAî Csê\bt\u0007ºj\u0001©ÃEárkQn}A\u000f¨!õ\u0004>jpÑx\\Qn}A\u000f¨!õ\u0004>LÐ\tÃEÂÈ >\f\u001a/oXÙ¾°\u001d¾@@xô¾q\u00013\u0010F0Ú´QN\u0001¿>\fºAbxçù¸Ã\tA\u001d0ËzðJóçþ\u0017&µ\u0016çÔ\u0010ú\u001fP?øT@Ôá¢á´Ö¢Üú\u001fPCé¨\u0006§\u0016\u000fÇú×aB\u0016\n3¨äÐ\fn\u0000,ÇÜªA3V9ºÿÓ·\u0012K&»ët\u0007K]þxR±\fRp'iÈº\u001bÈ'\u0018jèåÖÃd<._!n}áÜe\u001a\u0017É­E¹õ\u0004> Ô\u0010új\u0001©ÃEár5E¹õ\u0004> Ô\u0010èn}A\u000f¨\u0006ØéáIÿà\u001e¶Øè[àªÌ$ªj\u0017^\u00121¦T¶B¡û±<oNÿ¿uqÜíp2èÆ[\u0010\u000eE%\u0016éPÔÊ}u\u0006çÔ\u0010ú\u001fPCê\b}A\u000f¨!õ\u0004> Csê\b}A\u000f¨!ôÔ\u0003SÂ!u¾oôPÃßÂ½9ñSz:H\u000e^\u0018]½<\u001cEv\u0015\u0004j\\OÐý\\*^$oHoÊ}\u000bíÓZ?Py\u0002ì¤I\u000f\u000bZsê\b}A\u000f¨\u001fü*$ºN\u001a.\u001bMj-Ï¨!õ\u0004:\u001bPC¡¸\u000f\u0016Áh:s£#zÂtñÜK\u000e\b\u000e\u0005¢ó¥F<ÑÔ?\u0010\\I`Øáº\u0004";
parseEBML(ebml);
