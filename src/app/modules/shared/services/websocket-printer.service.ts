import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketPrinterService {

  // A URL deve apontar para a URL do WebApp Hardware Bridge.
  private url: string = 'ws://127.0.0.1:12212/printer';
  private websocket!: WebSocket;
  private connected: boolean = false;

  constructor() {
    this.connect();
  }

  private onMessage(evt: MessageEvent): void {
  }

  private onConnect(): void {
    this.connected = true;
  }

  private onDisconnect(): void {
    this.connected = false;
    this.reconnect();
  }

  private connect(): void {
    this.websocket = new WebSocket(this.url);
    this.websocket.onopen = () => this.onConnect();
    this.websocket.onclose = () => this.onDisconnect();
    this.websocket.onmessage = (evt) => this.onMessage(evt);
  }

  private reconnect(): void {
    this.connect();
  }

  submit(data: any): void {
    if (Array.isArray(data)) {
      data.forEach((element) => {
        this.websocket.send(JSON.stringify(element));
      });
    } else {
      this.websocket.send(JSON.stringify(data));
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}
