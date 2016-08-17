##Snappy

Snappy is an a Snapchat clone, using the [Ionic framwork](http://ionicframework.com/), utilizing AngularJS.

###Configuration:

Ionic is required for the build out of this application.  It can be installed through NPM using:
```bash
$ npm install -g ionic
```
(More information [here](https://www.npmjs.com/package/ionic))

Run the following commands to install all depedencies:
```bash
$ npm install
$ bower install
```

Snappy uses Firebase for data storage.  A Firebase account and application can be created [here](https://firebase.google.com/).  Create a file at:
```
www/app/constants/FirebaseCreds.js
```
Add the following content adding in your Firebase application configuration information.
```js
"use strict";

// Firebase API keys
snappy.constant('FirebaseCreds', {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  storageBucket: "YOUR_STORAGE_BUCKET",
});
```
###To Build:
Ionic has several options for building and running your application.  For example, to run on the iOS simulator included with Xcode, run:
```bash
ionic run ios
```
To build for device deployment, run:
```bash
ionic build ios
```
More information on testing your application can be found [here](http://ionicframework.com/docs/guide/testing.html).

