/**
 * Created by bangbang93 on 14-11-3.
 */
var launcher = require('./launcher');
var events = require('events');
var util = require('util');

var servers = {};

var daemon = function (java){
    var that = this;
    var Launcher = launcher(java);
    this.addServer = function (serverName, serverPath, jarFile, opt){
        opt = opt || [];
        servers[serverName] = new Launcher(serverName, serverPath, jarFile, opt);
    };
    this.getServer = function (serverName){
        return servers[serverName];
    };
    this.deleteServer = function (serverName){
        var server = this.getServer(serverName);
        if (server && server.isRunning){
            return false;
        }
        delete servers[serverName];
        return true;
    };
    this.startServer = function (serverName){
        var that = this;
        var server = this.getServer(serverName);
        if (!!server){
            if (server.start()){
                server.on('output', function (data){
                    that.emit('output', {
                        server: serverName,
                        data: data
                    })
                });
                return {
                    stdin: server.stdin,
                    stdout: server.stdout,
                    stderr: server.stderr
                }
            } else {
                return false;
            }
        }
    };
    this.stopServer = function (serverName){
        var server = this.getServer(serverName);
        if (!!server) {
            if (server.isRunning){
                server.stop();
            }
        }
    };
    this.killServer = function (serverName){
        var server = this.getServer(serverName);
        if (!!server){
            if (server.isRunning){
                server.kill();
            }
        }
    };
    this.changeJava = function (javaPath){
        java = javaPath;
    };

};

util.inherits(daemon, events.EventEmitter);

module.exports = daemon;