import { IpcMainEvent } from 'electron'

class ErrorCreate {
  private status: number | undefined
  private message: string | undefined

  constructor(private _event: IpcMainEvent) {}

  public setStatus(code: number): this {
    this.status = code
    return this
  }

  public setMessage(message: string): this {
    this.message = message
    return this
  }

  public sendError(): void {
    this._event.sender.send('ErrorCreate', {
      status: this.status,
      message: this.message
    })
  }
}

export default ErrorCreate
