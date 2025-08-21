const AppInternalKey: string = '_appInternal';
export {AppInternalKey}

export interface AppWithInternal {
  _appInternal?: Record<string, any>;
}

