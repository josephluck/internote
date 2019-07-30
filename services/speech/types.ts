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
   * A public-read URL pointing to the audio file
   * that has been made
   */
  src: string;
}

/**
 * A list of all the available voices that Internote
 * supports for TTS.
 */
export type AvailableVoice =
  | "Joey"
  | "Justin"
  | "Matthew"
  | "Ivy"
  | "Joanna"
  | "Kendra"
  | "Brian"
  | "Amy"
  | "Emma"
  | "Nicole"
  | "Russell";