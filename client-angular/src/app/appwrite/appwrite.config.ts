import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { Account, Client, Databases, Functions, TablesDB } from 'appwrite';
import { environment } from '../../environments/environment';

export const APPWRITE_CLIENT = new InjectionToken<Client>('AppwriteClient');
export const APPWRITE_AUTH = new InjectionToken<Account>('AppwriteAuth');
//export const APPWRITE_DATABASE = new InjectionToken<Databases>('AppwriteDatabase');
export const APPWRITE_FUNCTION = new InjectionToken<Functions>('AppwriteFunction');

export const APPWRITE_TABLE_DATABASE = new InjectionToken<TablesDB>('AppwriteTableDatabase');

export function provideAppWriteClient(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APPWRITE_CLIENT,
      useFactory: () => {
        return new Client()
          .setEndpoint(environment.appwriteEndpoint)
          .setProject(environment.appwriteProjectId);
      },
    },
    {
      provide: APPWRITE_AUTH,
      useFactory: (client: Client) => new Account(client),
      deps: [APPWRITE_CLIENT],
    },
    //{
    //  provide: APPWRITE_DATABASE,
    //  useFactory: (client: Client) => new Databases(client),
    //  deps: [APPWRITE_CLIENT],
    //},
    {
      provide: APPWRITE_TABLE_DATABASE,
      useFactory: (client: Client) => new TablesDB(client),
      deps: [APPWRITE_CLIENT],
    },
    {
      provide: APPWRITE_FUNCTION,
      useFactory: (client: Client) => new Functions(client),
      deps: [APPWRITE_CLIENT],
    },
  ]);
}
