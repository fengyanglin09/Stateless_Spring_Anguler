import { Injectable } from '@angular/core';
import {MessageService, ToastMessageOptions} from "primeng/api";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class AppNotificationService {

  private _globalKey: string = "global";

  constructor(private messageService: MessageService) {
  }

  info(detail: string, summary?: string, sticky: boolean = false): void {
    this.add({severity: 'info', summary: summary, detail: detail, sticky: sticky});
  }

  success(detail: string, summary?: string, sticky: boolean = false): void {
    this.add({severity: 'success', summary: summary, detail: detail, sticky: sticky});
  }

  warn(detail: string, summary?: string, sticky: boolean = true): void {
    this.add({severity: 'warn', summary: summary, detail: detail, sticky: sticky});
  }

  warnTemplate(message: string, summary?: string, error?: HttpErrorResponse, sticky: boolean = true): void {
    const reason: string = (error?.message || error?.error?.reason) ? `<br/><br/><strong>Reason</strong>: ${error.message || error.error.reason}` : '';
    let detail:string = `${message} ${reason}`;
    this.warn(detail, summary, sticky);
  }

  error(detail: string, summary?: string, sticky: boolean = true): void {
    this.add({severity: 'error', summary: summary, detail: detail, sticky: sticky});
  }

  errorTemplate(message: string, summary?: string, error?: HttpErrorResponse, sticky: boolean = true): void {
    const reason: string = (error?.message || error?.error?.reason) ? `<br/><br/><strong>Reason</strong>: ${error.message || error.error.reason}` : '';
    let detail:string = `${message} ${reason} <br/><br/>Please try again, and if the problem persist contact your help desk.`;
    this.error(detail, summary, sticky);
  }

  add(message: ToastMessageOptions): void {
    if (message) {
      message.key = this._globalKey;
      this.messageService.add(message);
    }
  }

  addAll(messages: ToastMessageOptions[]): void {
    if (messages) {
      messages.forEach(m => m.key = this._globalKey);
      this.messageService.addAll(messages);
    }
  }

  clear(): void {
    this.messageService.clear(this._globalKey);
  }


}
