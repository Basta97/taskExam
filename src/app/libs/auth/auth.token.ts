/**
 * Public API base URL for the exam backend; overridden in tests or alternate environments via DI.
 */
import { InjectionToken } from '@angular/core';

export const AUTH_API_URL = new InjectionToken<string>('AUTH_API_URL');
