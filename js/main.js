
var owo = function () {

  var owoUIControls = function () {

    var sheet = (function () {
        var style = document.createElement("style");
        style.setAttribute('type', 'text/css');

        style.appendChild(document.createTextNode(cssOwoPhone));
        document.head.appendChild(style);

        return style.sheet;
    })();

    var prefix = 'owoPhoneControls';

    var component = document.createElement("div");
    component.setAttribute("id", prefix + "Base");    

    var callButton = document.createElement("input");
    callButton.setAttribute("id", prefix + "CallButton");
    callButton.setAttribute("type", "button");
    callButton.setAttribute("value", "Call");

    var optionButton = document.createElement("input");
    optionButton.setAttribute("id", prefix + "OptionButton");
    optionButton.setAttribute("type", "button");
    optionButton.setAttribute("value", "*");
    
    var statusString = document.createElement("div");
    statusString.setAttribute("id", prefix + "StatusString");

    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', prefix + 'Input');

    var sipStatusIndicator = document.createElement('div');
    sipStatusIndicator.setAttribute('id', prefix + 'SipStatusIndicator');
    sipStatusIndicator.setAttribute('class', 'red');

    component.appendChild(sipStatusIndicator);
    component.appendChild(input);
    component.appendChild(callButton);
    component.appendChild(optionButton);
    component.appendChild(statusString);

    document.body.appendChild(component);

    return {
      base: component,
      callButton: callButton,
      optionButton: optionButton,
      inputText: input,
      sipStatusIndicator: sipStatusIndicator,
      statusString: statusString
    }
  };

  var ui = owoUIControls();

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

  var sipUserAgent;

  var prepareLayout = function () {
    var component = document.createElement("div");
    component.setAttribute("id", "owoPhone");

    var audio = document.createElement('audio');
    audio.setAttribute("id", "owoAudio");

    component.appendChild(audio);
    document.body.appendChild(component);

    return component;
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

    sipUserAgent = new SIP.UA(config);
  };


  var sipUserAgentStatus = function () {
    return {
      //isRegistered: sipUserAgent.isRegistered(),
      //isConnected: sipUserAgent.isConnected(),
      color: sipUserAgent.isRegistered() ? 'green' : 
        (sipUserAgent.isConnected() ? 'yellow' : 'red')
    }
  }

  var addListeners = function () {
    ui.callButton.addEventListener('click', function (evt) {
      var target = ui.inputText.value;      
      call(target);
    });

    sipUserAgent.on('connected', function () {
      ui.sipStatusIndicator.setAttribute("class", sipUserAgentStatus().color);
    });
    sipUserAgent.on('disconnected', function () {
      ui.sipStatusIndicator.setAttribute("class", sipUserAgentStatus().color);
    });
    sipUserAgent.on('registered', function () {
      ui.sipStatusIndicator.setAttribute("class", sipUserAgentStatus().color);
    });
  };

  var phone = function (config) {
    prepareLayout();
    initSipJs(config);

    addListeners();
  };


  var call = function (target) {
    sipUserAgent.invite(target, options);
  };

  var bind = function (selectors, callback) {
    elementList = document.querySelectorAll(selectors);
    //console.log(elementList);
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


window.addEventListener("load", function (event) {
    var owoPhone = new owo();
    owoPhone.phone();

    owoPhone.bind('.call', function (target) {
      owoPhone.call(target);
    });
});