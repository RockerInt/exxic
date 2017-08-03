#!/bin/env node
//  OpenShift sample Node application
const express       = require('express'),
      fs            = require('fs'),
      body_parser   = require('body-parser'),
      path          = require('path'),
      nodemailer    = require('nodemailer'),
      contentTypes  = require('./utils/content-types'),
      sysInfo       = require('./utils/sys-info');


/**
 *  Define the sample application.
 */
var Empresarios = function () {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function () {
        //  Set the environment variables we need.
        self.ipaddress = process.env.NODE_IP || 'localhost';
        self.port = process.env.NODE_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_*_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function () {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['i0'] = fs.readFileSync('./public/index.html');
        self.zcache['c0'] = fs.readFileSync('./public/contacto.html');
        self.zcache['k0'] = fs.readFileSync('./public/contact.html');
        self.zcache['i1'] = fs.readFileSync('./public/index.html');
        self.zcache['c1'] = fs.readFileSync('./public/contacto.html');
        self.zcache['k1'] = fs.readFileSync('./public/contact.html');
        self.zcache['i2'] = fs.readFileSync('./public/index.html');
        self.zcache['c2'] = fs.readFileSync('./public/contacto.html');
        self.zcache['k2'] = fs.readFileSync('./public/contact.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function (key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function (sig) {
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating sample app ...',
                Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()));
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function () {
        //  Process on exit and signals.
        process.on('exit', function () { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function (element, index, array) {
            process.on(element, function () { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */

    self.getPage = function (req,page) {
        var domain = req.headers.host + "";	
        if (domain.indexOf('jonathanjimenez.co') !== -1) {		
            return page == 'index' ? self.cache_get('i1') : (page == 'contact' ? self.cache_get('k1') : self.cache_get('c1'));		
        }		
        else if (domain.indexOf('muisca.tech') !== -1) {		
            return page == 'index' ? self.cache_get('i2') : (page == 'contact' ? self.cache_get('k2') : self.cache_get('c2'));
        }		
        else {		
            return page == 'index' ? self.cache_get('i0') : (page == 'contact' ? self.cache_get('k0') : self.cache_get('c0'));
        }
    };

    self.createRoutes = function () {
        self.routes = {};

        // Routes for /health, /asciimo, /env and /
        self.routes['/health'] = function (req, res) {
            res.writeHead(200);
            res.end();
        };

        self.routes['/domain'] = function (req, res) {
            // var link = "http://i.imgur.com/kmbjB.png";
            var domain = req.headers.host;
            var subDomain = domain.split('.');

            if (subDomain.length > 2) {
                subDomain = subDomain[0].split("-").join(" ");
            } else {
                subDomain = "Everyone ";
            }

            res.send("<html><body>Este es el dominio: " + domain + " y este el subdominio: " + subDomain + " </body></html>");
        };

        self.routes['/env'] = function (req, res) {
            var content = 'Version: ' + process.version + '\n<br/>\n' +
                'Env: {<br/>\n<pre>';
            //  Add env entries.
            for (var k in process.env) {
                content += '   ' + k + ': ' + process.env[k] + '\n';
            }
            content += '}\n</pre><br/>\n'
            res.send('<html>\n' +
                '  <head><title>Node.js Process Env</title></head>\n' +
                '  <body>\n<br/>\n' + content + '</body>\n</html>');
        };

        self.routes['/info/gen'] = function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-cache, no-store');
            res.end(JSON.stringify(sysInfo[url.slice(6)]()));
        };

        self.routes['/info/poll'] = function (req, res) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-cache, no-store');
            res.end(JSON.stringify(sysInfo[url.slice(6)]()));
        };

        self.routes['/contacto'] = function (req, res) {
            res.set('Content-Type', 'text/html');
            res.send(self.getPage(req,'contacto'));
        };

        self.routes['/contact'] = function (req, res) {
            res.set('Content-Type', 'text/html');
            res.send(self.getPage(req,'contact'));
        };

        self.routes['/'] = function (req, res) {
            res.set('Content-Type', 'text/html');
            res.send(self.getPage(req,'index'));
        };
    };


    self.transporter = nodemailer.createTransport({
        host: 'Smtp.gmail.com',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: 'jonathanint4life@gmail.com',
            pass: 'j1o2n3a4t5'
        }
    });

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function () {
        self.createRoutes();
        self.app = express();

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
        self.app.use(express.static(__dirname + '/public'));
        self.app.use(body_parser.urlencoded({extended:true}));
        self.app.post('/contacto', function (req, res) {
            // setup email data with unicode symbols
            var mailOptions = {
                from: '"Empresarios Siglo XXI" <jonathanint4life@gmail.com>', // sender address
                to: 'jonathanint4life@gmail.com', // list of receivers
                subject: 'Solicitud de Contacto de "' + req.body.name + ' : ' + req.body.email + '"', // Subject line
                html: '<b>Solicitud de Contacto</b><br><br>'+
                      'De: ' + req.body.name + ' - ' + req.body.email + '<br>' +
                      'Telefono: ' + req.body.phone  + '<br><br><br>' +
                      req.body.message // html body
            };

            // send mail with defined transport object
            self.transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });

            res.set('Content-Type', 'text/html');
            res.send(self.getPage(req,'contact'));
        });
        self.app.post('/contact', function (req, res) {
            // setup email data with unicode symbols
            var mailOptions = {
                from: '"Empresarios Siglo XXI" <jonathanint4life@gmail.com>', // sender address
                to: 'jonathanint4life@gmail.com', // list of receivers
                subject: 'Solicitud de Contacto de "' + req.body.name + ' : ' + req.body.email + '"', // Subject line
                html: '<b>Solicitud de Contacto</b><br><br>'+
                      'De: ' + req.body.name + ' - ' + req.body.email + '<br>' +
                      'Telefono: ' + req.body.phone  + '<br><br><br>' +
                      req.body.message // html body
            };

            // send mail with defined transport object
            self.transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });

            res.set('Content-Type', 'text/html');
            res.send(self.getPage(req,'contact'));
        });
        // self.app.use('/contacto', express.static(__dirname + '/public/contacto.html'));
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function () {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function () {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function () {
            console.log('%s: Node server started on %s:%d ...',
                Date(Date.now()), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new Empresarios();
zapp.initialize();
zapp.start();

