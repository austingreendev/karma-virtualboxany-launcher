karma-virtualboxany-launcher
===================

Launcher for using any browser in a Virtualbox VM.

This is a simple implementation for working primarily with multiple browser types in Windows VMs.

There are definitely bugs with this so please remember to report anything you find in the [issues](https://github.com/austin94/karma-virtualboxany-launcher/issues).

## Installation
Install Virtualbox 5.X+ here [virtualbox.org](https://www.virtualbox.org/).

For this example I will be using the launcher to test with IE10 from a free VM provided by Microsoft.  [Download](https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/) and import the OVA file into Virtualbox.

Install the package as a development dependency.
```
npm install karma-virtualboxany-launcher --save-dev
```

## Configure your karma.conf.js
```
...
customLaunchers: {
    'virtualIE10': {
        base: 'VirtualBoxAny',
        config: {
            vm_name: 'IE10 - Win7', // required - name of the VM to target
            use_gui: false, // optional - allows VM to start headless
            cmd: 'C:\\Program Files\\Internet Explorer\\iexplore.exe' // required - can be a path to any browser,
            shutdown: false, // Whether or not to shut down the VM when complete
            user: 'IEUser', // optional - defaults to those provided with Modern.IE vm's
            password: 'Passw0rd!' // optional - defaults to those provided with Modern.IE vm's
        }
    },
    // This isn't limited to IE only. Manually open a VM and install any browser you would like to test.
    'virtualFirefox': {
        base: 'VirtualBoxAny',
        config: {
            vm_name: 'IE10 - Win7', // required - name of the VM to target
            cmd: 'C:\\Program Files\\Mozilla Firefox\\firefox.exe' // required - can be a path to any browser
        }
    },
},

// start these browsers
// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
browsers: ['virtualIE10', 'virtualFirefox'],
...
```
## Limitations / Known Issues
* This may not work with VM's that are not Windows based
* After Karma is stopped the VM's are left open unless the `shutdown` option is set to `true` in the configuration.  This is on purpose to allow tests to be re-ran quickly.
