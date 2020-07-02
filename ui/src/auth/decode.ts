import jwtDecode from "jwt-decode";

interface DecodedIdToken {
  /** The cognito user pool id */
  aud: string;
  /** Possibly when the user signed up? Sun Aug 11 2019 12:18:53 GMT+0100 (British Summer Time). TODO: look up what this is */
  auth_time: number;
  /** Same as sub in the context of cognito */
  "cognito:username": string;
  /** The user's email address */
  email: string;
  /** Always true for passwordless auth */
  email_verified: boolean;
  /** TODO: what is this? */
  event_id: string;
  /** The timestamp when the access expires */
  exp: number;
  /** The timestamp when the access was issued (i.e. todays date) */
  iat: number;
  /** The issuer, in this case the cognito URL */
  iss: string;
  /** The unique identifier for the user in the pool, doesn't change when username changes */
  sub: string;
  /** "id" TODO: look up what this is */
  token_use: string;
}

export function decodeIdToken(idToken: string): DecodedIdToken {
  return jwtDecode(idToken);
}
