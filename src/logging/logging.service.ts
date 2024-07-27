import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService {
  private readonly logDir: string;
  private readonly logFileName: string;
  private readonly maxFileSize: number;
  private readonly fileAgeLimit: number;
  private currentFile: string;
  private currentSize: number;
  private currentFileDate: Date;
  private suffix: number;

  constructor(private configService: ConfigService) {
    this.logDir = this.configService.get<string>('logDirectory');
    this.logFileName = this.configService.get<string>('logFileName');
    this.maxFileSize = this.configService.get<number>('maxFileSize');
    this.fileAgeLimit = this.configService.get<number>('fileAgeLimit');
    this.currentSize = 0;
    this.suffix = 0;
    this.currentFileDate = new Date();
    this.currentFile = this.createLogFile();
  }

  private createLogFile(): string {
    const timestamp = this.formatDate(new Date());
    const fileName = `${this.logFileName}-${timestamp}.log`;
    const filePath = path.join(this.logDir, fileName);

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }

    fs.writeFileSync(filePath, '');
    this.currentSize = 0;
    this.suffix++;
    return filePath;
  }

  private formatDate(date: Date): string {
    return date.toISOString().replace(/[:\-]/g, '').replace(/\..+/, '');
  }

  private checkRotation(): void {
    const now = new Date();
    const elapsed = (now.getTime() - this.currentFileDate.getTime()) / 1000;

    if (this.currentSize >= this.maxFileSize || elapsed >= this.fileAgeLimit) {
      this.currentFileDate = now;
      this.suffix = 0;
      this.currentFile = this.createLogFile();
    }
  }

  async log(data: any): Promise<void> {
    const logEntry = JSON.stringify(data) + '\n';
    fs.appendFileSync(this.currentFile, logEntry);
    this.currentSize += Buffer.byteLength(logEntry);
    this.checkRotation();
  }
}
