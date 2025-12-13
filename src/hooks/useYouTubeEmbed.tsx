import { useState, useRef, useCallback, useEffect } from 'react';
import { backgroundAudioService } from '@/services/BackgroundAudioService';

interface YouTubeState {
  isPlaying: boolean;
  currentVideoId: string | null;
  volume: number;
  isLoading: boolean;
}

export const useYouTubeEmbed = () => {
  const [state, setState] = useState<YouTubeState>({
    isPlaying: false,
    currentVideoId: null,
    volume: 70,
    isLoading: false,
  });

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hiddenContainerRef = useRef<HTMLDivElement | null>(null);

  // Detecta se é iOS
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (iframeRef.current) {
        iframeRef.current.src = '';
        iframeRef.current.remove();
        iframeRef.current = null;
      }
      backgroundAudioService.stopAudio();
    };
  }, []);

  // Manter áudio em segundo plano
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && state.isPlaying) {
        // Mantém o serviço de áudio em segundo plano ativo
        backgroundAudioService.startAudio(state.currentVideoId || '');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [state.isPlaying, state.currentVideoId]);

  const createIframe = useCallback((videoId: string, showVisible: boolean = true) => {
    // Usa container visível ou oculto baseado no parâmetro
    const container = showVisible ? containerRef.current : hiddenContainerRef.current;
    if (!container) {
      console.error('Container não encontrado');
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    // Remove iframe anterior
    if (iframeRef.current) {
      iframeRef.current.src = '';
      iframeRef.current.remove();
      iframeRef.current = null;
    }

    // Limpa ambos os containers
    if (containerRef.current) containerRef.current.innerHTML = '';
    if (hiddenContainerRef.current) hiddenContainerRef.current.innerHTML = '';

    // Cria novo iframe
    const iframe = document.createElement('iframe');
    iframe.id = `yt-embed-${Date.now()}`;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('playsinline', 'true');
    iframe.setAttribute('frameborder', '0');
    
    if (showVisible) {
      iframe.style.cssText = 'width:100%;height:200px;border-radius:12px;background:#000;';
    } else {
      // Player oculto para background
      iframe.style.cssText = 'width:1px;height:1px;position:absolute;opacity:0.01;pointer-events:none;';
    }

    // Parâmetros do YouTube otimizados para reprodução contínua
    const params = new URLSearchParams({
      autoplay: isIOS ? '0' : '1',
      mute: '0',
      controls: showVisible ? '1' : '0',
      playsinline: '1',
      rel: '0',
      modestbranding: '1',
      loop: '1',
      playlist: videoId,
      enablejsapi: '1',
      origin: window.location.origin,
      fs: '1',
    });

    iframe.src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    
    iframe.onload = () => {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        isPlaying: !isIOS,
        currentVideoId: videoId,
      }));
      
      // Atualiza o serviço de áudio em segundo plano
      backgroundAudioService.startAudio(videoId);
    };

    container.appendChild(iframe);
    iframeRef.current = iframe;
  }, [isIOS]);

  const play = useCallback((videoId: string, showVisible: boolean = true) => {
    createIframe(videoId, showVisible);
  }, [createIframe]);

  const stop = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = '';
      iframeRef.current.remove();
      iframeRef.current = null;
    }
    if (containerRef.current) containerRef.current.innerHTML = '';
    if (hiddenContainerRef.current) hiddenContainerRef.current.innerHTML = '';
    
    // Para o serviço de áudio em segundo plano
    backgroundAudioService.stopAudio();
    
    setState({
      isPlaying: false,
      currentVideoId: null,
      volume: state.volume,
      isLoading: false,
    });
  }, [state.volume]);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume }));
    backgroundAudioService.setVolume(volume);
  }, []);

  return {
    isPlaying: state.isPlaying,
    currentVideoId: state.currentVideoId,
    volume: state.volume,
    isLoading: state.isLoading,
    isIOS,
    containerRef,
    hiddenContainerRef,
    play,
    stop,
    setVolume,
  };
};

export default useYouTubeEmbed;
