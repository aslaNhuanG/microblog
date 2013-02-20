/**
 * Created with JetBrains WebStorm.
 * User: 黄冲
 * Date: 13-2-18
 * Time: 下午4:48
 * To change this template use File | Settings | File Templates.
 */
var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT || {}));


