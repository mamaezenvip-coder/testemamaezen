const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoId, format } = await req.json();

    if (!videoId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Video ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use cobalt.tools API for YouTube downloads
    const cobaltResponse = await fetch('https://api.cobalt.tools/api/json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${videoId}`,
        vCodec: 'h264',
        vQuality: '720',
        aFormat: 'mp3',
        isAudioOnly: format === 'audio',
        filenamePattern: 'basic',
      }),
    });

    const data = await cobaltResponse.json();

    if (data.status === 'error') {
      // Fallback: provide direct YouTube link
      return new Response(
        JSON.stringify({
          success: true,
          fallback: true,
          url: format === 'audio'
            ? `https://www.y2mate.com/youtube-mp3/${videoId}`
            : `https://www.y2mate.com/youtube/${videoId}`,
          message: 'Redirect to download service',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        url: data.url || data.audio,
        filename: data.filename,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Download error:', error);
    // Fallback on any error
    const { videoId, format } = await req.clone().json().catch(() => ({ videoId: '', format: 'audio' }));
    return new Response(
      JSON.stringify({
        success: true,
        fallback: true,
        url: format === 'audio'
          ? `https://www.y2mate.com/youtube-mp3/${videoId}`
          : `https://www.y2mate.com/youtube/${videoId}`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
