
var owo = function () {

  var options = {
    media: {
      constraints: {
        audio: true,
        video: false
      },
      render: {
        remote: document.getElementById('owoAudio'),
        local: document.getElementById('owoAudio')
      }
    }
  };

  var userAgent;

  var prepareLayout = function () {
    var component = document.createElement("div");
    component.setAttribute("id", "owoPhone");


    var audio = document.createElement('audio');
    audio.setAttribute("id", "owoAudio");


    component.appendChild(audio);
    document.body.appendChild(component);
  };

  var initSipJs = function (config1) {

    //@todo: get options from remote side

    var config = {
      uri: '1004@109.234.38.141',
      wsServers: 'ws://109.234.38.141:5066',
      authorizationUser: '1004',
      password: '1234',
      register: true,
      log: {
        builtinEnabled: true,
        level: 'debug'
      }
    };

    userAgent = new SIP.UA(config);    
  };

  var phone = function (config) {
    prepareLayout();
    initSipJs(config);
  };

  var call = function (target) {
    userAgent.invite(target, options);
  };

  var bind = function (selectors, callback) {
    elementList = document.querySelectorAll(selectors);
    console.log(elementList);
    Array.prototype.forEach.call(elementList, function (element) {
      return element.addEventListener('click', function () {
        callback(element.innerHTML);
      });
    }); 
  };

  return {
    phone: phone,
    call: call,
    bind: bind
  };

};