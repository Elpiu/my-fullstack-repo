import pckJson from '../../package.json';

export const environment = {
  production: true,
  appName: pckJson.name,
  appVersion: pckJson.version,

  appwriteEndpoint: 'http://localhost/v1',
  appwriteProjectId: '691df6cca13ebc2229d8',
  appwriteProjectName: 'client-angular',

  database: '691e33bc00199c3bb5b2',
  tb_entry: 'simpleentry',
  tb_user_metadata: 'usermetadata',
};
