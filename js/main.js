
var owo = function () {

  var Layout = function () {
    var component = document.createElement("div");
    component.setAttribute("id", "owoPhone");

    document.body.appendChild(component);
  };

  var phone = function (options) {
    Layout();
  };

  return {
    phone: phone
  }
}
