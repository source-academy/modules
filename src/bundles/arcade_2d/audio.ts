/**
 * This file contains Arcade2D's representation of audio clips and sound.
 */

/**
 * Encapsulates the representation of AudioClips.
 * AudioClips are unique - there are no AudioClips with the same URL.
 */
export class AudioClip {
  private static audioClipCount: number = 0;
  // Stores AudioClip index with the URL as a unique key.
  private static audioClipsIndexMap: Map<string, number> = new Map<string, number>();
  // Stores all the created AudioClips
  private static audioClipsArray: Array<AudioClip> = [];
  public readonly id: number;

  private isUpdated: boolean = false;
  private shouldPlay: boolean = false;
  private shouldLoop: boolean = false;

  private constructor(
    private url: string,
    private volumeLevel: number,
  ) {
    this.id = AudioClip.audioClipCount++;
    AudioClip.audioClipsIndexMap.set(url, this.id);
    AudioClip.audioClipsArray.push(this);
  }

  /**
   * Factory method to create new AudioClip if unique URL provided.
   * Otherwise returns the previously created AudioClip.
   */
  public static of(url: string, volumeLevel: number): AudioClip {
    if (url === '') {
      throw new Error('AudioClip URL cannot be empty');
    }
    if (AudioClip.audioClipsIndexMap.has(url)) {
      return AudioClip.audioClipsArray[AudioClip.audioClipsIndexMap.get(url) as number];
    }
    return new AudioClip(url, volumeLevel);
  }
  public getUrl() {
    return this.url;
  }
  public getVolumeLevel() {
    return this.volumeLevel;
  }
  public shouldAudioClipLoop() {
    return this.shouldLoop;
  }
  public shouldAudioClipPlay() {
    return this.shouldPlay;
  }
  public setShouldAudioClipLoop(loop: boolean) {
    if (this.shouldLoop !== loop) {
      this.shouldLoop = loop;
      this.isUpdated = false;
    }
  }
  /**
   * Updates the play/pause state.
   * @param play When true, the Audio Clip has a playing state.
   */
  public setShouldAudioClipPlay(play: boolean) {
    this.shouldPlay = play;
    this.isUpdated = false;
  }
  /**
   * Checks if the Audio Clip needs to update. Updates the flag if true.
   */
  public hasAudioClipUpdates() {
    const prevValue = !this.isUpdated;
    this.setAudioClipUpdated();
    return prevValue;
  }
  public setAudioClipUpdated() {
    this.isUpdated = true;
  }
  public static getAudioClipsArray() {
    return AudioClip.audioClipsArray;
  }

  public toReplString = () => '<AudioClip>';

  /** @override */
  public toString = () => this.toReplString();
}
