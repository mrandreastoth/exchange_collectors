// Bitfinex API v2 Private Request in Google Apps Script (GAS).
// By Moosy Research, see more cryptosheets on: https://sites.google.com/site/moosyresearch/projects/cryptos

function BFX_GetBalance() {  
  var bfxrequest =  {
  'apikey'   : '•••••••••',
  'secret'   : '•••••••••',
  'uri'      :'https://api.bitfinex.com',
  'version'  : '/v2/',
  'command'  :'auth/r/wallets',
  'method'   :'POST',
  'payload'  : {}
  };

 var response = BFX_PrivateRequest(bfxrequest);
 Logger.log( JSON.parse(UrlFetchApp.fetch(response.uri, response.params)) );
}


function BFX_PrivateRequest(bfxrequest){
  function HMACSHA384HEX(s, secret) { return ToHex(Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_384, s, secret)).toString(); }
  function ToHex(s) { return s.map(function(byte) { return ('0' + (byte & 0xFF).toString(16)).slice(-2);}).join('');  }
  
  var nonce   =  new Date().getTime().toString(),
      payload = '/api'+bfxrequest.version+bfxrequest.command+nonce+ JSON.stringify(bfxrequest.payload),
      params  = {
          'method'            : bfxrequest.method,
          'muteHttpExceptions': true,
          'contentType'       : 'application/json',
          'headers': {
            'bfx-nonce'       : nonce,
            'bfx-apikey'      : bfxrequest.apikey,
            'bfx-signature'   : HMACSHA384HEX(payload, bfxrequest.apisecret) ,
           },
          'payload'           : JSON.stringify(bfxrequest.payload)
      };
  return  { uri: bfxrequest.uri + bfxrequest.version + bfxrequest.command, params: params};
}
