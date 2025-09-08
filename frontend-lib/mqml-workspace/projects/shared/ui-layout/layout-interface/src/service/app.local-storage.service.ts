import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppLocalStorageService {

  constructor() { }

  public set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public get(key: string): any | null {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value): null;
    } catch (error) {
      console.error("The local storage object ["+key+"] is corrupted. Automatically clearing.", error);
      this.remove(key);
    }
    return null;
  }

  public getAll(): Map<string, any> {
    let local: Map<string, any> = new Map<string, any>();
    for (let [key, value] of Object.entries(localStorage)) {
      try {
        local.set(key, JSON.parse(value));
      } catch (error) {
        console.error("The local storage object ["+key+"] is corrupted.", error);
      }
    }
    return local;
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }

  public consoleAllDebug(): any {
    // eslint-disable-next-line no-console
    console.debug("***Local Storage***");
    let local = this.getAll();
    if (local.size > 0) {
      for (const [key, value] of Array.from(local.entries())) {
        // eslint-disable-next-line no-console
        console.debug("\tKey:", key, "\n\tValue:", value);
      }
    } else {
      // eslint-disable-next-line no-console
      console.debug("\tCurrently Empty!");
    }
  }

  /**
   * Sets a value in local storage with an expiration time
   * @param key - the key to store the value under
   * @param value - the value to store
   * @param expiration  - the expiration time in hours
   */
  public setWithExpiration(key: string, value: any, expiration: number): void {
    // use hours as the default time unit
    expiration = expiration * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const now = new Date();
    const item = {
      value: value,
      expiration: now.getTime() + expiration
    };
    this.set(key, item);
  }

  public getWithExpiration(key: string): any | undefined {
    const item = this.get(key);
    // already parsed by the get method
    if (!item) {
      return undefined;
    }
    const now = new Date();
    if (now.getTime() > item.expiration) {
      this.remove(key);
      return undefined;
    }
    return item.value;
  }
}
