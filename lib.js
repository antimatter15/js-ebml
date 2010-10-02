//EBML JSON FORMAT

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
  name: //name
  id: //element id
  mu: //multiple

  data: {
    //if type is master
    Seek: [{ //use human readable names
      //if type is multiple, use array
    }]

    EBMLVersion: 32
  }

  data: 'string' //if type string
  data: 23423 //if type number
  data: 'string' //type binary
}



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
