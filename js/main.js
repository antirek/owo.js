
var owo = function () {

  var sheet = (function () {
    var style = document.createElement("style");
    style.setAttribute('type', 'text/css');

    style.appendChild(document.createTextNode(cssOwoPhone));
    document.head.appendChild(style);

    return style.sheet;
  })(); 


  var Config = {
    propertiesMap: {
      uri: '',
      wsServers: '',
      authorizationUser: '',
      password: '',
      register: '',
      displayName: ''
    },
    getOptionFromForm: function () {
      var q = {}, lo = {};
      for (var element in ui.configUI.elements){
        q[ui.configUI.elements[element].name] = ui.configUI.elements[element].value;
      }
      for (var property in this.propertiesMap){        
        lo[property] = q[property];
      }
      return lo;
    },
    setOptionToForm: function (object) {
      for (var element in ui.configUI.elements){
        ui.configUI.elements[element].value = object[ui.configUI.elements[element].name] || '';
      }
    }
  };

  

  var owoUIConfig = function (propertiesMap) {
    var prefix = "owoPhoneConfig";
    var configsElements = [];

    var overlay = document.createElement("div");
    overlay.setAttribute("id", prefix + "BaseOverlay");
    overlay.style.display = 'none';

    var component = document.createElement("div");
    component.setAttribute("id", prefix + "Base");
    component.style.display = 'none';

    var createFormInput = function (obj) {
      var el = document.createElement('input');
      el.setAttribute('class', 'smooth');
      
      for (var property in obj) {
        el.setAttribute(property, obj[property])
      }
      return el;
    };

    for (var property in propertiesMap) {
      var obj = {
        type: propertiesMap[property].type || 'text',
        id: prefix + property,
        name: property,
        placeholder: propertiesMap[property].placeholder || property,
        value: propertiesMap[property].value || ''
      };

      var element = createFormInput(obj);
      configsElements.push(element);
      component.appendChild(element);
    };
        

    var saveButton = document.createElement("input");
    saveButton.setAttribute("id", prefix + "SaveButton");
    saveButton.setAttribute("type", "button");
    saveButton.setAttribute("value", "Save");

    var closeButton = document.createElement("input");
    closeButton.setAttribute("id", prefix + "CloseButton");
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("value", "Close");

    closeButton.addEventListener('click', function (evt) {
      component.style.display = (component.style.display == 'none') ? '' : 'none';
      overlay.style.display = (overlay.style.display == 'none') ? '' : 'none';
    });

    component.appendChild(saveButton);
    component.appendChild(closeButton);

    //overlay.appendChild(component);

    return {
      component: component,
      overlay: overlay,
      elements: configsElements
    };
  };

  var owoUIControls = function () {

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
    sipStatusIndicator.setAttribute('class', 'red')

    var configUI = owoUIConfig(Config.propertiesMap);

    component.appendChild(sipStatusIndicator);
    component.appendChild(input);
    component.appendChild(callButton);
    component.appendChild(optionButton);
    component.appendChild(statusString);

    component.appendChild(configUI.overlay);
    component.appendChild(configUI.component);

    document.body.appendChild(component);

    return {
      base: component,
      callButton: callButton,
      optionButton: optionButton,
      inputText: input,
      sipStatusIndicator: sipStatusIndicator,
      statusString: statusString,
      configUI: configUI
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
      displayName: 'Ivan',
      log: {
        builtinEnabled: false,
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

    ui.optionButton.addEventListener('click', function (evt) {
      ui.configUI.component.style.display = (ui.configUI.component.style.display == 'none') ? '' : 'none';
      ui.configUI.overlay.style.display = (ui.configUI.overlay.style.display == 'none') ? '' : 'none';
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
    if (target !== '') sipUserAgent.invite(target, options);
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
    bind: bind,
    config: Config
  };

};

var owoPhone;

window.addEventListener("load", function (event) {
    owoPhone = new owo();
    owoPhone.phone();

    owoPhone.bind('.call', function (target) {
      owoPhone.call(target);
    });
});