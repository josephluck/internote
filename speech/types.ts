export interface SpeechRequestBody {
  /**
   * The note ID
   */
  id: string;
  /**
   * The words to turn in to speech
   */
  words: string;
  /**
   * The voice to use for synthesis
   */
  voice: AvailableVoice;
}

export interface SpeechResponseBody {
  /**
   * A full URL pointing to the audio file that has been made
   */
  src: string;
  /**
   * The S3 key that the speech file resides in
   */
  key: string;
}

/**
 * A list of all the available voices that Internote
 * supports for TTS.
 */
export type AvailableVoice = "Male" | "Female";
