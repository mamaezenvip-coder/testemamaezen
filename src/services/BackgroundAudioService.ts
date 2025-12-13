import { Capacitor } from '@capacitor/core';

/**
 * Background Audio Service for Capacitor Native Apps
 * Enables audio playback when the app is in the background or screen is off
 */

interface AudioState {
  isPlaying: boolean;
  currentVideoId: string | null;
  volume: number;
}

class BackgroundAudioService {
  private static instance: BackgroundAudioService;
  private audioState: AudioState = {
    isPlaying: false,
    currentVideoId: null,
    volume: 70,
  };
  private wakeLock: WakeLockSentinel | null = null;

  private constructor() {
    this.setupVisibilityHandler();
  }

  public static getInstance(): BackgroundAudioService {
    if (!BackgroundAudioService.instance) {
      BackgroundAudioService.instance = new BackgroundAudioService();
    }
    return BackgroundAudioService.instance;
  }

  /**
   * Setup visibility change handler to maintain audio during background
   */
  private setupVisibilityHandler(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && this.audioState.isPlaying) {
          this.requestWakeLock();
        }
      });
    }
  }

  /**
   * Request a wake lock to prevent the device from sleeping
   */
  private async requestWakeLock(): Promise<void> {
    if ('wakeLock' in navigator) {
      try {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
        console.log('Wake Lock acquired for background audio');
      } catch (err) {
        console.log('Wake Lock not available:', err);
      }
    }
  }

  /**
   * Release the wake lock when audio stops
   */
  private async releaseWakeLock(): Promise<void> {
    if (this.wakeLock) {
      try {
        await this.wakeLock.release();
        this.wakeLock = null;
        console.log('Wake Lock released');
      } catch (err) {
        console.log('Error releasing wake lock:', err);
      }
    }
  }

  /**
   * Check if running on native platform (iOS/Android via Capacitor)
   */
  public isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Get the current platform
   */
  public getPlatform(): string {
    return Capacitor.getPlatform();
  }

  /**
   * Start audio playback
   */
  public startAudio(videoId: string): void {
    this.audioState = {
      ...this.audioState,
      isPlaying: true,
      currentVideoId: videoId,
    };
    this.requestWakeLock();
  }

  /**
   * Stop audio playback
   */
  public stopAudio(): void {
    this.audioState = {
      ...this.audioState,
      isPlaying: false,
      currentVideoId: null,
    };
    this.releaseWakeLock();
  }

  /**
   * Set volume
   */
  public setVolume(volume: number): void {
    this.audioState.volume = Math.max(0, Math.min(100, volume));
  }

  /**
   * Get current audio state
   */
  public getState(): AudioState {
    return { ...this.audioState };
  }

  /**
   * Check if audio is currently playing
   */
  public isPlaying(): boolean {
    return this.audioState.isPlaying;
  }
}

export const backgroundAudioService = BackgroundAudioService.getInstance();
export default BackgroundAudioService;
