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
  private static audioClips: Map<string, number> = new Map<string, number>();
  // storea all the created AudioClips
  private static audioClipsArray: AudioClip[] = [];
  protected audioClipNotUpdated: boolean = true;
  public readonly id: number;

  private playClip: boolean = false;
  private loop: boolean = false;

  private constructor(
    private url: string,
  ) {
    this.id = AudioClip.audioClipCount++;
    AudioClip.audioClips.set(url, this.id);
    AudioClip.audioClipsArray.push(this);
  }

  /**
   * Factory method to create new AudioClip if unique URL provided.
   * Otherwise returns the previously created AudioClip.
   */
  public static of(url: string): AudioClip {
    if (url === '') {
      throw new Error('AudioClip URL cannot be empty');
    }
    if (AudioClip.audioClips.has(url)) {
      return AudioClip.audioClipsArray[AudioClip.audioClips.get(url) as number];
    }
    return new AudioClip(url);
  }
  public getUrl() {
    return this.url;
  }
  public getLoop() {
    return this.loop;
  }
  public shouldPlayClip() {
    return this.playClip;
  }
  public loopAudioClip(loop: boolean) {
    if (this.loop !== loop) {
      this.loop = loop;
      this.audioClipNotUpdated = true;
    }
  }
  public playAudioClip(play: boolean) {
    if (this.playClip !== play) {
      this.playClip = play;
      this.audioClipNotUpdated = true;
    }
  }
  /**
   * Checks if the Audio Clip needs to update. Updates the flag if true.
   */
  public hasAudioClipUpdates() {
    const temp = this.audioClipNotUpdated;
    this.updatedAudioClip();
    return temp;
  }
  public updatedAudioClip() {
    this.audioClipNotUpdated = false;
  }
  public static getAudioClipsArray() {
    return AudioClip.audioClipsArray;
  }
  public toReplString = () => '<AudioClip>';
}
