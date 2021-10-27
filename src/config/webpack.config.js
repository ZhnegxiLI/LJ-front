var chalk = require("chalk");
var fs = require('fs');
var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');
var compile = require('es6-template-strings/compile');
var resolveToString = require('es6-template-strings/resolve-to-string');

 
var env = process.env.IONIC_ENV;
var mode = process.env.npm_config_mode;

 
useDefaultConfig.prod.resolve.alias = {
  "@app/env": path.resolve(environmentPath('prod'))
};
 
useDefaultConfig.dev.resolve.alias = {
  "@app/env": path.resolve(environmentPath('dev'))
};
 
if (env !== 'prod' && env !== 'dev') {
  console.log(env)
  // Default to dev config
  useDefaultConfig[env] = useDefaultConfig.dev;
  useDefaultConfig[env].resolve.alias = {
    "@app/env": path.resolve(environmentPath('dev'))
  };
}
 
if (mode == "test") {
  console.log("########### now we are building test version ###########");
}

console.log(env);
replaceConfigXml(mode);
 
function environmentPath(env) {
  if (mode) env = mode;    // for test build
  var filePath = './src/env/env.' + env + '.ts';
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red('\n' + filePath + ' does not exist!'));
  } else {
    return filePath;
  }
}

function replaceConfigXml(mode) {
  console.log("start replacing Config.xml");
  console.log("Build for environment:",mode);

  var ROOT_DIR = process.env['init_cwd'];
  var FILES = {
      SRC: "config.xml.template",
      DEST: "config.xml"
  };
  console.log("start replacing.....1: ",ROOT_DIR)

  var envFile = 'src/env/config.xml.' + mode + '.json';

  var srcFileFull = path.join(ROOT_DIR, FILES.SRC);
  var destFileFull = path.join(ROOT_DIR, FILES.DEST);
  var configFileFull = path.join(ROOT_DIR, envFile); 

  console.log("start replacing.....2: Get template && config files path");

  var templateData = fs.readFileSync(srcFileFull, 'utf8');
  var configData = fs.readFileSync(configFileFull, 'utf8');
  var config = JSON.parse(configData);

  console.log("start replacing.....3: Read template && config files")

  var compiled = compile(templateData);
  var content = resolveToString(compiled, config);

  fs.writeFileSync(destFileFull, content);

  console.log("start replacing.....4: Finished");
}


module.exports = function () {
  return useDefaultConfig;
};
