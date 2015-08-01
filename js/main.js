
var owo = function () {

  var sheet = (function () {
    var cssOwoPhone = '{{insertedCss}}';
    
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
      register: {
        prepare: function (value) {
          return value === 'true';
        }
      },
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
    },
    getOptionFromStorage: function () {
      var storage = window.localStorage;
      var obj = {};
      for (var key in this.propertiesMap){
        obj[key] = (this.propertiesMap[key].prepare) ? 
          this.propertiesMap[key].prepare(storage.getItem(key)) : storage.getItem(key);
      }
      return obj;
    },
    saveOptionToStorage: function (object){
      var storage = window.localStorage;
      for (var element in object){
        storage.setItem(element, object[element]);
      };
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

    saveButton.addEventListener('click', function (evt) {      
      Config.saveOptionToStorage(Config.getOptionFromForm());
    });

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

    component.addEventListener('click', function (evt) {
      var right = component.getAttribute('style') || '';
      if (right.indexOf('right:0px;') == -1) {
        component.setAttribute('style', 'right:0px;');
      } else {
        component.setAttribute('style', 'right:-235px;')
      }
    });

    var callButton = document.createElement("button");
    callButton.setAttribute("id", prefix + "CallButton");
    callButton.setAttribute("type", "button");
    callButton.setAttribute("class", "btn-b");
    //callButton.setAttribute("value", "Call");
    callButton.innerHTML = 'Call';


    callButton.setBusy = function () {
      this.classList.remove("btn-b");
      this.classList.add("btn-c");
    };

    callButton.setFree = function () {
      this.classList.remove("btn-c");
      this.classList.add("btn-b");
    }

    var optionButton = document.createElement("input");
    optionButton.setAttribute("id", prefix + "OptionButton");
    optionButton.setAttribute("type", "button");
    optionButton.setAttribute("value", "*");
    
    var statusString = document.createElement("div");
    statusString.setAttribute("id", prefix + "StatusString");

    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', prefix + 'Input');

    input.addEventListener('click', function (evt) {
      if (evt.stopPropagation) evt.stopPropagation();
    });

    var sipStatusIndicator = document.createElement('div');
    sipStatusIndicator.setAttribute('id', prefix + 'SipStatusIndicator');
    sipStatusIndicator.setAttribute('class', 'red');

    var icon = document.createElement("img");
    var iconSvg = '<svg width="24" height="24 " xmlns="http://www.w3.org/2000/svg"><g><path clip-rule="evenodd" d="m6.47719,1.62291c1.21752,-0.22999 2.01542,1.14288 2.62266,2.09006c0.59111,0.91995 1.31839,1.99927 1.02485,3.19662c-0.16341,0.67181 -0.77066,1.03797 -1.22963,1.43439c-0.45291,0.39138 -1.14288,0.75048 -1.31032,1.35168c-0.27336,0.97543 0.32481,1.99927 0.69501,2.58231c0.84126,1.31738 1.85805,2.50464 3.15627,3.5648c0.62843,0.51445 1.50097,1.20138 2.37553,1.02485c1.30629,-0.26428 1.65127,-1.8752 3.07355,-2.09006c1.35369,-0.20477 2.26961,0.77671 3.03421,1.4344c0.73636,0.6365 1.92463,1.45154 1.84393,2.54196c-0.04741,0.62641 -0.54975,1.01477 -0.98552,1.39304c-0.44283,0.38634 -0.83118,0.82009 -1.26896,1.10555c-1.06016,0.69198 -2.36039,1.03091 -3.85329,0.98451c-1.46364,-0.04539 -2.62972,-0.54269 -3.68786,-1.10656c-2.06888,-1.10354 -3.704,-2.65595 -5.24431,-4.3859c-1.51509,-1.7007 -2.91418,-3.71409 -3.68786,-5.94032c-0.96534,-2.78002 -0.45493,-5.63569 1.10757,-7.41708c0.26428,-0.30261 0.68189,-0.61834 1.06419,-0.94315c0.38129,-0.32582 0.73434,-0.72022 1.26997,-0.82109z" fill="#FFFFFF" fill-rule="evenodd"/></g></svg>';
    var iconEncoded = encodeURIComponent(iconSvg);
    icon.setAttribute('src', 'data:image/svg+xml;utf8,' + iconEncoded);
    icon.setAttribute('id', prefix + 'phoneIcon');
    icon.setAttribute('style', 'padding: 0px 10px 0px 0px; margin: 0px 0px 0px 0px; vertical-align: middle;');

    var configUI = owoUIConfig(Config.propertiesMap);

    component.appendChild(icon);
    //component.appendChild(sipStatusIndicator);
    component.appendChild(input);
    component.appendChild(callButton);
    component.appendChild(optionButton);
    component.appendChild(statusString);

    document.body.appendChild(configUI.overlay);
    document.body.appendChild(configUI.component);

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

  var state = {
    isBusy: function () {
      return (this.status != 'free');
    },
    setState: function (stateIn) {
      this.status = stateIn;
    },
    getState: function () {
      return this.status;
    }
  };

  state.setState('free');

  var sipUserAgent;

  var prepareLayout = function () {
    var component = document.createElement("div");
    component.setAttribute("id", "owoPhone");

    var audio = document.createElement('audio');
    audio.setAttribute("id", "owoAudio");    

    component.appendChild(audio);
    document.body.appendChild(component);    
  };

  var initSipJs = function () {

    //@todo: get options from remote side    

    var config = Config.getOptionFromStorage();
    //console.log('config', config);
    sipUserAgent = new SIP.UA(config);
  };


  var sipUserAgentStatus = function () {
    return {
      color: sipUserAgent.isRegistered() ? 'green' : 
        (sipUserAgent.isConnected() ? 'yellow' : 'red')
    }
  }

  var addListeners = function () {
    ui.callButton.addEventListener('click', function (evt) {
      if (evt.stopPropagation) evt.stopPropagation();
      if (!state.isBusy()){
        var target = ui.inputText.value;
        call(target);
      } else {
        state.setState('free');
        release();        
      }
    });

    ui.optionButton.addEventListener('click', function (evt) {
      Config.setOptionToForm(Config.getOptionFromStorage());
      ui.configUI.component.style.display = (ui.configUI.component.style.display == 'none') ? '' : 'none';
      ui.configUI.overlay.style.display = (ui.configUI.overlay.style.display == 'none') ? '' : 'none';
      if (evt.stopPropagation) evt.stopPropagation();
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

    sipUserAgent.on('invite', function (sessionIn) {
      state.setState('busy');
      ui.callButton.setBusy();

      sessionIn.on('accepted', function (data) {
        console.log('accepted', data);
      });

      sessionIn.on('rejected', function (response, cause) {
        console.log('rejected', response, cause);
      });

      sessionIn.on('cancel', function () {
        console.log('cancel');
      });

      sessionIn.on('bye', function (request) {
        console.log('bye', request);
      });

      sessionIn.on('failed', function (response, cause) {
        console.log('failed', response, cause);
      });

      sessionIn.on('terminated', function (response, cause) {
        console.log('terminated', response, cause);
      });

      sessionIn.accept({
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
      });
    });
  };

  var phone = function () {
    prepareLayout();
    initSipJs();

    addListeners();
  };

  var session = null;

  var call = function (target) {
    if (target !== '') {
      

      session = sipUserAgent.invite(target, document.getElementById('owoAudio'));

      session.on('accepted', function (data) {
        console.log('accepted', data);
      });

      session.on('rejected', function (response, cause) {
        console.log('rejected', response, cause);
      });

      session.on('cancel', function () {
        console.log('cancel');
      });

      session.on('bye', function (request) {
        console.log('bye', request);
      });

      session.on('failed', function (response, cause) {
        console.log('failed', response, cause);
      });

      session.on('terminated', function (response, cause) {
        console.log('terminated', response, cause);
        release();
      });
      
      state.setState('busy')
      ui.callButton.setBusy();
    }
    
  };

  var release = function () {
    if (session) {
      session.terminate();
    }
    state.setState('free');
    ui.callButton.setFree();
  }

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