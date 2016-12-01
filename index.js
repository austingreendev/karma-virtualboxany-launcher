var url = require('url');
var virtualbox = require('virtualbox');
var _ = require('lodash');

function VirtualBoxAnyInstance(baseBrowserDecorator, logger, args) {
    baseBrowserDecorator(this);
    var log = logger.create('VirtualBoxAny: ');

    args.config = _.defaults(args.config, {
        vm_name: null,
        user: 'IEUser',
        password: 'Passw0rd!',
        use_gui: false,
        shutdown : false,
        cmd: 'C:\\Program Files\\Internet Explorer\\iexplore.exe'
    });

    if (!args.config.vm_name) {
        throw new Error('No VirtualBox VM name was provided in config.');
    }

    this.credentials = {
        user: args.config.user,
        password: args.config.password
    };

    this._getOptions = function(url) {
        var urlObj = url.parse(url, true);
        handleXUaCompatible(args, urlObj);
        delete urlObj.search; //url.format does not want search attribute
        url = url.format(urlObj);

        return [
            '-extoff'
        ].concat(args.flags || {}, [url]);

        function handleXUaCompatible(args, urlObj) {
            if (args['x-ua-compatible']) {
                urlObj.query['x-ua-compatible'] = args['x-ua-compatible'];
            }
        }
    };

    this._start = function(url) {
        var self = this;
        var conf = {
          user: self.credentials.user,
          password: self.credentials.password,
          vm: args.config.vm_name,
          cmd: args.config.cmd,
          params: url
        };

        conf.params = conf.params.replace('localhost', '10.0.2.2');

        log.debug('Starting virtualbox vm [' + conf.vm + '] with url ' + conf.params);

        virtualbox.start(conf.vm, args.config.use_gui, function(err) {
            if (err) { throw err; }
            self.openProcess(conf);
        });
    };

    this.openProcess = function(conf) {
      var self = this;
      log.debug('Attempting to open command: ' + conf.cmd);

      virtualbox.exec(conf, function(err){
        if (err && /The guest execution service is not ready/.test(err.message)) {
          log.debug('Host VM not loaded. Waiting...');

          setTimeout(function() {
            self.openProcess(conf);
          }, 10000);
        } else if (err) {
          log.debug(err);
        }
      });
    };

    this.on('kill', function (done) {
        if (!args.config.shutdown) {
            done();
            return;
        }

        virtualbox.acpipowerbutton(args.config.vm_name, function(err){
            if (err) {
                log.debug(err);
            }

            done();
        })
    });
}

VirtualBoxAnyInstance.$inject = ['baseBrowserDecorator', 'logger', 'args'];
VirtualBoxAnyInstance.prototype = {
    name: 'VirtualBoxAny',
    DEFAULT_CMD: {
        win32: 'C:\\Program Files\\Internet Explorer\\iexplore.exe'
    },
    ENV_CMD: 'IE_BIN'
};

module.exports = {
    'launcher:VirtualBoxAny': ['type', VirtualBoxAnyInstance]
};