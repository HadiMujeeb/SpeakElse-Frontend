export interface VerifyOtpRequest {
  email: string;
  enteredotp: string;
}

export interface VerifyOtpReponse {
  success: string;
  message: string;
  accessToken: string;
}
