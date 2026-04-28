import { Injectable } from '@angular/core';
import { Adaptor } from '../models/adaptor';
import { LoginResponse } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthAdaptor implements Adaptor {

  adapt(data: any): LoginResponse {
    return {
      message: data?.message || data?.payload?.message,
      token: data?.token || data?.payload?.token || data?.payload?.accessToken || data?.user?.token || data?.data?.token || data?.accessToken || data?.access_token || '',
      email: data?.email?.email || data?.email || data?.user?.email || data?.data?.email || '',
    };
  }

}