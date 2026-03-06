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

    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

    let downloadUrl: string;

    if (format === 'audio') {
      // MP3 download - best quality
      downloadUrl = `https://cnvmp3.com/download.php?url=${encodeURIComponent(youtubeUrl)}`;
    } else {
      // MP4 video download - best quality
      downloadUrl = `https://ssyoutube.com/watch?v=${videoId}`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        url: downloadUrl,
        format: format === 'audio' ? 'mp3' : 'mp4',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Download error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to process download request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
