import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, ErrorHandler, NgZone } from '@angular/core';
import { HexManagementService } from './shared/services/hex-management';

// TODO re-check the implementation
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private hexManagementService: HexManagementService,
    private zone: NgZone,
  ) {}

  handleError(error: any) {
    // Check if it's an error from an HTTP response
    if (!(error instanceof HttpErrorResponse)) {
      error = error.rejection; // get the error object
    }
    // TODO: Place error handling component here
    this.zone.run(() => {});

    console.error('Error from global error handler', error);
  }
}
