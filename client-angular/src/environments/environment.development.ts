import pckJson from '../../package.json';

export const environment = {
  production: false,
  appVersion: pckJson.version,

  appName: 'client-angular',

  appwriteEndpoint: 'http://localhost/v1',
  appwriteProjectId: '69793eec000f01a1fee0',
  appwriteProjectName: 'flip-card',

  database: '691e33bc00199c3bb5b2',
  tb_entry: 'entry',
};
