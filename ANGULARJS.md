# ANGULAR.JS

Populárny javasript framework pre tvorbu frontendových aplikácií, so zameraním na singlepage aplikácie. 
Aplikácie sú tvorené pomocou HTML kódu a kontrolného kódu javascripte.
Angular.js využíva nové vlastné tagy a atribúty pomocou, ktorých prepája html s javascriptom.
Taktiež môžeme pridávať výrazy do aplikácií.

```html
<p>Výsledok výpočtu {{ 10 + 5 }}</p>
```

## SinglePage aplikácia

Je aplikácia, ktorá sa načíta pri prvom spustení a následne sa už len obnovuje jej obsah. 
Výhodou je rýchlejšie načítavanie "bez prebliknutí", ale aj minimalizácia prenášaných dát medzi serverom a klientom.

![Obrazok](angularjs/spa.png)

## Two way Data binding

![Obrazok](angularjs/Two_Way_Data_Binding.png)

## Prvky angularu

### Module

```js
var app = angular.module('menoModulu', ['ui.datepicker']);
```

Angular aplikácie sa skladajú z modulov, moduly môžu požadovať ako závislosť iné moduly.

Napr. V aplikácii chceme používať prvok kalendára. Existuje modul ui.datepicker, ktorý túto funkcionalitu podporuje. 
Nastavíme ho ako závislosť a už môžeme využívať prvky tohto modulu v našom vytvorenom module.

### Controller

```js
app.controller('NameOfController', ['$scope', '$http', function($scope, $http) {
  $scope.model = {
    meno: 'Patrik'
  };
}]);
```

Javascriptová časť html elementu. Vyššie uvedený príkaz ukazuje registráciu controlera v angular module `menoModulu`.
˙$scope` a `$http` predstavujú nami zvolené závislosti, ktoré chceme využívať pri programovaní obslužného kódu pre html.

### View

```html
<html ng-app="menoModulu">
<head>
  <script src="angular.min.js"></script>
  <script src="app.js"></script>
</head>
<body ng-controller="NameOfController">
  <p><label>Meno: <input type="text" ng-model="model.meno" /></label></p>
  <p>Hello {{model.meno}}!</p>
</body>
</html>
```

HTML kód prislúchajúci modulu `menoModulu` a používajúci 1 controller `NameOfController`. 
Tento kód ukazuje funkčnosť two way data binding, ktorý automaticky upravuje obsah stránky počas upravovania textu v `<input>`

