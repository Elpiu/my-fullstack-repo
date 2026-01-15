import pckJson from '../../package.json';

export const environment = {
  production: true,
  appName: pckJson.name,
  appVersion: pckJson.version,

  appwriteEndpoint: 'https://fra.cloud.appwrite.io/v1',
  appwriteProjectId: '691df6cca13ebc2229d8',
  appwriteProjectName: 'Minder',

  database: '691e33bc00199c3bb5b2',
  tb_entry: 'simpleentry',
  tb_user_metadata: 'usermetadata',
  tb_task_item: 'taskitem',
};
