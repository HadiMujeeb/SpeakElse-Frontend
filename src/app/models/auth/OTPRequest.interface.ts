export interface VerifyOtpRequest {
  email: string | null;
  enteredotp: string;
}

export interface VerifyOtpReponse {
  success: string;
  message: string;
}
