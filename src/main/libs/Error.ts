import { IpcMainEvent } from 'electron'

class ErrorCreate {
  private status: number | undefined
  private message: string | undefined

  constructor(private _event: IpcMainEvent) {}

  public setStatus(code: number): void {
    this.status = code
  }

  public setMessage(message: string): void {
    this.message = message
  }

  public sendError(): void {
    this._event.sender.send('ErrorCreate', {
      status: this.status,
      message: this.message
    })
  }
}

export default ErrorCreate
