/**
 * Created by bangbang93 on 14-11-3.
 */
var launcher = require('./launcher');

var servers = {};

module.exports = function (java){
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
        delete servers[serverName];
    };
    this.startServer = function (serverName){
        var server = this.getServer(serverName);
        if (!!server){
            if (server.start()){
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
    }
};